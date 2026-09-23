import React, { useState } from 'react';
import { CustomMeasurements, FitType } from '../../types';
import { X, Sparkles, Check, Ruler, HelpCircle, ArrowRight } from 'lucide-react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMeasurements: (measurements: CustomMeasurements, recommendedSize: number) => void;
  currentProductName: string;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  isOpen,
  onClose,
  onApplyMeasurements,
  currentProductName,
}) => {
  const [chest, setChest] = useState<number>(40);
  const [waist, setWaist] = useState<number>(34);
  const [shoulder, setShoulder] = useState<number>(18.5);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [fitPreference, setFitPreference] = useState<'Fitted Slim' | 'Tailored Modern' | 'Relaxed Classic'>('Tailored Modern');

  if (!isOpen) return null;

  // Algorithmic Size Recommendation based on bespoke tailoring rules
  const calculateRecommendation = () => {
    let size = Math.round(chest);
    if (size % 2 !== 0) size += 1;
    size = Math.max(36, Math.min(48, size));

    const drop = chest - waist;
    let confidence = 96;
    if (drop >= 6 && drop <= 8) {
      confidence = 98;
    } else if (drop < 4 || drop > 9) {
      confidence = 93;
    }

    let cutStyle: FitType = 'Tailored Fit';
    if (fitPreference === 'Fitted Slim') cutStyle = 'Slim Fit';
    if (fitPreference === 'Relaxed Classic') cutStyle = 'Classic Formal';

    const dropExplanation = `Drop ${drop.toFixed(0)} profile detected. Chest ${chest}" with ${waist}" waist creates an ideal masculine V-taper. Master tailors in Baruipur will preserve a clean chest drape without pocket pulling.`;

    return { size, confidence, cutStyle, dropExplanation };
  };

  const rec = calculateRecommendation();

  const handleConfirm = () => {
    onApplyMeasurements(
      {
        chest,
        waist,
        shoulder,
        heightCm,
        weightKg,
        fitPreference,
      },
      rec.size
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0064E0]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0064E0] animate-ping" />
              <h2 className="text-xl font-cinzel text-white">3D Virtual Sartorial Try-On</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Precision body calibration for <span className="text-white font-medium">{currentProductName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="mt-6 space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Chest */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-[#0064E0]" /> Chest Circumference
                </span>
                <span className="font-mono text-white font-bold">{chest} inches</span>
              </div>
              <input
                type="range"
                min="34"
                max="50"
                step="0.5"
                value={chest}
                onChange={(e) => setChest(parseFloat(e.target.value))}
                className="w-full accent-[#0064E0] bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Measure horizontally across fullest point of chest</span>
            </div>

            {/* Waist */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-[#0064E0]" /> Natural Waist
                </span>
                <span className="font-mono text-white font-bold">{waist} inches</span>
              </div>
              <input
                type="range"
                min="28"
                max="46"
                step="0.5"
                value={waist}
                onChange={(e) => setWaist(parseFloat(e.target.value))}
                className="w-full accent-[#0064E0] bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Measure right above belly button / waistband</span>
            </div>

            {/* Shoulder Width */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                <span>Shoulder Width (Bone to Bone)</span>
                <span className="font-mono text-white font-bold">{shoulder} in</span>
              </div>
              <input
                type="range"
                min="16"
                max="22"
                step="0.5"
                value={shoulder}
                onChange={(e) => setShoulder(parseFloat(e.target.value))}
                className="w-full accent-[#0064E0] bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-[#0064E0] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value) || 70)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-[#0064E0] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Fit Silhouette Preference */}
          <div>
            <label className="block text-xs text-slate-300 mb-2">Desired Fit Attitude</label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Fitted Slim', 'Tailored Modern', 'Relaxed Classic'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFitPreference(mode)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    fitPreference === mode
                      ? 'bg-[#0064E0]/20 border-[#0064E0] text-white shadow-[0_0_12px_rgba(0,100,224,0.4)]'
                      : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendation Result Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0064E0]/15 via-black/40 to-[#00D2FF]/10 border border-[#0064E0]/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#0064E0] text-white">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">Recommended Size</span>
                  <span className="text-xl font-bold text-white font-mono">{rec.size}R · {rec.cutStyle}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {rec.confidence}% Match
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">{rec.dropExplanation}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-[#0064E0] hover:bg-[#0052b8] text-white font-semibold text-xs transition-all shadow-[0_0_20px_rgba(0,100,224,0.5)] flex items-center gap-2"
          >
            <span>Apply Size {rec.size} & Tailor Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
