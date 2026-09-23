import React from 'react';
import { ShoppingBag, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../../data/storeInfo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, productId?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0B0D13]/85 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group flex items-center gap-3 shrink-0"
        >
          {/* Animated 3D Logo Crest */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0a1d37] via-[#0064E0] to-[#00D2FF] p-0.5 shadow-[0_0_15px_rgba(0,100,224,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0D13] rounded-[10px] flex items-center justify-center">
              <span className="font-cinzel text-base font-bold text-white tracking-widest">FB</span>
            </div>
          </div>
          <div>
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-[#00D2FF] transition-colors block">
              {STORE_INFO.brandName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest hidden sm:block">
              EST. 2014 · BARUIPUR
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap hover:text-white py-1 relative ${
              currentView === 'home' ? 'text-white font-semibold' : ''
            }`}
          >
            Showroom
            {currentView === 'home' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0064E0] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className={`transition-colors whitespace-nowrap hover:text-white py-1 relative ${
              currentView === 'shop' ? 'text-white font-semibold' : ''
            }`}
          >
            Collections
            {currentView === 'shop' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0064E0] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('atelier')}
            className={`transition-colors whitespace-nowrap hover:text-white py-1 relative ${
              currentView === 'atelier' ? 'text-white font-semibold' : ''
            }`}
          >
            3D Atelier
            {currentView === 'atelier' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0064E0] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('heritage')}
            className={`transition-colors whitespace-nowrap hover:text-white py-1 relative ${
              currentView === 'heritage' ? 'text-white font-semibold' : ''
            }`}
          >
            Baruipur Store
            {currentView === 'heritage' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0064E0] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors whitespace-nowrap hover:text-white py-1 relative ${
              currentView === 'contact' ? 'text-white font-semibold' : ''
            }`}
          >
            Contact
            {currentView === 'contact' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0064E0] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard shortcut */}
          <button
            onClick={() => onNavigate('admin')}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
              currentView === 'admin'
                ? 'bg-[#0064E0] border-[#0064E0] text-white shadow-[0_0_12px_rgba(0,100,224,0.5)]'
                : 'glass-panel text-slate-300 hover:text-white border-white/10 hover:border-white/20'
            }`}
            title="Sartorial Admin Console"
          >
            <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
            <span className="hidden lg:inline font-medium">Admin</span>
          </button>

          {/* Cart Drawer Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#0064E0] hover:bg-[#0055c0] text-white transition-all shadow-[0_0_16px_rgba(0,100,224,0.4)] flex items-center gap-2 group"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] font-mono bg-white text-[#0064E0] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
