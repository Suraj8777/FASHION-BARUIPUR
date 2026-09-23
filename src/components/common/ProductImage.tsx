import React, { useState } from 'react';
import { Product } from '../../types';
import { Sparkles, Camera } from 'lucide-react';

interface ProductImageProps {
  product: Product;
  selectedColorHex?: string;
  className?: string;
  aspectRatio?: 'portrait' | 'square' | 'video';
  showBadge?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  selectedColorHex,
  className = '',
  aspectRatio = 'portrait',
  showBadge = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeColor = selectedColorHex || (product.colors[0]?.hex ?? '#0e1d36');
  const imageUrl = product.imageUrl;

  const aspectClass = 
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
    aspectRatio === 'square' ? 'aspect-square' : 
    'aspect-video';

  return (
    <div className={`relative overflow-hidden bg-[#07090e] ${aspectClass} ${className}`}>
      {/* Real High-Fashion Photograph */}
      {imageUrl && !hasError ? (
        <>
          <img
            src={imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Subtle gradient vignette to blend with dark luxury theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-black/30 pointer-events-none" />
        </>
      ) : null}

      {/* Elegant Fallback or Loading State */}
      {(!imageUrl || hasError || !isLoaded) && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 50% 35%, ${activeColor}55 0%, #080a10 75%)`,
          }}
        >
          {/* Decorative Sartorial SVG Plate */}
          <div className="relative w-28 h-36 mb-3 flex items-center justify-center">
            <svg 
              viewBox="0 0 100 120" 
              className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              fill="none" 
              stroke="currentColor"
            >
              {/* Suit/Coat Outline */}
              <path
                d="M 25,25 L 38,10 L 62,10 L 75,25 L 88,40 L 75,115 L 25,115 L 12,40 Z"
                fill={activeColor}
                stroke="#d4af37"
                strokeWidth="1.5"
                fillOpacity="0.85"
              />
              {/* Collar & Lapel Lines */}
              <path
                d="M 38,10 L 50,45 L 62,10"
                stroke="#d4af37"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 25,25 L 42,50 L 50,75 L 58,50 L 75,25"
                stroke="#d4af37"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              {/* Pocket Square */}
              <path
                d="M 30,55 L 40,55"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Buttons */}
              <circle cx="50" cy="82" r="2.5" fill="#d4af37" />
              <circle cx="50" cy="95" r="2.5" fill="#d4af37" />
            </svg>
          </div>

          <div className="space-y-1 z-10">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-mono flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Bespoke Edition
            </span>
            <p className="text-xs font-cinzel font-bold text-white px-2 line-clamp-1">
              {product.name}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              {product.category}
            </span>
          </div>
        </div>
      )}

      {/* Top Left: Category & Photo Badge */}
      {showBadge && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="glass-panel px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white tracking-wider uppercase border border-white/10 shadow-lg flex items-center gap-1">
            <Camera className="w-3 h-3 text-[#00D2FF]" />
            <span>Studio Photo</span>
          </span>
        </div>
      )}
    </div>
  );
};
