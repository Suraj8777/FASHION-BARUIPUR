import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link2, Sparkles, RefreshCw } from 'lucide-react';
import { Product } from '../../types';

interface ImageUploadModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSaveImage: (productId: string, imageUrl: string, gallery?: string[]) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveImage,
}) => {
  const [imageUrlInput, setImageUrlInput] = useState(product.imageUrl || '');
  const [galleryInputs, setGalleryInputs] = useState<string[]>(product.galleryImages || []);
  const [previewUrl, setPreviewUrl] = useState(product.imageUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection (from phone gallery or PC desktop)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrlInput(result);
        setPreviewUrl(result);
        setSuccessMsg('ফটো সফলভাবে লোড হয়েছে! (Photo loaded)');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
      alert('ফটো পড়তে সমস্যা হয়েছে। অনুগ্রহ করে অন্য ফটো দিন।');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!previewUrl) return;
    onSaveImage(product.id, previewUrl, galleryInputs.filter(Boolean));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0064E0]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                ফটো আপলোড ও কালেকশন (Product Photo Studio)
              </span>
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">
              {product.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার কালেকশনের আসল জামাকাপড়ের ফটো এখানে যুক্ত করুন (Upload your authentic clothing photos)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 py-5">
          {/* Live Preview Box */}
          <div className="flex gap-4 items-center">
            <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-900 flex-shrink-0 shadow-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">No Photo</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <span className="text-xs font-semibold text-white block mb-1">
                  ডিভাইস থেকে ফটো আপলোড করুন (Upload from Device):
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] hover:from-[#0052b8] hover:to-[#003d8a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isProcessing ? 'লোড হচ্ছে...' : 'মোবাইল / কম্পিউটার থেকে ফটো বাছুন'}</span>
                </button>
              </div>

              {successMsg && (
                <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          </div>

          {/* Or Image URL Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>অথবা ওয়েব ফটো লিংক দিন (Or Image Web URL):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://images.example.com/suit-photo.jpg"
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
              />
              <button
                type="button"
                onClick={() => setPreviewUrl(imageUrlInput)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
              >
                প্রিভিউ
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!previewUrl}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#0064E0] text-black font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(0,210,255,0.4)] disabled:opacity-50 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>সংরক্ষণ করুন (Save Photo to Product)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
