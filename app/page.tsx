import React from "react";
import PalletStackSequence from "@/components/PalletStackSequence";
import {
  ArrowUpRight,
  CheckCircle2,
  Recycle,
  Scale,
  Zap,
  Globe2,
  Factory,
  ShieldCheck,
  Truck,
  FileText,
  BadgePercent,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* BARRA DE NAVEGAÇÃO INDUSTRIAL                                 */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-black/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <span className="w-3 h-3 bg-black rounded-xs transition-transform duration-300 group-hover:rotate-45" />
              <span className="font-mono text-sm tracking-widest font-bold uppercase text-black/90">
                SCRAPFLOW METAIS
              </span>
            </a>
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/5 border border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-black/60 uppercase tracking-wide">
                Licenciamento Ambiental Pleno // CETESB & IBAMA
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-black/60">
            <a href="#processo" className="hover:text-black transition-colors">
              Processo
            </a>
            <a href="#metais" className="hover:text-black transition-colors">
              Metais
            </a>
            <a
              href="#diferenciais"
              className="hover:text-black transition-colors"
            >
              Logística In-Company
            </a>
            <a
              href="#sustentabilidade"
              className="hover:text-black transition-colors"
            >
              Impacto ESG
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-black/85 transition-all shadow-xs"
            >
              <span>Vender Sucata / Comprar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SCROLLYTELLING CORE (400vh - Prensagem e Paletização)        */}
      {/* ------------------------------------------------------------- */}
      <div id="processo">
        <PalletStackSequence />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MÉTRICAS TÉCNICAS E RENDIMENTO DE FUSÃO                      */}
      {/* ------------------------------------------------------------- */}
      <section
        id="sustentabilidade"
        className="relative py-28 px-6 border-t border-black/10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3 block">
                Eficiência Operacional // Padrão Siderúrgico
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-black/90">
                A sucata da sua indústria transformada em matéria-prima de alto
                valor.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-black/60 leading-relaxed">
              O descarte desorganizado de sobras metálicas gera perdas
              logísticas e riscos ambientais. A ScrapFlow coleta, classifica e
              compacta retalhos industriais em fardos de alta densidade para
              pronto abastecimento de fornos elétricos e fundições.
            </p>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Scale className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                85%+
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Densidade do Fardo
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Prensagem hidráulica de 3.200 PSI elimina bolsas de ar,
                reduzindo volume de transporte e aumentando rendimento no forno.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Zap className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                -84%
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Emissões de CO₂
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                A reciclagem de sucatas ferrosas e não-ferrosas poupa até 84% da
                energia consumida na mineração primária.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Factory className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                99.4%
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Pureza Espectrométrica
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Classificação com analisador laser portátil XRF que atesta a
                composição exata das ligas antes da prensagem.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Globe2 className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                120.000 t
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Capacidade Anual
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Logística com frota própria de caminhões Roll-on/Roll-off,
                poli-guindastes e carretas graneleiras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CATÁLOGO DE METAIS PROCESSADOS                                */}
      {/* ------------------------------------------------------------- */}
      <section
        id="metais"
        className="py-24 px-6 border-t border-black/10 bg-black/[0.01]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3 block">
              Materiais Homologados // Compra & Fornecimento
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-black/90">
              Compramos e processamos todos os tipos de sucatas metálicas
              industriais.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Metal 1: Aço Carbono */}
            <div className="p-6 rounded-2xl border border-black/10 bg-white hover:border-black/30 transition-all shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-mono text-xs font-bold mb-4">
                Fe
              </div>
              <h3 className="font-semibold text-lg text-black/90 mb-2">
                Aço Carbono & Ferro
              </h3>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                Retalhos de estamparia nova, chaparia automotiva, vigas I/U
                estruturais, cavacos de usinagem e sucatas de demolição pesada.
              </p>
              <div className="pt-3 border-t border-black/5 font-mono text-[11px] text-black/50">
                Padrão: Fardos 400x400mm ou Granel Cortado
              </div>
            </div>

            {/* Metal 2: Alumínio */}
            <div className="p-6 rounded-2xl border border-black/10 bg-white hover:border-black/30 transition-all shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-mono text-xs font-bold mb-4">
                Al
              </div>
              <h3 className="font-semibold text-lg text-black/90 mb-2">
                Alumínio Industrial
              </h3>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                Perfis de esquadria limpos, chapas de caldeiraria, blocos de
                motor, estamparia de latas e cavacos prensados sob alta pressão.
              </p>
              <div className="pt-3 border-t border-black/5 font-mono text-[11px] text-black/50">
                Pureza: Ligas 6063, 6061, 3003 e Blocos
              </div>
            </div>

            {/* Metal 3: Cobre e Bronze */}
            <div className="p-6 rounded-2xl border border-black/10 bg-white hover:border-black/30 transition-all shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-mono text-xs font-bold mb-4">
                Cu
              </div>
              <h3 className="font-semibold text-lg text-black/90 mb-2">
                Cobre, Bronze & Latão
              </h3>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                Cobre mel de primeira linha, fios elétricos desencapados,
                barramentos de painéis, tubulações e retalhos de usinagem de
                latão.
              </p>
              <div className="pt-3 border-t border-black/5 font-mono text-[11px] text-black/50">
                Controle: Análise Óptica e Pesagem Precisa
              </div>
            </div>

            {/* Metal 4: Inox e Ligas Nobres */}
            <div className="p-6 rounded-2xl border border-black/10 bg-white hover:border-black/30 transition-all shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center font-mono text-xs font-bold mb-4">
                Ni
              </div>
              <h3 className="font-semibold text-lg text-black/90 mb-2">
                Aço Inox & Ligas Nobres
              </h3>
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                Sucatas de aço inoxidável das séries 304, 316 e 430, titânio
                aeronáutico, inconel, monel e aços-ferramenta de matrizaria.
              </p>
              <div className="pt-3 border-t border-black/5 font-mono text-[11px] text-black/50">
                Rastreabilidade: Laudo Químico por Lote
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* DIFERENCIAIS PARA GERADORES E INDÚSTRIAS                      */}
      {/* ------------------------------------------------------------- */}
      <section
        id="diferenciais"
        className="py-24 px-6 border-t border-black/10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3 block">
                Soluções para Geradores Industriais
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-black/90">
                Gestão completa de sucata dentro da sua empresa.
              </h2>
            </div>
            <p className="max-w-md text-sm text-black/60 leading-relaxed">
              Atendemos indústrias automotivas, metalúrgicas, caldeirarias e
              usinagens com estrutura completa de armazenamento, logística e
              conformidade jurídica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01]">
              <Truck className="w-6 h-6 text-black/80 mb-4" />
              <h3 className="text-lg font-semibold text-black/90 mb-2">
                Caçambas Estacionárias
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Disponibilizamos caçambas roll-on e poliguindastes de 5m³ a 30m³
                no pátio da sua fábrica, com cronograma de troca rápido e sem
                atrasos.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01]">
              <Scale className="w-6 h-6 text-black/80 mb-4" />
              <h3 className="text-lg font-semibold text-black/90 mb-2">
                Pesagem Certificada INMETRO
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Balanças rodoviárias eletrônicas aferidas com emissão de ticket
                de pesagem na hora da retirada, garantindo transparência
                financeira absoluta.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01]">
              <FileText className="w-6 h-6 text-black/80 mb-4" />
              <h3 className="text-lg font-semibold text-black/90 mb-2">
                MTR, CDF e Licenças Ambientais
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">
                Emissão imediata de Manifesto de Transporte de Resíduos (MTR via
                SINIR) e Certificado de Destinação Final (CDF), blindando sua
                empresa contra passivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CALL TO ACTION FINAL / COMERCIAL                              */}
      {/* ------------------------------------------------------------- */}
      <section
        id="contato"
        className="py-28 px-6 border-t border-black/10 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-black/10 bg-black/[0.02]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-black/60 font-medium">
              Departamento Comercial & Compras
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black/90 mb-6">
            Transforme o refugo metálico da sua indústria em liquidez imediata.
          </h2>

          <p className="text-base sm:text-lg text-black/60 max-w-xl mx-auto leading-relaxed mb-10">
            Compramos lotes avulsos ou fechamos contratos de fornecimento
            contínuo para compras de sucata industrial e venda de fardos para
            fundições.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-black/85 transition-all shadow-sm">
              Solicitar Avaliação de Lote / Caçamba
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-black/15 text-black/80 text-sm font-medium hover:bg-black/5 transition-all">
              Falar com Engenheiro de Materiais
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-black/50 pt-10 border-t border-black/5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              MTR e SINIR Integrados
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Licença CETESB / IBAMA
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Pagamento à Vista / Sem Intermediários
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* RODAPÉ INSTITUCIONAL                                          */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-10 px-6 border-t border-black/5 bg-white font-mono text-xs text-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-xs" />
            <span className="font-semibold text-black/80">
              SCRAPFLOW RECICLAGEM E METAIS INDUSTRIAIS
            </span>
            <span>// © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-black transition-colors">
              Política Ambiental
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Termos de Compra
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Portal do Fornecedor
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
