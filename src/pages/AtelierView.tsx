import React, { useState } from 'react';
import { ProductSuitViewer } from '../components/3d/ProductSuitViewer';
import { Product, ProductColor, FabricOption, ModelType } from '../types';
import { LUXURY_FABRICS, INITIAL_PRODUCTS } from '../data/products';
import { Sparkles, Layers, Sliders, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface AtelierViewProps {
  onAddCustomSuitToCart: (product: Product, color: ProductColor, fabric: FabricOption) => void;
}

export const AtelierView: React.FC<AtelierViewProps> = ({ onAddCustomSuitToCart }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>('three_piece');
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(LUXURY_FABRICS[1]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>({
    id: 'custom-navy',
    name: 'Windsor Deep Meta Navy',
    hex: '#0a1d37',
    secondaryHex: '#0064E0',
    roughness: 0.52,
    metalness: 0.08,
  });
  const [monogramText, setMonogramText] = useState('F.B.');
  const [orderAdded, setOrderAdded] = useState(false);

  const COLOR_PALETTE: ProductColor[] = [
    { id: 'meta-navy', name: 'Meta Royal Navy', hex: '#0a1d37', secondaryHex: '#0064E0', roughness: 0.52, metalness: 0.08 },
    { id: 'obsidian-black', name: 'Obsidian Jet Black', hex: '#0e1014', secondaryHex: '#1e222b', roughness: 0.45, metalness: 0.1 },
    { id: 'charcoal-grey', name: 'Oxford Charcoal', hex: '#1c1e24', secondaryHex: '#383d47', roughness: 0.6, metalness: 0.06 },
    { id: 'emerald-green', name: 'Imperial Forest Emerald', hex: '#0a1d17', secondaryHex: '#144634', roughness: 0.48, metalness: 0.1 },
    { id: 'crimson-noir', name: 'Bengal Crimson Noir', hex: '#260e16', secondaryHex: '#521f31', roughness: 0.5, metalness: 0.12 },
    { id: 'desert-camel', name: 'Florentine Desert Camel', hex: '#3d3228', secondaryHex: '#6d5a49', roughness: 0.65, metalness: 0.04 },
  ];

  const getBasePrice = (m: ModelType) => {
    switch (m) {
      case 'three_piece': return 29999;
      case 'tuxedo': return 27500;
      case 'bandhgala': return 24999;
      case 'blazer': return 16999;
      case 'trouser': return 7499;
      case 'shirt': return 4999;
      case 'waistcoat': return 8499;
      case 'accessory': return 3999;
      default: return 21999;
    }
  };

  const basePrice = getBasePrice(selectedModel);
  const totalPrice = Math.round(basePrice * selectedFabric.priceMultiplier);

  const handleOrder = () => {
    const baseProduct = INITIAL_PRODUCTS.find((p) => p.modelType === selectedModel) || INITIAL_PRODUCTS[0];
    onAddCustomSuitToCart(
      {
        ...baseProduct,
        name: `Bespoke ${selectedModel.replace('_', ' ').toUpperCase()} (${monogramText})`,
        price: totalPrice,
      },
      selectedColor,
      selectedFabric
    );
    setOrderAdded(true);
    setTimeout(() => setOrderAdded(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-1">
          Baruipur Spatial Lab
        </span>
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
          Interactive 3D Bespoke Atelier
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-2xl">
          Craft your personal silhouette in real time. Switch fabrics with active weave simulation, dynamic multi-angle lighting, and preview your custom monogram tab.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Suit Visualizer */}
        <div className="lg:col-span-8">
          <ProductSuitViewer
            color={selectedColor}
            fabric={selectedFabric}
            modelType={selectedModel}
            productName={`Bespoke Customizer (${selectedModel})`}
          />
        </div>

        {/* Right: Atelier Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Model Type */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono block">
              1. Garment Silhouette
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'two_piece', label: '2-Piece Suit' },
                { id: 'three_piece', label: 'Master 3-Piece' },
                { id: 'tuxedo', label: 'Dinner Tuxedo' },
                { id: 'blazer', label: 'Italian Blazer' },
                { id: 'bandhgala', label: 'Royal Bandhgala' },
                { id: 'trouser', label: 'Gurkha Trousers' },
                { id: 'shirt', label: 'Bespoke Shirt' },
                { id: 'waistcoat', label: 'Formal Waistcoat' },
                { id: 'accessory', label: 'Silk Accessories' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium text-left border transition-all ${
                    selectedModel === m.id
                      ? 'bg-[#0064E0] border-[#0064E0] text-white shadow-md'
                      : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Silhouette */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                2. Bespoke Shade
              </span>
              <span className="text-xs text-[#00D2FF] font-mono">{selectedColor.name}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`w-10 h-10 rounded-full transition-all border flex items-center justify-center ${
                    selectedColor.id === c.id
                      ? 'scale-110 border-white ring-2 ring-[#0064E0]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor.id === c.id && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Mill */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono block">
              3. Fabric & Mill
            </span>
            <div className="space-y-2">
              {LUXURY_FABRICS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFabric(f)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedFabric.id === f.id
                      ? 'bg-[#0064E0]/20 border-[#0064E0] text-white'
                      : 'border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className="font-medium">{f.name}</span>
                  <span className="text-[11px] font-mono text-[#00D2FF]">{f.weightGsm} GSM</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Monogram */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider font-mono block">
              4. Interior Monogram Embroidery
            </span>
            <input
              type="text"
              maxLength={6}
              value={monogramText}
              onChange={(e) => setMonogramText(e.target.value.toUpperCase())}
              placeholder="e.g. R.M."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-[#0064E0] outline-none"
            />
            <span className="text-[10px] text-slate-500">
              Gold silk thread hand-embroidered into the inner left breast lining.
            </span>
          </div>

          {/* Summary & Add to Bag */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Bespoke Estimate:</span>
              <span className="text-xl font-bold font-mono text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span>Add Custom Build to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {orderAdded && (
              <div className="text-center text-xs text-emerald-400 font-medium">
                Custom bespoke configuration added to your shopping bag!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
