import React from 'react';
import { CartItem } from '../../types';
import { MiniSuitPreview } from '../3d/MiniSuitPreview';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Math.round(item.product.price * item.selectedFabric.priceMultiplier);
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d1017] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0064E0]" />
              <h2 className="text-base font-cinzel text-white font-semibold">Your Tailored Selection</h2>
              <span className="text-xs text-slate-400 font-mono">({items.length} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Your wardrobe is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Explore our 3D interactive showroom to customize and preview bespoke business garments.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#0064E0] text-white text-xs font-semibold hover:bg-[#0052b8] transition-colors"
                >
                  Explore 3D Collections
                </button>
              </div>
            ) : (
              items.map((item) => {
                const calculatedPrice = Math.round(item.product.price * item.selectedFabric.priceMultiplier);
                return (
                  <div
                    key={item.id}
                    className="glass-panel p-4 rounded-2xl border border-white/10 flex gap-4 relative group"
                  >
                    {/* Mini 3D Suit Model Preview */}
                    <div className="w-20 h-24 bg-black/40 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-white/5 relative">
                      <MiniSuitPreview
                        colorHex={item.selectedColor.hex}
                        modelType={item.product.modelType}
                        width={80}
                        height={96}
                        interactive={false}
                      />
                      <span
                        className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: item.selectedColor.hex }}
                        title={item.selectedColor.name}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.selectedFabric.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300">
                        <span>Size: <strong className="text-white font-mono">{item.selectedSize}R</strong></span>
                        <span>·</span>
                        <span className="truncate">{item.selectedColor.name}</span>
                      </div>

                      {item.customMeasurements && (
                        <div className="mt-1.5 text-[10px] text-[#00D2FF] bg-[#0064E0]/15 px-2 py-0.5 rounded border border-[#0064E0]/30 inline-block font-mono">
                          Custom Fit: {item.customMeasurements.fitPreference} (Chest {item.customMeasurements.chest}")
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono text-white px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="text-slate-400 hover:text-white p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-white font-mono tabular-nums">
                            ₹{(calculatedPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0B0D13]/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Fitting Delivery</span>
                  <span className="text-emerald-400 font-medium">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-semibold text-white">
                  <span>Total (INR)</span>
                  <span className="font-mono text-base text-[#00D2FF] tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#0064E0] shrink-0" />
                <span>100% Bespoke Alteration Guarantee at Baruipur Atelier</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-xs shadow-[0_0_20px_rgba(0,100,224,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Bespoke Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
