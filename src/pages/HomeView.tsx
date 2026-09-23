import React, { useState } from 'react';
import { HeroSuitCanvas } from '../components/3d/HeroSuitCanvas';
import { MiniSuitPreview } from '../components/3d/MiniSuitPreview';
import { Product } from '../types';
import { STORE_INFO } from '../data/storeInfo';
import { 
  ArrowRight, 
  Rotate3d, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Phone, 
  Scissors, 
  Award,
  ChevronRight,
  Eye,
  Camera,
  Star
} from 'lucide-react';

interface HomeViewProps {
  featuredProducts: Product[];
  onExploreCatalog: () => void;
  onOpenProduct: (productId: string) => void;
  onOpenAtelier: () => void;
  onOpenStoreInfo: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  featuredProducts,
  onExploreCatalog,
  onOpenProduct,
  onOpenAtelier,
  onOpenStoreInfo,
}) => {
  const [activeCardModes, setActiveCardModes] = useState<Record<string, 'photo' | '3d'>>({});

  const toggleMode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCardModes((prev) => ({
      ...prev,
      [id]: prev[id] === '3d' ? 'photo' : '3d',
    }));
  };
  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION: Cinematic 3D Animated Suit */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center overflow-hidden pt-4 pb-12">
        {/* Full-screen 3D Canvas with Real-Time Continuous Rotation & Dynamic Lights */}
        <HeroSuitCanvas
          initialColor="#0a1d37"
          initialType="two_piece"
          onExploreCatalog={onExploreCatalog}
          onOpenCustomizer={onOpenAtelier}
        />

        {/* Semantic DOM Overlay (Anti-AI slop: clean typography, 3-zone discipline) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none relative z-20 w-full mt-[-100px] sm:mt-[-80px] md:mt-[-60px]">
          <div className="max-w-2xl pointer-events-auto space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FF]">
              <span className="w-2 h-2 rounded-full bg-[#0064E0] animate-ping" />
              <span>SPATIAL BESPOKE SHOWROOM · BARUIPUR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-wide leading-tight">
              Command The Room in <span className="meta-gradient-text">Pure Bespoke</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Immerse yourself in our interactive 3D tailoring showroom. Experience realistic cloth physics, custom floating canvas construction, and handcrafted formal business garments from {STORE_INFO.brandName}.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-[0_0_25px_rgba(0,100,224,0.5)] hover:brightness-110 transition-all flex items-center gap-2 group"
              >
                <span>Explore Sartorial Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAtelier}
                className="px-6 py-3.5 rounded-xl glass-button text-xs font-semibold text-white hover:border-[#0064E0] flex items-center gap-2"
              >
                <Rotate3d className="w-4 h-4 text-[#00D2FF]" />
                <span>Launch 3D Atelier</span>
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-[#0064E0]" />
                <span>Horsehair Canvas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0064E0]" />
                <span>30-Day Alteration Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#0064E0]" />
                <span>Baruipur Flagship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BESPOKE COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-1">
              Curated Formal Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-wide">
              Masterpieces of the Season
            </h2>
          </div>
          <button
            onClick={onExploreCatalog}
            className="text-xs text-[#00D2FF] hover:underline flex items-center gap-1 self-start sm:self-auto font-medium"
          >
            <span>View All Garments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.slice(0, 6).map((product) => {
            const currentMode = activeCardModes[product.id] || 'photo';

            return (
              <div
                key={product.id}
                onClick={() => onOpenProduct(product.id)}
                className="group glass-panel rounded-3xl p-5 border border-white/10 hover:border-[#0064E0]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(0,100,224,0.2)]"
              >
                <div>
                  {/* Media Showcase Card Top */}
                  <div className="relative w-full h-80 bg-gradient-to-b from-[#0e121d] to-[#07090e] rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 mb-4 group-hover:border-[#0064E0]/30 transition-colors">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,224,0.12),transparent_70%)] pointer-events-none" />

                    {currentMode === 'photo' ? (
                      /* Real Authentic Photography of Dress / Garment */
                      <div className="relative w-full h-full">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/85 via-transparent to-black/25 pointer-events-none" />
                      </div>
                    ) : (
                      /* 3D Interactive Model */
                      <MiniSuitPreview
                        colorHex={product.colors[0].hex}
                        modelType={product.modelType}
                        width={220}
                        height={270}
                        interactive={true}
                      />
                    )}

                    {/* Quick Mode Switcher Icon on Card Top Right */}
                    <button
                      type="button"
                      onClick={(e) => toggleMode(product.id, e)}
                      className="absolute top-3 right-3 z-10 glass-panel px-2.5 py-1.5 rounded-xl border border-white/20 hover:border-[#00D2FF] text-white text-[10px] font-semibold flex items-center gap-1.5 shadow-lg bg-black/60 hover:bg-black/85 transition-all"
                      title={currentMode === 'photo' ? 'Switch to 3D View' : 'Switch to Photo'}
                    >
                      {currentMode === 'photo' ? (
                        <>
                          <Eye className="w-3 h-3 text-[#00D2FF]" />
                          <span>3D ভিউ</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3 h-3 text-[#00D2FF]" />
                          <span>ফটো ভিউ</span>
                        </>
                      )}
                    </button>

                    {/* Floating Badge */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="glass-panel px-2.5 py-1 rounded-xl text-[10px] text-white font-mono flex items-center gap-1.5 bg-black/60">
                        {currentMode === 'photo' ? (
                          <>
                            <Camera className="w-3 h-3 text-[#00D2FF]" />
                            <span>আসল ফটো (Studio Shot)</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-[#00D2FF]" />
                            <span>3D 360° Inspect</span>
                          </>
                        )}
                      </span>
                      <span className="glass-panel px-2 py-1 rounded-xl text-[10px] text-slate-300 font-mono bg-black/60">
                        {product.fitType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.fabric.weave}</span>
                    </div>
                    <h3 className="text-base font-cinzel font-bold text-white group-hover:text-[#00D2FF] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>
                </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 block">INR including GST</span>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-[#0064E0] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <span>Customize</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* 3. 3D ATELIER SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative glass-panel rounded-3xl p-8 sm:p-12 border border-[#0064E0]/30 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0064E0]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block">
                Next-Generation WebGL Experience
              </span>
              <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-white leading-tight">
                Sculpt Your Bespoke Silhouette in Real Time
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Swap between Super 150s Merino Wool, Italian Cashmere, and Mulberry Silk with physical cloth simulation. Calibrate your body measurements for custom lapel pitch and shoulder drape.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="glass-panel p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 font-mono block">ROTATION</span>
                  <span className="text-xs font-semibold text-white">Full 360° Control</span>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 font-mono block">PHYSICS</span>
                  <span className="text-xs font-semibold text-white">Cloth Flow Simulation</span>
                </div>
                <div className="glass-panel p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 font-mono block">LIGHTING</span>
                  <span className="text-xs font-semibold text-white">4 Studio Rigs</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenAtelier}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <span>Launch Spatial 3D Atelier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-64 h-80 rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center relative shadow-2xl">
                <MiniSuitPreview
                  colorHex="#0a1d37"
                  modelType="three_piece"
                  width={240}
                  height={300}
                  interactive={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PHYSICAL FLAGSHIP ATELIER AT BARUIPUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-1">
                Store Location · South 24 Parganas
              </span>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-wide">
                Visit Our Flagship Baruipur Showroom
              </h2>
            </div>
            <button
              onClick={onOpenStoreInfo}
              className="px-5 py-2.5 rounded-xl glass-button text-xs text-white hover:border-[#0064E0] self-start md:self-auto"
            >
              Book In-Store Fitting Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <MapPin className="w-5 h-5 text-[#0064E0]" />
              <h4 className="text-xs font-semibold text-white uppercase font-mono">Store Location</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {STORE_INFO.fullAddress}
              </p>
              <span className="text-[11px] text-[#00D2FF] font-mono block">PIN: 700144</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Phone className="w-5 h-5 text-[#0064E0]" />
              <h4 className="text-xs font-semibold text-white uppercase font-mono">Direct Helpline</h4>
              <p className="text-xs text-slate-300">
                Call or WhatsApp our chief tailor at{' '}
                <a href={`tel:${STORE_INFO.mobile}`} className="text-white font-mono font-bold hover:underline">
                  {STORE_INFO.mobileFormatted}
                </a>
              </p>
              <span className="text-[11px] text-slate-400 block">{STORE_INFO.openingHours}</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Award className="w-5 h-5 text-[#0064E0]" />
              <h4 className="text-xs font-semibold text-white uppercase font-mono">Master Craftsmanship</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 18,500 suits tailored with full horsehair floating canvas and hand-stitched buttonholes.
              </p>
              <span className="text-[11px] text-emerald-400 block">30-Day Free Alterations Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CLIENT ENDORSEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block">
            Patron Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
            Worn By Bengal's Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'The 3D virtual try-on accurately predicted my drop-6 cut. When I collected my suit at Dipshikha Complex in Baruipur, the lapel roll and chest canvas were impeccable.',
              author: 'Dr. Debabrata Sen',
              role: 'Consultant Neurosurgeon, Kolkata',
              suit: 'Baron Executive Two-Piece',
            },
            {
              quote: 'The Sovereign Tuxedo Shawl collar and pure silk satin braid made our gala night memorable. True Savile Row craftsmanship right here in South 24 Parganas.',
              author: 'Vikramaditya Banerjee',
              role: 'Managing Director, Bengal Tech Ventures',
              suit: 'Sovereign Midnight Tuxedo',
            },
            {
              quote: 'Ordering custom bespoke suits online used to be risky. With Fashion Baruipur’s 3D real-time model and local atelier backup, the fit is sharper than international brands.',
              author: 'Amitava Roy',
              role: 'Senior Advocate, High Court',
              suit: 'Viceroy Master 3-Piece',
            },
          ].map((t, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-3 border-t border-white/5">
                <h5 className="text-xs font-bold text-white">{t.author}</h5>
                <span className="text-[11px] text-slate-400 block">{t.role}</span>
                <span className="text-[10px] text-[#00D2FF] font-mono mt-1 block">Verified Purchase · {t.suit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
