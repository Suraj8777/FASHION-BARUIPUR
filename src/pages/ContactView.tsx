import React, { useState } from 'react';
import { STORE_INFO } from '../data/storeInfo';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bespoke Garment Consultation');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-1">
          Baruipur Atelier Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
          Connect with {STORE_INFO.brandName}
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          Reach our master cutters and customer concierge for bespoke inquiries, custom fabric sourcing, or visits to our flagship showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Details Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0064E0]/20 text-[#00D2FF]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Direct Phone & WhatsApp</span>
                  <a href={`tel:${STORE_INFO.mobile}`} className="font-mono text-base font-bold text-white hover:underline">
                    {STORE_INFO.mobileFormatted}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Available 10:00 AM - 9:30 PM IST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0064E0]/20 text-[#00D2FF]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Inquiries</span>
                  <a href={`mailto:${STORE_INFO.email}`} className="text-sm font-medium text-white hover:underline">
                    {STORE_INFO.email}
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Response within 4 hours</p>
                </div>
              </div>

              {/* Full Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0064E0]/20 text-[#00D2FF]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Registered Address</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{STORE_INFO.fullAddress}</p>
                  <p className="text-[#00D2FF] font-mono mt-1">PIN: {STORE_INFO.pincode}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/918100400801?text=Hello%20Fashion%20Baruipur,%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20suit.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Master Tailor</span>
              </a>
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 rounded-xl glass-button text-xs text-white flex items-center justify-center gap-1.5"
              >
                <span>Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Map Visual Guide */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Reaching Baruipur Dipshikha Complex
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We are situated 5 minutes from Baruipur Junction Railway Station. Dipshikha Complex is a premier landmark in South 24 Parganas with ample reserved parking for bespoke patrons.
            </p>
          </div>
        </div>

        {/* Right: Message / Consultation Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-base font-cinzel font-bold text-white mb-2">
              Send an In-Depth Inscription
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Our head sartorial consultant will inspect your inquiry and prepare tailored fabric swatches before getting back to you.
            </p>

            {sent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-semibold text-white">Message Dispatched Successfully</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, {name}. The atelier concierge at Fashion Baruipur will connect with you via {phone || email}.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#0064E0] text-white text-xs font-semibold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sourav Sen"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 8100400801"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#0064E0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sourav@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none cursor-pointer"
                  >
                    <option value="Bespoke Garment Consultation">Bespoke Garment Consultation</option>
                    <option value="Wedding / Black-Tie Tuxedo Package">Wedding / Black-Tie Tuxedo Package</option>
                    <option value="Corporate Executive Wardrobe">Corporate Executive Wardrobe</option>
                    <option value="Fabric Sampling Request">Fabric Sampling Request</option>
                    <option value="Store Visit Inquiry">Store Visit Inquiry (Baruipur Flagship)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Message or Body Fit Preferences</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your desired silhouette, event deadline, or custom tailoring specifications..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Consultation Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
