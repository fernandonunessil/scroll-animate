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
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* MINIMALIST INDUSTRIAL NAVBAR                                  */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <span className="w-3 h-3 bg-black rounded-xs transition-transform duration-300 group-hover:rotate-45" />
              <span className="font-mono text-sm tracking-widest font-bold uppercase text-black/90">
                SCRAPFLOW
              </span>
            </a>
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/5 border border-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[10px] text-black/60 uppercase tracking-wide">
                EAF Ready Feedstock // ISO 14001
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-black/60">
            <a href="#process" className="hover:text-black transition-colors">
              Process
            </a>
            <a
              href="#specifications"
              className="hover:text-black transition-colors"
            >
              Specifications
            </a>
            <a
              href="#sustainability"
              className="hover:text-black transition-colors"
            >
              Impact
            </a>
            <a href="#network" className="hover:text-black transition-colors">
              Foundry Network
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-black/85 transition-all shadow-xs"
            >
              <span>Partner With Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* CORE SCROLLYTELLING SEQUENCE (400vh Interactive Canvas)       */}
      {/* ------------------------------------------------------------- */}
      <PalletStackSequence />

      {/* ------------------------------------------------------------- */}
      {/* TECHNICAL SPECIFICATIONS & METRICS (Awwwards Industrial)     */}
      {/* ------------------------------------------------------------- */}
      <section
        id="specifications"
        className="relative py-32 px-6 border-t border-black/10 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3 block">
                Standardized Metrics // System 01
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-black/90">
                Precision metallurgy engineered for zero waste.
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-black/60 leading-relaxed">
              Traditional loose scrap creates hazardous logistic inefficiencies
              and furnace slag. ScrapFlow compresses alloy streams into
              high-density geometry for immediate smelting.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Scale className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                85%+
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Compaction Solidity
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Eliminates atmospheric voids, preventing oxidation during
                storage and rail logistics.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Zap className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                -84%
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                CO₂ vs Virgin Smelting
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Reclaiming industrial scrap yields significant carbon offsets
                for steel and alloy producers.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Factory className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                99.4%
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Spectrometric Purity
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                XRF laser spectrometry guarantees contaminant-free batching
                prior to baling and stacking.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-black/[0.01] hover:border-black/25 transition-colors">
              <Globe2 className="w-6 h-6 text-black/80 mb-4" />
              <div className="text-4xl font-medium tracking-tight text-black/90 mb-1">
                120k t
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-black/40 mb-3">
                Annual Logistics Volume
              </div>
              <p className="text-xs text-black/60 leading-relaxed">
                Reliable feedstock channel operating across 14 deep-water ports
                and intermodal dry terminals.
              </p>
            </div>
          </div>

          {/* Process Breakdown Table */}
          <div className="border border-black/10 rounded-2xl p-8 bg-black/[0.01]">
            <div className="flex items-center gap-2 mb-6">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <h3 className="font-mono text-xs tracking-widest uppercase font-semibold text-black/80">
                End-to-End Circular Lifecycle Architecture
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="font-mono text-xs font-semibold text-black/90">
                  01 // Robotic Ingest & Sorting
                </div>
                <p className="text-sm text-black/60 leading-relaxed">
                  Heavy automotive stampings, aerospace trimmings, and
                  structural offcuts are separated via optical hyperspectral
                  sensors.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-mono text-xs font-semibold text-black/90">
                  02 // Hyper-Dense Baling
                </div>
                <p className="text-sm text-black/60 leading-relaxed">
                  Dual-ram 3,200 PSI hydraulic presses compress scrap into
                  uniform 400mm modular cubes, reducing transportation
                  emissions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="font-mono text-xs font-semibold text-black/90">
                  03 // Automated Palletized Transit
                </div>
                <p className="text-sm text-black/60 leading-relaxed">
                  Precision stacked pallets load directly into 20ft/40ft
                  containers with zero wasted headspace, ready for electric arc
                  furnaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FINAL CALL TO ACTION / FOOTER                                 */}
      {/* ------------------------------------------------------------- */}
      <section
        id="contact"
        className="py-24 px-6 border-t border-black/10 bg-white"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-black/10 bg-black/[0.02]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-black/60 font-medium">
              Direct Foundry Procurement
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-black/90 mb-6">
            Powering the green steel transition.
          </h2>

          <p className="text-base sm:text-lg text-black/60 max-w-xl mx-auto leading-relaxed mb-10">
            Secure predictable, high-grade compacted scrap allocations directly
            to your facility. Custom alloy configurations available on spot or
            multi-year terms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="px-8 py-4 rounded-full bg-black text-white text-sm font-medium hover:bg-black/85 transition-all shadow-sm">
              Initiate Supply Agreement
            </button>
            <button className="px-8 py-4 rounded-full border border-black/15 text-black/80 text-sm font-medium hover:bg-black/5 transition-all">
              Download Material Safety Sheets
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-black/40 pt-10 border-t border-black/5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              EN 10204 3.1 Certified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Chain of Custody Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              GHG Scope 3 Compliant
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-black/5 bg-white font-mono text-xs text-black/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-xs" />
            <span className="font-semibold text-black/80">
              SCRAPFLOW RECOVERY TECHNOLOGIES
            </span>
            <span>// © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-black transition-colors">
              Privacy Protocol
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms of Offtake
            </a>
            <a href="#" className="hover:text-black transition-colors">
              API Telemetry
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
