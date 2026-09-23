import React, { useState, useEffect } from 'react';
import { Product, ProductColor, FabricOption, CustomMeasurements } from '../types';
import { ProductSuitViewer } from '../components/3d/ProductSuitViewer';
import { VirtualTryOnModal } from '../components/common/VirtualTryOnModal';
import { ProductImage } from '../components/common/ProductImage';
import { ImageUploadModal } from '../components/common/ImageUploadModal';
import { 
  ShieldCheck, 
  Ruler, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  RotateCcw,
  Scissors,
  Camera,
  Layers,
  Upload,
  Eye,
  Maximize2
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  onBackToShop: () => void;
  onAddToCart: (
    product: Product,
    selectedColor: ProductColor,
    selectedFabric: FabricOption,
    selectedSize: number,
    quantity: number,
    customMeasurements?: CustomMeasurements
  ) => void;
  onUpdateProductImage?: (productId: string, newImageUrl: string, newGallery?: string[]) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBackToShop,
  onAddToCart,
  onUpdateProductImage,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(product.fabric);
  const [selectedSize, setSelectedSize] = useState<number>(product.sizes[1] || 40);
  const [quantity, setQuantity] = useState<number>(1);
  const [isTryOnOpen, setIsTryOnOpen] = useState<boolean>(false);
  const [appliedMeasurements, setAppliedMeasurements] = useState<CustomMeasurements | undefined>(undefined);
  const [addedToast, setAddedToast] = useState(false);
  
  // Media Display Modes: 'photo' (Real Collection Photograph) vs '3d' (Interactive 360 Atelier)
  const [mediaMode, setMediaMode] = useState<'photo' | '3d'>('photo');
  const [activePhoto, setActivePhoto] = useState<string>(product.imageUrl);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setActivePhoto(product.imageUrl);
  }, [product.imageUrl]);

  // Price calculation according to selected fabric multiplier
  const dynamicPrice = Math.round(product.price * selectedFabric.priceMultiplier);
  const originalDynamicPrice = Math.round(product.originalPrice * selectedFabric.priceMultiplier);

  const handleAddToCart = () => {
    onAddToCart(
      product,
      selectedColor,
      selectedFabric,
      selectedSize,
      quantity,
      appliedMeasurements
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleApplyMeasurements = (measurements: CustomMeasurements, recommendedSize: number) => {
    setAppliedMeasurements(measurements);
    setSelectedSize(recommendedSize);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Breadcrumb */}
      <button
        onClick={onBackToShop}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Sartorial Catalog</span>
      </button>

      {/* Main Grid: 3D Canvas on Left, Contiguous Purchase Module on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Dual-Mode Viewport (Studio Photo vs 3D Atelier) */}
        <div className="lg:col-span-7 sticky top-24 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between glass-panel p-1.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMediaMode('photo')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  mediaMode === 'photo'
                    ? 'bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Camera className="w-4 h-4 text-[#00D2FF]" />
                <span>Studio Photography (আসল ফটো)</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaMode('3d')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  mediaMode === '3d'
                    ? 'bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye className="w-4 h-4 text-[#00D2FF]" />
                <span>3D Interactive Atelier (3D ভিউ)</span>
              </button>
            </div>

            {/* Upload Custom Photo Button */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Upload your authentic dress/suit photos"
            >
              <Upload className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="hidden sm:inline">ফটো আপলোড করুন</span>
            </button>
          </div>

          {/* Active Viewport */}
          {mediaMode === 'photo' ? (
            <div className="space-y-3">
              {/* Main Photo Display */}
              <div className="relative w-full h-[520px] rounded-3xl overflow-hidden glass-panel border border-white/15 bg-gradient-to-b from-[#0e121d] to-[#07090e] shadow-2xl flex items-center justify-center group">
                <img
                  src={activePhoto || product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                  <span className="glass-panel px-3 py-1.5 rounded-xl text-xs font-mono text-white border border-white/10 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Fashion Baruipur Original Collection</span>
                  </span>
                  <span className="glass-panel px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 border border-white/10">
                    {selectedColor.name}
                  </span>
                </div>

                {/* Bottom Overlay: Switch to 3D prompt */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300 font-mono glass-panel px-3 py-1.5 rounded-xl border border-white/10">
                    {product.fabric.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMediaMode('3d')}
                    className="glass-panel px-3.5 py-1.5 rounded-xl text-xs text-white font-semibold flex items-center gap-1.5 border border-white/20 hover:border-[#00D2FF] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>Switch to 3D 360° View</span>
                  </button>
                </div>
              </div>

              {/* Gallery Thumbnails Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {/* Main Photo Thumbnail */}
                <button
                  type="button"
                  onClick={() => setActivePhoto(product.imageUrl)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activePhoto === product.imageUrl
                      ? 'border-[#00D2FF] scale-105 shadow-md shadow-[#00D2FF]/20'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt="Main look"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white py-0.5">
                    Front
                  </span>
                </button>

                {/* Additional Gallery Photos if available */}
                {product.galleryImages && product.galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(imgUrl)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activePhoto === imgUrl
                        ? 'border-[#00D2FF] scale-105 shadow-md shadow-[#00D2FF]/20'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white py-0.5">
                      Angle {i + 1}
                    </span>
                  </button>
                ))}

                {/* Add Photo Action Button in Gallery */}
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-20 h-24 rounded-xl border border-dashed border-white/20 hover:border-[#00D2FF]/60 flex flex-col items-center justify-center text-slate-400 hover:text-white flex-shrink-0 bg-white/5 transition-colors gap-1"
                >
                  <Upload className="w-5 h-5 text-[#00D2FF]" />
                  <span className="text-[10px] text-center px-1 font-mono">Add Photo</span>
                </button>
              </div>
            </div>
          ) : (
            <ProductSuitViewer
              color={selectedColor}
              fabric={selectedFabric}
              modelType={product.modelType}
              productName={product.name}
              onOpenVirtualTryOn={() => setIsTryOnOpen(true)}
            />
          )}

          {/* Quick Specifications below Media */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="glass-panel p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Construction</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">Full Floating Canvas</span>
            </div>
            <div className="glass-panel p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Fabric Origin</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">{selectedFabric.weave}</span>
            </div>
            <div className="glass-panel p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">Workshop</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">Baruipur, WB</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-wider">{product.category}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{product.fitType}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-wide">
              {product.name}
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {product.description}
            </p>

            {/* Price Row */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold font-mono text-white tabular-nums">
                ₹{dynamicPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-mono text-slate-500 line-through tabular-nums">
                ₹{originalDynamicPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Save ₹{(originalDynamicPrice - dynamicPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* Color Palette Selector */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-white">Color Silhouette</span>
              <span className="text-xs text-slate-400 font-mono">{selectedColor.name}</span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full transition-all relative flex items-center justify-center border ${
                    selectedColor.id === c.id
                      ? 'scale-110 border-white ring-2 ring-[#0064E0]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor.id === c.id && (
                    <Check className="w-4 h-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Mill & Weave Selector */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-semibold text-white">Select Fabric Grade</span>
              <span className="text-xs text-[#00D2FF] font-mono">{selectedFabric.weightGsm} GSM</span>
            </div>
            <div className="space-y-2">
              {product.availableFabrics.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFabric(f)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedFabric.id === f.id
                      ? 'bg-[#0064E0]/15 border-[#0064E0] text-white shadow-sm'
                      : 'glass-panel text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block text-white">{f.name}</span>
                    <span className="text-[11px] text-slate-400">{f.weave} · {f.description}</span>
                  </div>
                  {f.priceMultiplier > 1 && (
                    <span className="text-xs font-mono text-[#00D2FF] whitespace-nowrap pl-2">
                      +{Math.round((f.priceMultiplier - 1) * 100)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector with Virtual Try-On Launcher */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  {product.category === 'Formal Trousers' 
                    ? 'Waist Size (Inches)' 
                    : product.category === 'Bespoke Dress Shirts' 
                      ? 'Collar Size (cm)' 
                      : product.category === 'Luxury Accessories'
                        ? 'Sartorial Specification'
                        : 'Chest Size (Regular)'}
                </span>
                {appliedMeasurements && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded font-mono">
                    Virtual Try-On Calibrated
                  </span>
                )}
              </div>
              {product.category !== 'Luxury Accessories' && (
                <button
                  type="button"
                  onClick={() => setIsTryOnOpen(true)}
                  className="text-xs text-[#00D2FF] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>3D Virtual Try-On</span>
                </button>
              )}
            </div>

            <div className={`grid gap-2 ${product.sizes.length > 5 ? 'grid-cols-6' : product.sizes.length > 1 ? 'grid-cols-4' : 'grid-cols-1'}`}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    selectedSize === s
                      ? 'bg-[#0064E0] border-[#0064E0] text-white shadow-md'
                      : 'glass-panel text-slate-300 border-white/10 hover:border-white/25'
                  }`}
                >
                  {product.category === 'Luxury Accessories' 
                    ? 'Bespoke Standard / One Size' 
                    : product.category === 'Formal Trousers' 
                      ? `${s}W` 
                      : product.category === 'Bespoke Dress Shirts'
                        ? `${s}cm`
                        : `${s}R`}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Primary Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-sm shadow-[0_0_25px_rgba(0,100,224,0.5)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bespoke Wardrobe · ₹{dynamicPrice.toLocaleString('en-IN')}</span>
            </button>

            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Garment added to your fitting bag!</span>
              </div>
            )}
          </div>

          {/* Key Tailoring Features */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Sartorial Hallmarks
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0064E0]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3D Virtual Try-On Modal */}
      <VirtualTryOnModal
        isOpen={isTryOnOpen}
        onClose={() => setIsTryOnOpen(false)}
        onApplyMeasurements={handleApplyMeasurements}
        currentProductName={product.name}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        product={product}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveImage={(id, url, gallery) => {
          setActivePhoto(url);
          onUpdateProductImage?.(id, url, gallery);
        }}
      />
    </div>
  );
};
