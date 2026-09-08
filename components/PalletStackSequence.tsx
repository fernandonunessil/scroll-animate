"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Cpu, Layers, ShieldCheck, Box } from "lucide-react";

interface PalletStackSequenceProps {
  totalFrames?: number;
  framePattern?: (index: number) => string;
}

export default function PalletStackSequence({
  totalFrames = 150,
  framePattern = (i) => `/frames/scrap_pallet_${i}.webp`,
}: PalletStackSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Referências para o HUD (evita re-renderizações React a cada frame de scroll)
  const frameDisplayRef = useRef<HTMLSpanElement>(null);
  const scrollDisplayRef = useRef<HTMLSpanElement>(null);

  // Buffer de imagens pré-carregadas na memória
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderFrameId = useRef<number | null>(null);
  const currentFrameIndexRef = useRef<number>(1);
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Estados de carregamento inicial
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Sincronização de scroll via Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // -------------------------------------------------------------
  // 1. PRÉ-CARREGAMENTO DAS 150 IMAGENS COM TRAVA DE SCROLL
  // -------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    document.body.classList.add("loading-locked");

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = framePattern(i);

      const onImageLoad = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setIsLoaded(true);
          document.body.classList.remove("loading-locked");
        }
      };

      const onImageError = () => {
        if (isCancelled) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === totalFrames) {
          setIsLoaded(true);
          document.body.classList.remove("loading-locked");
        }
      };

      img.onload = onImageLoad;
      img.onerror = onImageError;
      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      isCancelled = true;
      document.body.classList.remove("loading-locked");
    };
  }, [totalFrames, framePattern]);

  // -------------------------------------------------------------
  // 2. LÓGICA DE DESENHO NO CANVAS COM REQUESTANIMATIONFRAME
  // -------------------------------------------------------------
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const safeIndex = Math.min(totalFrames, Math.max(1, frameIndex));
      const img = imagesRef.current[safeIndex - 1];

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const { width: canvasWidth, height: canvasHeight } = canvas;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;
      let drawX: number;
      let drawY: number;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    [totalFrames],
  );

  // -------------------------------------------------------------
  // 3. REDIMENSIONAMENTO ESTÁVEL (Anti-Shake com Tolerância)
  // -------------------------------------------------------------
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    // Só reatribui tamanho se houver variação real superior a 2px (previne jitter de layout)
    if (
      Math.abs(canvasSizeRef.current.w - targetWidth) > 2 ||
      Math.abs(canvasSizeRef.current.h - targetHeight) > 2
    ) {
      canvasSizeRef.current = { w: targetWidth, h: targetHeight };
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      drawFrame(currentFrameIndexRef.current);
    }
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isLoaded) {
      handleResize();
      drawFrame(1);
    }
  }, [isLoaded, handleResize, drawFrame]);

  // -------------------------------------------------------------
  // 4. MAPEAR SCROLL PROGRESS PARA FRAME (Zero React Re-renders)
  // -------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latestProgress) => {
      if (!isLoaded) return;

      const targetIndex = Math.min(
        totalFrames,
        Math.max(1, Math.round(latestProgress * (totalFrames - 1)) + 1),
      );

      // Atualiza o HUD diretamente no DOM sem re-renderizar o React inteiro
      if (frameDisplayRef.current) {
        frameDisplayRef.current.textContent = `${String(targetIndex).padStart(3, "0")} / ${totalFrames}`;
      }
      if (scrollDisplayRef.current) {
        scrollDisplayRef.current.textContent = `${Math.round(latestProgress * 100)}%`;
      }

      if (targetIndex !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = targetIndex;

        if (renderFrameId.current) {
          cancelAnimationFrame(renderFrameId.current);
        }

        renderFrameId.current = requestAnimationFrame(() => {
          drawFrame(targetIndex);
        });
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isLoaded, totalFrames, drawFrame]);

  // -------------------------------------------------------------
  // 5. ANIMAÇÕES DE TEXTO SUAVES (Zero Reflow / Apenas Opacity e Y)
  // -------------------------------------------------------------
  // 0% Scroll: Hero no topo
  const opacity0 = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 1, 0], {
    clamp: true,
  });
  const y0 = useTransform(scrollYProgress, [0, 0.12], [0, -30], {
    clamp: true,
  });
  const vis0 = useTransform(opacity0, (v) =>
    v > 0.001 ? "visible" : "hidden",
  );

  // 30% Scroll: Compactação (Lateral Esquerda)
  const opacity30 = useTransform(
    scrollYProgress,
    [0.15, 0.22, 0.35, 0.42],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const y30 = useTransform(
    scrollYProgress,
    [0.15, 0.22, 0.35, 0.42],
    [30, 0, 0, -20],
    { clamp: true },
  );
  const vis30 = useTransform(opacity30, (v) =>
    v > 0.001 ? "visible" : "hidden",
  );

  // 60% Scroll: Empilhamento (Lateral Direita)
  const opacity60 = useTransform(
    scrollYProgress,
    [0.45, 0.52, 0.65, 0.72],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const y60 = useTransform(
    scrollYProgress,
    [0.45, 0.52, 0.65, 0.72],
    [30, 0, 0, -20],
    { clamp: true },
  );
  const vis60 = useTransform(opacity60, (v) =>
    v > 0.001 ? "visible" : "hidden",
  );

  // 90% Scroll: Expedição (Centralizado)
  const opacity90 = useTransform(scrollYProgress, [0.76, 0.84, 1], [0, 1, 1], {
    clamp: true,
  });
  const y90 = useTransform(scrollYProgress, [0.76, 0.85], [30, 0], {
    clamp: true,
  });
  const vis90 = useTransform(opacity90, (v) =>
    v > 0.001 ? "visible" : "hidden",
  );

  const progressPct = Math.round((loadedCount / totalFrames) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-white select-none"
    >
      {/* ------------------------------------------------------- */}
      {/* OVERLAY DE PRÉ-CARREGAMENTO (Loader Industrial Elegante) */}
      {/* ------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-700 pointer-events-none ${
          isLoaded
            ? "opacity-0 invisible"
            : "opacity-100 visible pointer-events-auto"
        }`}
      >
        <div className="flex flex-col items-center max-w-sm w-full px-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2.5 h-2.5 bg-black rounded-xs animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase font-semibold text-black/90">
              SCRAPFLOW METAIS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black/5 rounded text-black/50">
              RECICLADORA INDUSTRIAL
            </span>
          </div>

          <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-black/10 rounded-full" />
            <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs font-medium text-black/80">
              {progressPct}%
            </span>
          </div>

          <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-black transition-all duration-150 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex justify-between w-full font-mono text-[11px] text-black/40">
            <span>CARREGANDO OPERAÇÃO</span>
            <span>
              {loadedCount}/{totalFrames} QUADROS
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* CANVAS STICKY (O Core do Scrollytelling)                */}
      {/* ------------------------------------------------------- */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-white">
        {/* Canvas com máscara suave nas extremidades para Seamless Blending */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 96% 92% at 50% 50%, #000 70%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 96% 92% at 50% 50%, #000 70%, transparent 100%)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* ----------------------------------------------------- */}
        {/* HUD INDUSTRIAL (Informações Técnicas de Operação)     */}
        {/* ----------------------------------------------------- */}
        <div className="absolute top-20 left-6 md:left-12 z-20 pointer-events-none hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/10 bg-white/85 backdrop-blur-md shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[10px] tracking-wider text-black/70 uppercase">
              PÁTIO DE TRIAGEM & PRENSAGEM // OPERAÇÃO CONTÍNUA
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 md:right-12 z-20 pointer-events-none flex items-center gap-6 font-mono text-[11px] text-black/50 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5">
          <div className="flex items-center gap-2">
            <span className="text-black/30">ETAPA</span>
            <span ref={frameDisplayRef} className="font-semibold text-black/80">
              001 / {totalFrames}
            </span>
          </div>
          <div className="h-3 w-[1px] bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-black/30">ROLAGEM</span>
            <span
              ref={scrollDisplayRef}
              className="font-semibold text-black/80"
            >
              0%
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* SEÇÕES DE TEXTO NARRATIVO (THE STORY OVERLAYS)       */}
        {/* ----------------------------------------------------- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* SEÇÃO 1: 0% Scroll - Hero Posicionado no Topo (Palete livre no centro) */}
          <motion.div
            style={{
              opacity: opacity0,
              y: y0,
              visibility: vis0,
            }}
            className="absolute top-20 sm:top-24 left-0 right-0 mx-auto flex flex-col items-center text-center w-[92vw] max-w-3xl px-4 z-20 will-change-transform"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-black/10 bg-white/90 backdrop-blur-md shadow-2xs">
              <Cpu className="w-3.5 h-3.5 text-black/70" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-black/70 font-medium">
                Reciclagem Industrial de Sucatas Metálicas
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.08] mb-4">
              Transformando Sucata em Matéria-Prima.
            </h1>
            <p className="text-sm sm:text-base text-black/60 max-w-xl font-normal leading-relaxed mb-4">
              Coleta, triagem técnica e prensagem de descartes ferrosos e
              não-ferrosos em fardos de alta densidade para pronto
              reabastecimento de siderúrgicas e fundições.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-black/50 tracking-wider bg-black/5 px-3 py-1 rounded-full">
              <span>ROLE PARA VER O PROCESSO DE COMPACTAÇÃO</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-black/70" />
            </div>
          </motion.div>

          {/* SEÇÃO 2: 30% Scroll - Lateral Esquerda com Dimensão Fixa */}
          <motion.div
            style={{
              opacity: opacity30,
              y: y30,
              visibility: vis30,
            }}
            className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-10 md:left-16 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] z-20 will-change-transform"
          >
            <div className="p-6 sm:p-8 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md shadow-lg shadow-black/5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded-full border border-black/10 bg-black/[0.03]">
                <Box className="w-3.5 h-3.5 text-black/70" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-black/70 font-medium">
                  Etapa 01 // Prensagem 3.200 PSI
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-black/90 leading-[1.1] mb-3">
                Compactação de Alta Precisão.
              </h2>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed mb-4 font-normal">
                Prensas hidráulicas de grande tonelagem compactam sobras de
                estamparia, cavacos e chapas em blocos cúbicos padronizados,
                eliminando bolsas de ar para atingir +85% de densidade sólida.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10">
                <div>
                  <span className="block font-mono text-[10px] uppercase text-black/40">
                    Dimensão do Fardo
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-black/80">
                    400 × 400 × 400 mm
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase text-black/40">
                    Peso Médio
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-black/80">
                    ~280 kg / Fardo
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEÇÃO 3: 60% Scroll - Lateral Direita com Dimensão Fixa */}
          <motion.div
            style={{
              opacity: opacity60,
              y: y60,
              visibility: vis60,
            }}
            className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-10 md:right-16 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] z-20 will-change-transform text-right"
          >
            <div className="p-6 sm:p-8 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md shadow-lg shadow-black/5 text-right">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 rounded-full border border-black/10 bg-black/[0.03]">
                <Layers className="w-3.5 h-3.5 text-black/70" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-black/70 font-medium">
                  Etapa 02 // Paletização Inteligente
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-black/90 leading-[1.1] mb-3">
                Empilhamento para Eficiência.
              </h2>
              <p className="text-xs sm:text-sm text-black/60 leading-relaxed mb-4 font-normal">
                Pórticos robotizados alinham os fardos compactados com precisão
                milimétrica sobre paletes de madeira reforçados, maximizando a
                carga útil do transporte e zerando perdas no frete.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/10">
                <div className="text-right">
                  <span className="block font-mono text-[10px] uppercase text-black/40">
                    Ganho de Carga
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-emerald-600">
                    +42% no Frete
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] uppercase text-black/40">
                    Estabilidade
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-black/80">
                    Gravidade Neutra
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEÇÃO 4: 90% Scroll - Centralizado com Dimensão Fixa */}
          <motion.div
            style={{
              opacity: opacity90,
              y: y90,
              visibility: vis90,
            }}
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto w-[calc(100vw-2rem)] sm:w-[500px] max-w-[500px] z-20 will-change-transform"
          >
            <div className="w-full p-8 sm:p-10 rounded-3xl border border-black/10 bg-white/95 backdrop-blur-md shadow-xl shadow-black/5 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-black/10 bg-emerald-50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-800 font-semibold">
                  Etapa 03 // Pronto para Expedição e Fundição
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-black/90 leading-[1.1] mb-3">
                Pronto para o Forno.
              </h2>
              <p className="text-xs sm:text-sm text-black/60 max-w-md leading-relaxed mb-6 font-normal">
                Palete 100% carregado, cintado, identificado e com laudo de
                espectrometria emitido. Pronto para embarque direto aos fornos
                elétricos a arco (FEA) e fornos de indução.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pointer-events-auto">
                <a
                  href="#metais"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-black/80 transition-colors shadow-xs text-center"
                >
                  Ver Tipos de Metais
                </a>
                <a
                  href="#contato"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-black/15 text-black/80 text-xs font-mono uppercase tracking-wider hover:bg-black/5 transition-colors text-center"
                >
                  Solicitar Coleta / Cotação
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
