"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
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

  // Buffer de imagens pré-carregadas na memória
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderFrameId = useRef<number | null>(null);
  const currentFrameIndexRef = useRef<number>(1);

  // Estados de carregamento e interface
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeFrameDisplay, setActiveFrameDisplay] = useState<number>(1);

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

    // Bloquear scroll do usuário até que todas as imagens estejam em memória
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
        // Fallback seguro caso algum frame falhe
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

      // Normalizar índice de 1 a totalFrames
      const safeIndex = Math.min(totalFrames, Math.max(1, frameIndex));
      const img = imagesRef.current[safeIndex - 1];

      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }

      const { width: canvasWidth, height: canvasHeight } = canvas;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Algoritmo de aspect-ratio: "contain"
      // Preserva 100% da proporção sem distorção e centraliza na tela
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number;
      let drawHeight: number;
      let drawX: number;
      let drawY: number;

      if (canvasRatio > imgRatio) {
        // Tela mais larga que a imagem: ajusta pela altura
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        // Tela mais alta que a imagem (mobile/tablet portrait): ajusta pela largura
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
      }

      // Limpar o frame anterior
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Renderizar a imagem no canvas com interpolação de alta qualidade
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    [totalFrames],
  );

  // -------------------------------------------------------------
  // 3. REDIMENSIONAMENTO DINÂMICO COM SUPORTE A RETINA / HIDPI
  // -------------------------------------------------------------
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    const displayWidth = Math.floor(rect.width * dpr);
    const displayHeight = Math.floor(rect.height * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    // Redesenha o frame atual
    drawFrame(currentFrameIndexRef.current);
  }, [drawFrame]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Redesenhar o primeiro frame assim que o pré-carregamento for concluído
  useEffect(() => {
    if (isLoaded) {
      handleResize();
      drawFrame(1);
    }
  }, [isLoaded, handleResize, drawFrame]);

  // -------------------------------------------------------------
  // 4. MAPEAR O SCROLL PARA O FRAME CORRESPONDENTE
  // -------------------------------------------------------------
  useMotionValueEvent(scrollYProgress, "change", (latestProgress) => {
    if (!isLoaded) return;

    // Converte progress (0 -> 1) para índice de frame (1 -> totalFrames)
    const targetIndex = Math.min(
      totalFrames,
      Math.max(1, Math.round(latestProgress * (totalFrames - 1)) + 1),
    );

    if (targetIndex !== currentFrameIndexRef.current) {
      currentFrameIndexRef.current = targetIndex;
      setActiveFrameDisplay(targetIndex);

      if (renderFrameId.current) {
        cancelAnimationFrame(renderFrameId.current);
      }

      renderFrameId.current = requestAnimationFrame(() => {
        drawFrame(targetIndex);
      });
    }
  });

  // -------------------------------------------------------------
  // 5. ANIMAÇÕES DE TEXTO VINCULADAS AO SCROLL (THE STORY)
  // -------------------------------------------------------------
  // 0% Scroll: "Transforming Metal Waste."
  const opacity0 = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const y0 = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  // 30% Scroll: "Precise Compaction."
  const opacity30 = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.38, 0.45],
    [0, 1, 1, 0],
  );
  const y30 = useTransform(scrollYProgress, [0.18, 0.28, 0.45], [40, 0, -30]);

  // 60% Scroll: "Stacking for Efficiency."
  const opacity60 = useTransform(
    scrollYProgress,
    [0.45, 0.55, 0.68, 0.75],
    [0, 1, 1, 0],
  );
  const y60 = useTransform(scrollYProgress, [0.45, 0.55, 0.75], [40, 0, -30]);

  // 90% Scroll: "Ready for Transit."
  const opacity90 = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
  const y90 = useTransform(scrollYProgress, [0.75, 0.88], [40, 0]);

  // HUD: Barra de progresso visual de scroll
  const scrollPercentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const [displayScrollPct, setDisplayScrollPct] = useState(0);

  useMotionValueEvent(scrollPercentage, "change", (latest) => {
    setDisplayScrollPct(Math.round(latest));
  });

  const progressPct = Math.round((loadedCount / totalFrames) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh] bg-white select-none"
    >
      {/* ------------------------------------------------------- */}
      {/* OVERLAY DE PRÉ-CARREGAMENTO (Awwwards Sleek Loader)     */}
      {/* ------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-700 pointer-events-none ${
          isLoaded
            ? "opacity-0 invisible"
            : "opacity-100 visible pointer-events-auto"
        }`}
      >
        <div className="flex flex-col items-center max-w-sm w-full px-6">
          {/* Logo & Marca Industrial */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2.5 h-2.5 bg-black rounded-xs animate-pulse" />
            <span className="font-mono text-xs tracking-widest uppercase font-semibold text-black/90">
              SCRAPFLOW
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black/5 rounded text-black/50">
              SYS-150
            </span>
          </div>

          {/* Spinner minimalista */}
          <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-black/10 rounded-full" />
            <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs font-medium text-black/80">
              {progressPct}%
            </span>
          </div>

          {/* Barra de progresso linear fina */}
          <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-black transition-all duration-150 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Texto de Status */}
          <div className="flex justify-between w-full font-mono text-[11px] text-black/40">
            <span>PRELOADING SEQUENCE</span>
            <span>
              {loadedCount}/{totalFrames} FRAMES
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
            // Máscara suave radial nas bordas: garante que qualquer leve vinheta
            // de estúdio 3D se dissipe 100% de forma invisível no fundo branco puro (#FFFFFF)
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
        {/* HUD INDUSTRIAL (Awwwards Technical Overlays)          */}
        {/* ----------------------------------------------------- */}
        <div className="absolute top-20 left-6 md:left-12 z-20 pointer-events-none hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-black/10 bg-white/80 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-[10px] tracking-wider text-black/70 uppercase">
              LIVE SEQUENCE // 150 FPS ENGINE
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 md:right-12 z-20 pointer-events-none flex items-center gap-6 font-mono text-[11px] text-black/50">
          <div className="flex items-center gap-2">
            <span className="text-black/30">FRAME</span>
            <span className="font-semibold text-black/80">
              {String(activeFrameDisplay).padStart(3, "0")} / {totalFrames}
            </span>
          </div>
          <div className="h-3 w-[1px] bg-black/10" />
          <div className="flex items-center gap-2">
            <span className="text-black/30">SCROLL</span>
            <span className="font-semibold text-black/80">
              {displayScrollPct}%
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* SEÇÕES DE TEXTO NARRATIVO (THE STORY OVERLAYS)       */}
        {/* ----------------------------------------------------- */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center px-6 md:px-16">
          {/* SECTION 1: 0% Scroll - Hero Centralizado */}
          <motion.div
            style={{ opacity: opacity0, y: y0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-black/10 bg-black/[0.02]">
              <Cpu className="w-3.5 h-3.5 text-black/70" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-black/60 font-medium">
                Next-Gen Scrap Metallurgy
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-black/90 leading-[1.05] mb-6">
              Transforming Metal Waste.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black/60 max-w-2xl font-normal leading-relaxed mb-8">
              Engineered closed-loop recycling. We transform discarded
              industrial alloys into standardized, high-density scrap units
              ready for sustainable re-smelting.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-black/40 tracking-wider">
              <span>SCROLL TO INITIALIZE COMPACTION</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-black/60" />
            </div>
          </motion.div>

          {/* SECTION 2: 30% Scroll - Alinhado à Esquerda */}
          <motion.div
            style={{ opacity: opacity30, y: y30 }}
            className="absolute left-6 sm:left-12 md:left-24 max-w-md lg:max-w-lg text-left"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full border border-black/10 bg-black/[0.02]">
              <Box className="w-3.5 h-3.5 text-black/70" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-black/60 font-medium">
                Phase 01 // 3,200 PSI Pressure
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1] mb-4">
              Precise Compaction.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-black/60 leading-relaxed mb-6 font-normal">
              High-tonnage hydraulic baling presses compress mixed alloy offcuts
              into uniform, calibrated cubic blocks. Void spaces are eliminated
              to achieve over 85% solid density.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
              <div>
                <span className="block font-mono text-[10px] uppercase text-black/40">
                  Block Dimension
                </span>
                <span className="font-mono text-sm font-semibold text-black/80">
                  400 × 400 × 400 mm
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-black/40">
                  Unit Weight
                </span>
                <span className="font-mono text-sm font-semibold text-black/80">
                  ~280 kg / Cube
                </span>
              </div>
            </div>
          </motion.div>

          {/* SECTION 3: 60% Scroll - Alinhado à Direita */}
          <motion.div
            style={{ opacity: opacity60, y: y60 }}
            className="absolute right-6 sm:right-12 md:right-24 max-w-md lg:max-w-lg text-right"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded-full border border-black/10 bg-black/[0.02]">
              <Layers className="w-3.5 h-3.5 text-black/70" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-black/60 font-medium">
                Phase 02 // Geometric Stacking
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black/90 leading-[1.1] mb-4">
              Stacking for Efficiency.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-black/60 leading-relaxed mb-6 font-normal">
              Automated robotic gantries align compacted metal blocks with
              sub-millimeter accuracy onto reinforced pallets, maximizing
              spatial volume for global container freight.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
              <div className="text-right">
                <span className="block font-mono text-[10px] uppercase text-black/40">
                  Freight Efficiency
                </span>
                <span className="font-mono text-sm font-semibold text-emerald-600">
                  +42% Volume Gain
                </span>
              </div>
              <div className="text-right">
                <span className="block font-mono text-[10px] uppercase text-black/40">
                  Center of Gravity
                </span>
                <span className="font-mono text-sm font-semibold text-black/80">
                  Balanced Axial
                </span>
              </div>
            </div>
          </motion.div>

          {/* SECTION 4: 90% Scroll - Centralizado (Final Hook) */}
          <motion.div
            style={{ opacity: opacity90, y: y90 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-black/10 bg-black/[0.02]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-black/60 font-medium">
                Phase 03 // Certified Transport Spec
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-black/90 leading-[1.1] mb-6">
              Ready for Transit.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-black/60 max-w-xl leading-relaxed mb-8 font-normal">
              Strapped, barcoded, and ISO 14001 certified. The consolidated
              pallet is ready for intermodal rail and vessel transit directly to
              electric arc furnace foundries.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
              <a
                href="#specifications"
                className="px-6 py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors shadow-xs"
              >
                Inspect Technical Specs
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-full border border-black/15 text-black/80 text-sm font-medium hover:bg-black/5 transition-colors"
              >
                Request Supply Contract
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
