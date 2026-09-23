import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { MiniSuitPreview } from '../components/3d/MiniSuitPreview';
import { STORE_INFO } from '../data/storeInfo';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Sparkles,
  Store
} from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  onBackToShop: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  onBackToShop,
  onOrderCompleted,
}) => {
  const [fullName, setFullName] = useState('Rahul Mukherjee');
  const [email, setEmail] = useState('rahul.mukherjee@example.com');
  const [phone, setPhone] = useState('9830123456');
  const [address, setAddress] = useState('Flat 4B, Dipshikha Enclave, Station Road');
  const [city, setCity] = useState('Baruipur');
  const [state, setState] = useState('West Bengal');
  const [pincode, setPincode] = useState('700144');
  const [paymentMethod, setPaymentMethod] = useState<'UPI / NetBanking' | 'Credit / Debit Card' | 'Cash on Delivery (Store / Local)'>('UPI / NetBanking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((acc, item) => {
    const itemPrice = Math.round(item.product.price * item.selectedFabric.priceMultiplier);
    return acc + itemPrice * item.quantity;
  }, 0);
  const shipping = 0; // Complimentary express delivery
  const tax = Math.round(subtotal * 0.12); // 12% GST
  const total = subtotal + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `FB-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          pincode,
        },
        items: [...items],
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        status: 'Order Placed',
        trackingNumber: `TRACK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        estimatedDelivery: '7 to 10 Business Days (Master Hand-Tailored)',
      };

      // Confetti celebratory burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0064E0', '#00D2FF', '#FFFFFF', '#FFD700'],
      });

      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      onOrderCompleted(newOrder);
    }, 1200);
  };

  // If completed, show luxury order confirmation receipt
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0064E0]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-[#0064E0]/20 border border-[#0064E0]/40 flex items-center justify-center text-[#00D2FF] mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-[#00D2FF] uppercase tracking-widest block mb-2">
            Order Confirmed · Baruipur Atelier
          </span>
          <h1 className="text-2xl sm:text-4xl font-cinzel font-bold text-white mb-3">
            Your Bespoke Garment Is Reserved
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-8">
            Thank you, {completedOrder.customer.fullName}. Our master cutters at Dipshikha Complex, Baruipur have received your order #{completedOrder.orderNumber}.
          </p>

          {/* Tracking Pipeline */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 mb-8 text-left max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400">Tracking Reference:</span>
              <span className="text-xs font-mono font-bold text-white">{completedOrder.trackingNumber}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-[#0064E0] text-white flex items-center justify-center mb-1 text-[10px] font-bold">1</span>
                <span className="text-white font-medium">Placed</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center mb-1 text-[10px]">2</span>
                <span className="text-slate-400">Fabric Cut</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center mb-1 text-[10px]">3</span>
                <span className="text-slate-400">Tailoring</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-6 h-6 rounded-full bg-white/10 text-slate-400 flex items-center justify-center mb-1 text-[10px]">4</span>
                <span className="text-slate-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-6 rounded-2xl bg-black/30 border border-white/10 max-w-xl mx-auto text-left space-y-3 mb-8 text-xs text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Delivery Address:</span>
              <span className="text-right text-white font-medium">
                {completedOrder.customer.address}, {completedOrder.customer.city} ({completedOrder.customer.pincode})
              </span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Payment Mode:</span>
              <span className="text-white font-medium">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-sm text-white">
              <span>Total Paid / Payable:</span>
              <span className="font-mono text-[#00D2FF]">₹{completedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBackToShop}
              className="px-6 py-3 rounded-xl bg-[#0064E0] hover:bg-[#0052b8] text-white text-xs font-semibold transition-all shadow-lg"
            >
              Continue Exploring Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={onBackToShop}
        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Customer and Delivery Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-2xl font-cinzel font-bold text-white mb-1">Bespoke Checkout</h1>
            <p className="text-xs text-slate-400">
              Provide delivery instructions for our white-glove atelier fitting dispatch.
            </p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Quick Fill option for Baruipur Local Resident */}
            <div className="p-3.5 rounded-xl glass-panel border border-[#0064E0]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#00D2FF]" />
                <span className="text-xs text-slate-300">Visiting or based in Baruipur / South 24 Parganas?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddress('Dipshikha Complex, CRP 9+, Baruipur');
                  setCity('Baruipur');
                  setState('West Bengal');
                  setPincode('700144');
                }}
                className="text-xs text-[#00D2FF] hover:underline font-medium"
              >
                Use Store Address (PIN 700144)
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                1. Client Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Mobile Phone (for fitting SMS)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                2. Shipping & Fitting Destination
              </h3>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Street Address, House/Apartment No.</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-[#0064E0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#0064E0] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                3. Payment Method
              </h3>
              <div className="space-y-2.5">
                {[
                  { id: 'UPI / NetBanking', label: 'Instant UPI / QR / NetBanking', desc: 'Google Pay, PhonePe, Paytm, or NetBanking' },
                  { id: 'Credit / Debit Card', label: 'Credit or Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                  { id: 'Cash on Delivery (Store / Local)', label: 'Cash on Delivery (Store / Local Baruipur)', desc: 'Pay during home trial or collect at Dipshikha Complex' },
                ].map((m) => (
                  <label
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'bg-[#0064E0]/15 border-[#0064E0] text-white shadow-sm'
                        : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as any)}
                      className="mt-1 accent-[#0064E0]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">{m.label}</span>
                      <span className="text-[11px] text-slate-400">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0064E0] to-[#0052b8] text-white font-semibold text-sm shadow-[0_0_25px_rgba(0,100,224,0.5)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Locking Bespoke Allocation...</span>
              ) : (
                <span>Confirm Bespoke Order · ₹{total.toLocaleString('en-IN')}</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Items Summary with 3D Previews */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 sticky top-28 space-y-6">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Tailored Garments in Order ({items.length})
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {items.map((item) => {
                const itemPrice = Math.round(item.product.price * item.selectedFabric.priceMultiplier);
                return (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-white/5 items-center">
                    <div className="w-16 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <MiniSuitPreview
                        colorHex={item.selectedColor.hex}
                        modelType={item.product.modelType}
                        width={64}
                        height={80}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{item.selectedFabric.name}</p>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Size: {item.selectedSize}R · Qty: {item.quantity}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-white/10 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Atelier Courier & Insurance</span>
                <span className="text-emerald-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Goods & Services Tax (GST 12%)</span>
                <span className="font-mono text-white tabular-nums">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="font-mono text-[#00D2FF] tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0064E0]" />
                <span>Baruipur Master Guarantee</span>
              </div>
              <p>
                Each garment includes complimentary in-person alterations within 30 days at our Dipshikha Complex flagship store.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
