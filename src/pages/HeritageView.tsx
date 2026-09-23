import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeInfo';
import { MapPin, Phone, Mail, Clock, ShieldCheck, CheckCircle2, Navigation, Calendar } from 'lucide-react';

export const HeritageView: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block">
          Flagship Atelier · South 24 Parganas
        </span>
        <h1 className="text-3xl sm:text-5xl font-cinzel font-bold text-white tracking-wide">
          The Craft of {STORE_INFO.brandName}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Rooted at Dipshikha Complex in Baruipur, we unite ancestral Bengal tailoring traditions with state-of-the-art 3D spatial fit engineering. Every suit is basted by hand and sculpted for commanding presence.
        </p>
      </div>

      {/* Flagship Store Card & Heritage Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Location & Contact Direct Info */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-xl">
            <h2 className="text-xl font-cinzel font-bold text-white">Baruipur Flagship Experience</h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0064E0] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block text-sm mb-1">{STORE_INFO.fullAddress}</span>
                  <p className="text-slate-400">
                    Located conveniently at {STORE_INFO.landmark}, South 24 Parganas, West Bengal.
                  </p>
                  <p className="text-[#00D2FF] font-mono mt-1">Postal PIN Code: {STORE_INFO.pincode}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0064E0] shrink-0" />
                <div>
                  <span className="text-slate-400">Master Tailor Helpline: </span>
                  <a href={`tel:${STORE_INFO.mobile}`} className="font-mono text-white font-semibold hover:underline">
                    {STORE_INFO.mobileFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0064E0] shrink-0" />
                <div>
                  <span className="text-slate-400">Official Correspondence: </span>
                  <a href={`mailto:${STORE_INFO.email}`} className="text-white hover:underline">
                    {STORE_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#0064E0] shrink-0" />
                <div>
                  <span className="text-slate-400">Atelier Hours: </span>
                  <span className="text-white">{STORE_INFO.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#0064E0] hover:bg-[#0052b8] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate via Google Maps</span>
              </a>
              <span className="text-[11px] text-slate-500 font-mono">PIN: 700144</span>
            </div>
          </div>

          {/* Master Tailoring Hallmarks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-bold font-mono text-white block">{STORE_INFO.tailorsCount}</span>
              <span className="text-xs text-slate-400 mt-1 block">Master Artisans & Hand-Cutters</span>
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/10">
              <span className="text-2xl font-bold font-mono text-[#00D2FF] block">{STORE_INFO.suitsCraftedCount}</span>
              <span className="text-xs text-slate-400 mt-1 block">Suits Fitted Across India</span>
            </div>
          </div>
        </div>

        {/* Right: Book In-Store Private Measurement Appointment */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-cinzel font-bold text-white mb-2">
              Book a Private Atelier Fitting
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Experience the tactile luxury of our fabric books in person at Dipshikha Complex, Baruipur. Our chief sartorialist will record 32 distinct anatomical measurements.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Appointment Reserved</h4>
                <p className="text-xs text-slate-300">
                  Thank you, {clientName}. We will confirm your fitting time slot via WhatsApp / SMS on {clientPhone}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[#00D2FF] underline mt-2"
                >
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Anirban Roy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Mobile Number (WhatsApp Enabled)</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 9830000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#0064E0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Occasion / Garment Requirements</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Boardroom business suit, wedding reception tuxedo, custom sizing request..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  Confirm In-Person Fitting Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
