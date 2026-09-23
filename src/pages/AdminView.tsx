import React, { useState } from 'react';
import { Product, Order, OrderStatus, ProductCategory, FabricOption, ProductColor } from '../types';
import { LUXURY_FABRICS } from '../data/products';
import { ImageUploadModal } from '../components/common/ImageUploadModal';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Search,
  Filter,
  Check,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  orders: Order[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  orders,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'alerts'>('analytics');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [uploadModalProduct, setUploadModalProduct] = useState<Product | null>(null);

  // New product form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Executive 2-Piece');
  const [newPrice, setNewPrice] = useState(21999);
  const [newStock, setNewStock] = useState(12);
  const [newDesc, setNewDesc] = useState('');
  const [newHex, setNewHex] = useState('#0a1d37');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0) + 1285000;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length + 18;
  const totalClients = 342;
  const lowStockProducts = products.filter((p) => p.stockCount <= 10);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    } else {
      const created: Product = {
        id: `fb-prod-${Date.now()}`,
        name: newTitle || 'Custom Bespoke Suit',
        subtitle: 'Hand-tailored executive garment',
        category: newCategory,
        price: newPrice,
        originalPrice: Math.round(newPrice * 1.25),
        description: newDesc || 'Handcrafted at Dipshikha Complex, Baruipur with luxury floating canvas.',
        fabric: LUXURY_FABRICS[0],
        availableFabrics: [LUXURY_FABRICS[0], LUXURY_FABRICS[1]],
        colors: [
          { id: 'custom-c1', name: 'Primary Shade', hex: newHex, secondaryHex: '#0064E0', roughness: 0.5, metalness: 0.08 },
        ],
        sizes: [38, 40, 42, 44, 46],
        inStock: true,
        stockCount: newStock,
        fitType: 'Tailored Fit',
        rating: 5.0,
        reviewsCount: 1,
        featured: true,
        tags: ['New Release', 'Atelier'],
        features: ['Floating Canvas Construction', 'Genuine Horn Buttons'],
        stylingTips: 'Pair with spread collar shirt and silk tie.',
        accentColor: '#0064E0',
        modelType: 
          newCategory === 'Royal 3-Piece' ? 'three_piece' : 
          newCategory === 'Tuxedos & Gala' ? 'tuxedo' : 
          newCategory === 'Italian Blazers' ? 'blazer' :
          newCategory === 'Bespoke Bandhgala' ? 'bandhgala' :
          newCategory === 'Formal Trousers' ? 'trouser' :
          newCategory === 'Bespoke Dress Shirts' ? 'shirt' :
          newCategory === 'Formal Waistcoats' ? 'waistcoat' :
          newCategory === 'Luxury Accessories' ? 'accessory' :
          'two_piece',
        imageUrl:
          newImageUrl ||
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
        galleryImages: [
          newImageUrl ||
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
        ],
      };
      onAddProduct(created);
      setIsCreatingProduct(false);
      setNewTitle('');
      setNewDesc('');
      setNewImageUrl('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0064E0] animate-pulse" />
            <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-wider">
              Management Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
            Fashion Baruipur · Sartorial Console
          </h1>
          <p className="text-xs text-slate-400">
            Control 3D product configurations, monitor live tailoring orders, and audit stock levels.
          </p>
        </div>

        {/* Top Segmented Tabs */}
        <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-[#0064E0] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-[#0064E0] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-[#0064E0] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Garments ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'alerts' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockProducts.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
                Total Tailoring Revenue
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-400 font-mono">+18.4%</span>
              </div>
              <span className="text-[10px] text-slate-500">Includes online 3D orders & Baruipur boutique</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
                Suits in Hand-Crafting
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-[#00D2FF] tabular-nums">
                  {activeOrdersCount}
                </span>
                <span className="text-xs text-slate-400">active cuts</span>
              </div>
              <span className="text-[10px] text-slate-500">24 artisans cutting at Dipshikha Complex</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
                Virtual Try-On Calibrations
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">1,842</span>
                <span className="text-xs text-emerald-400 font-mono">98.2% Fit Accuracy</span>
              </div>
              <span className="text-[10px] text-slate-500">AI body drop ratio calculations</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
                Average Bespoke Order
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white tabular-nums">₹27,450</span>
              </div>
              <span className="text-[10px] text-slate-500">Cashmere & Super 150s Wool lead sales</span>
            </div>
          </div>

          {/* Graphical Analytics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  Monthly Bespoke Volume (FY 2026)
                </h3>
                <span className="text-xs text-[#00D2FF] font-mono">Baruipur Atelier</span>
              </div>

              {/* Bar Chart Simulation */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-white/10 pb-4">
                {[
                  { month: 'Apr', val: 55 },
                  { month: 'May', val: 70 },
                  { month: 'Jun', val: 62 },
                  { month: 'Jul', val: 84 },
                  { month: 'Aug', val: 92 },
                  { month: 'Sep', val: 110 },
                ].map((b) => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-gradient-to-t from-[#0064E0] to-[#00D2FF] rounded-t-lg transition-all group-hover:brightness-125"
                      style={{ height: `${b.val * 1.4}px` }}
                    />
                    <span className="text-[11px] font-mono text-slate-400">{b.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Suits Delivered this Season: <strong>473</strong></span>
                <span>Peak Demand: Sovereign Midnight Tuxedo</span>
              </div>
            </div>

            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Top Selling Fabric Types
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Super 150s Merino Wool', pct: 44, color: '#0064E0' },
                  { name: 'Italian Cashmere Blend', pct: 28, color: '#00D2FF' },
                  { name: 'Mulberry Silk Worsted', pct: 16, color: '#a5b4fc' },
                  { name: 'Midnight Velvet', pct: 12, color: '#d4af37' },
                ].map((f) => (
                  <div key={f.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{f.name}</span>
                      <span className="font-mono text-white">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${f.pct}%`, backgroundColor: f.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Client Tailoring Pipeline
            </h3>
            <input
              type="text"
              placeholder="Search by order #, client name..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-[#0064E0] outline-none w-full sm:w-64"
            />
          </div>

          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-black/20">
                    <th className="py-3.5 px-4 font-normal">Order #</th>
                    <th className="py-3.5 px-4 font-normal">Client</th>
                    <th className="py-3.5 px-4 font-normal">Items</th>
                    <th className="py-3.5 px-4 font-normal">Total</th>
                    <th className="py-3.5 px-4 font-normal">Delivery Loc</th>
                    <th className="py-3.5 px-4 font-normal">Current Status</th>
                    <th className="py-3.5 px-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders
                    .filter(
                      (o) =>
                        o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                          {ord.orderNumber}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-semibold text-white block">{ord.customer.fullName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{ord.customer.phone}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          {ord.items.map((i) => i.product.name).join(', ') || 'Bespoke Garment'}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-white tabular-nums whitespace-nowrap">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                          {ord.customer.city} ({ord.customer.pincode})
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#0064E0]/20 text-[#00D2FF] border border-[#0064E0]/40">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-white text-[11px] outline-none cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Fabric Reserved">Fabric Reserved</option>
                            <option value="Master Tailoring">Master Tailoring</option>
                            <option value="Quality Audited">Quality Audited</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS & 3D MODELS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
              Atelier Garment Inventory ({products.length})
            </h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsCreatingProduct(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0064E0] hover:bg-[#0052b8] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tailored Silhouette</span>
            </button>
          </div>

          {/* Add / Edit Form Modal */}
          {(isCreatingProduct || editingProduct) && (
            <div className="glass-panel p-6 rounded-3xl border border-[#0064E0]/40 shadow-2xl space-y-4">
              <h4 className="text-sm font-semibold text-white font-cinzel">
                {editingProduct ? `Edit Garment: ${editingProduct.name}` : 'Design New 3D Garment Entry'}
              </h4>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Garment Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct ? editingProduct.name : newTitle}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({ ...editingProduct, name: e.target.value })
                        : setNewTitle(e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#0064E0]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct ? editingProduct.price : newPrice}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      editingProduct ? setEditingProduct({ ...editingProduct, price: v }) : setNewPrice(v);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#0064E0]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={editingProduct ? editingProduct.stockCount : newStock}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      editingProduct ? setEditingProduct({ ...editingProduct, stockCount: v }) : setNewStock(v);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono outline-none focus:border-[#0064E0]"
                  />
                </div>

                {/* Photo URL / Upload Field */}
                <div className="sm:col-span-3">
                  <label className="block text-xs text-slate-300 mb-1">
                    Garment Real Photo URL (আসল পোশাকের ফটো লিংক বা আপলোড)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingProduct ? (editingProduct.imageUrl || '') : newImageUrl}
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                          : setNewImageUrl(e.target.value)
                      }
                      placeholder="https://images.example.com/suit-photo.jpg"
                      className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#0064E0]"
                    />
                    <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>ডিভাইস থেকে ফটো দিন</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const res = evt.target?.result as string;
                              if (res) {
                                if (editingProduct) {
                                  setEditingProduct({ ...editingProduct, imageUrl: res });
                                } else {
                                  setNewImageUrl(res);
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0064E0] text-white text-xs font-semibold"
                  >
                    Save to 3D Catalog
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Items Table */}
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-black/20">
                    <th className="py-3 px-4 font-normal">Photo</th>
                    <th className="py-3 px-4 font-normal">Garment</th>
                    <th className="py-3 px-4 font-normal">Category</th>
                    <th className="py-3 px-4 font-normal">Price</th>
                    <th className="py-3 px-4 font-normal">Stock Level</th>
                    <th className="py-3 px-4 font-normal">3D Model</th>
                    <th className="py-3 px-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-4">
                        <div
                          onClick={() => setUploadModalProduct(p)}
                          className="relative w-11 h-14 rounded-lg overflow-hidden border border-white/20 bg-slate-900 group cursor-pointer shadow"
                          title="ফটো পরিবর্তন বা আপলোড করতে ক্লিক করুন (Click to upload/change photo)"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-3.5 h-3.5 text-[#00D2FF]" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-semibold ${
                            p.stockCount <= 5
                              ? 'text-rose-400'
                              : p.stockCount <= 10
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {p.stockCount} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#00D2FF]">
                        {p.modelType}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setUploadModalProduct(p)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-[#00D2FF] hover:bg-white/10"
                          title="Upload / Change Photo (ফটো পরিবর্তন)"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOW STOCK ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Low Inventory & Fabric Re-Order Alerts (&le; 10 units)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-3 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                    <span className="text-xs text-slate-400 font-mono">{p.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {p.stockCount} left
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High patron demand from Baruipur and Kolkata. Reserve next wool bolts from Biella / Savile Row mills immediately.
                </p>
                <button
                  onClick={() => {
                    onUpdateProduct({ ...p, stockCount: p.stockCount + 15 });
                  }}
                  className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold transition-colors"
                >
                  Restock +15 Bolts
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload Modal for Admin */}
      {uploadModalProduct && (
        <ImageUploadModal
          isOpen={Boolean(uploadModalProduct)}
          product={uploadModalProduct}
          onClose={() => setUploadModalProduct(null)}
          onSaveImage={(id, url, gallery) => {
            onUpdateProduct({
              ...uploadModalProduct,
              imageUrl: url,
              galleryImages: gallery && gallery.length > 0 ? gallery : [url],
            });
            setUploadModalProduct(null);
          }}
        />
      )}
    </div>
  );
};
