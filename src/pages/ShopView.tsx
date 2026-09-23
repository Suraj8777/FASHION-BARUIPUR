import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, FabricType } from '../types';
import { MiniSuitPreview } from '../components/3d/MiniSuitPreview';
import { ProductImage } from '../components/common/ProductImage';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, ChevronRight, Eye, Camera, Layers } from 'lucide-react';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [globalViewMode, setGlobalViewMode] = useState<'photo' | '3d'>('photo');
  const [itemModes, setItemModes] = useState<Record<string, 'photo' | '3d'>>({});

  const toggleItemMode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemModes((prev) => {
      const current = prev[id] || globalViewMode;
      return { ...prev, [id]: current === 'photo' ? '3d' : 'photo' };
    });
  };

  const categories: string[] = [
    'All',
    'Executive 2-Piece',
    'Royal 3-Piece',
    'Tuxedos & Gala',
    'Italian Blazers',
    'Bespoke Bandhgala',
    'Formal Trousers',
    'Bespoke Dress Shirts',
    'Formal Waistcoats',
    'Luxury Accessories',
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-1">
            Baruipur Bespoke Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-wide">
            Sartorial Garments & Formal Suits
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-xl">
            Each suit is precision-cut from heritage mills and customized with floating canvas construction at our South 24 Parganas flagship atelier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments, fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-[#0064E0] outline-none w-56 sm:w-64"
            />
          </div>

          {/* Global View Mode Switcher */}
          <div className="flex items-center glass-panel rounded-xl p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setGlobalViewMode('photo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                globalViewMode === 'photo'
                  ? 'bg-[#0064E0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show real studio fashion photography"
            >
              <Camera className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="hidden sm:inline">Photo Studio (আসল ফটো)</span>
              <span className="sm:hidden">Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setGlobalViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                globalViewMode === '3d'
                  ? 'bg-[#0064E0] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Show interactive 3D virtual mannequin"
            >
              <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="hidden sm:inline">3D Atelier</span>
              <span className="sm:hidden">3D</span>
            </button>
          </div>

          {/* Sort Control */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:border-[#0064E0] outline-none cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs (Zero-pill compliant segmented tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0064E0] text-white shadow-[0_0_15px_rgba(0,100,224,0.4)]'
                : 'glass-panel text-slate-400 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D & Photography Interactive Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center glass-panel rounded-3xl p-8 border border-white/10">
          <p className="text-sm text-slate-300">No tailored garments matched your search criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#0064E0] text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((p) => {
            const currentMode = itemModes[p.id] || globalViewMode;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className="group glass-panel rounded-3xl p-5 border border-white/10 hover:border-[#0064E0]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(0,100,224,0.2)]"
              >
                <div>
                  {/* Media Showcase Card Top (Dual Mode: Photo Studio or 3D Atelier) */}
                  <div className="relative w-full h-80 bg-gradient-to-b from-[#0e121d] to-[#07090e] rounded-2xl overflow-hidden flex items-center justify-center border border-white/5 mb-4 group-hover:border-[#0064E0]/30 transition-colors">
                    {/* Subtle 3D background grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,224,0.1),transparent_70%)] pointer-events-none" />

                    {currentMode === 'photo' ? (
                      /* Real High-Fashion Photography */
                      <div className="relative w-full h-full">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-black/20 pointer-events-none" />
                      </div>
                    ) : (
                      /* Real interactive Mini 3D Suit preview */
                      <MiniSuitPreview
                        colorHex={p.colors[0].hex}
                        modelType={p.modelType}
                        width={200}
                        height={260}
                        interactive={true}
                      />
                    )}

                    {/* Quick Mode Toggle Icon on Top-Right */}
                    <button
                      type="button"
                      onClick={(e) => toggleItemMode(p.id, e)}
                      className="absolute top-3 right-3 z-10 glass-panel px-2.5 py-1.5 rounded-xl border border-white/20 hover:border-[#00D2FF] text-white text-[10px] font-semibold flex items-center gap-1.5 shadow-lg bg-black/60 hover:bg-black/80 transition-all"
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

                    {/* Bottom Indicator Badge */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="glass-panel px-2.5 py-1 rounded-xl text-[10px] text-white font-mono flex items-center gap-1.5 bg-black/60">
                        {currentMode === 'photo' ? (
                          <>
                            <Camera className="w-3 h-3 text-[#00D2FF]" />
                            <span>Real Garment Photo</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-[#00D2FF]" />
                            <span>360° Interactive</span>
                          </>
                        )}
                      </span>
                      <span className="glass-panel px-2 py-1 rounded-xl text-[10px] text-slate-300 font-mono bg-black/60">
                        {p.colors.length} Shades
                      </span>
                    </div>
                  </div>

                  {/* Metadata & Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{p.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{p.fitType}</span>
                    </div>

                    <h3 className="text-base font-cinzel font-bold text-white group-hover:text-[#00D2FF] transition-colors">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                {/* Price & Primary CTA */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono text-white tabular-nums">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono text-slate-500 line-through tabular-nums">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00D2FF]">Bespoke Made-to-Measure</span>
                </div>

                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-[#0064E0]/20 text-[#00D2FF] group-hover:bg-[#0064E0] group-hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
