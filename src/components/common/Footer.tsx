import React from 'react';
import { STORE_INFO } from '../../data/storeInfo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Compass, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#08090E] border-t border-white/10 text-slate-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Atelier Credo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a1d37] via-[#0064E0] to-[#00D2FF] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B0D13] rounded-[10px] flex items-center justify-center">
                  <span className="font-cinzel text-sm font-bold text-white">FB</span>
                </div>
              </div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                {STORE_INFO.brandName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging master Bengal hand-tailoring with next-generation 3D spatial fit technology. Handcrafting bespoke business formal suits, gala tuxedos, and executive attire.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
              <span>Full Floating Canvas & Lifetime Seam Guarantee</span>
            </div>
          </div>

          {/* Column 2: Exact Store Address & Visit Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Flagship Atelier Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0064E0] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">{STORE_INFO.landmark}</p>
                  <p>{STORE_INFO.area}</p>
                  <p>{STORE_INFO.state}, PIN: <span className="font-mono text-white font-semibold">{STORE_INFO.pincode}</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{STORE_INFO.openingHours}</span>
              </div>
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#00D2FF] hover:underline pt-1 text-xs"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 3: Direct Inquiries & Master Tailor Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Contact & Appointments
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`tel:${STORE_INFO.mobile}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#0064E0]" />
                  <span className="font-mono font-medium">{STORE_INFO.mobileFormatted}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE_INFO.email}`}
                  className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#0064E0]" />
                  <span>{STORE_INFO.email}</span>
                </a>
              </li>
              <li className="pt-1">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full px-3.5 py-2 rounded-xl glass-button text-xs text-white hover:border-[#0064E0] text-center"
                >
                  Book Bespoke In-Store Fitting
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Curated Sartorial Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Sartorial Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Executive Two-Piece Suits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Black-Tie Sovereign Tuxedos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Viceroy Master 3-Piece
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Italian Spalla Camicia Blazers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Maharaja Royal Bandhgalas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Gurkha Pleated Trousers
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean copyright and local attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {STORE_INFO.brandName}. All Rights Reserved. CRP 9+ Baruipur, West Bengal 700144.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Currency: <strong className="text-white font-mono">INR (₹)</strong></span>
            <span>·</span>
            <span>Metaverse 3D Engine: <strong className="text-[#00D2FF] font-mono">Three.js WebGL</strong></span>
            <span>·</span>
            <span>Pin Code: <strong className="text-white font-mono">700144</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
