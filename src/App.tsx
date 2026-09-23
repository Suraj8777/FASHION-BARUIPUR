import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, ProductColor, FabricOption, CustomMeasurements } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { STORE_INFO } from './data/storeInfo';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomeView } from './pages/HomeView';
import { ShopView } from './pages/ShopView';
import { ProductDetailView } from './pages/ProductDetailView';
import { AtelierView } from './pages/AtelierView';
import { HeritageView } from './pages/HeritageView';
import { ContactView } from './pages/ContactView';
import { CheckoutView } from './pages/CheckoutView';
import { AdminView } from './pages/AdminView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(INITIAL_PRODUCTS[0].id);
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('fb_catalog_products_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored products:', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('fb_catalog_products_v3', JSON.stringify(products));
    } catch (e) {
      console.error('Error caching products:', e);
    }
  }, [products]);

  const handleUpdateProductImage = (productId: string, newImageUrl: string, newGallery?: string[]) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              imageUrl: newImageUrl,
              galleryImages: newGallery && newGallery.length > 0 ? newGallery : (p.galleryImages || [newImageUrl]),
            }
          : p
      )
    );
  };
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initial sample tailored item in cart
    return [
      {
        id: 'cart-init-1',
        product: INITIAL_PRODUCTS[0],
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        selectedFabric: INITIAL_PRODUCTS[0].fabric,
        selectedSize: 40,
        quantity: 1,
        addedAt: Date.now(),
      },
    ];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-101',
      orderNumber: 'FB-984120',
      date: '21 Sep 2026',
      customer: {
        fullName: 'Soumya Ganguly',
        email: 'soumya.ganguly@outlook.com',
        phone: '9830554411',
        address: 'Baghajatin Colony, Station Road',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700086',
      },
      items: [
        {
          id: 'item-101',
          product: INITIAL_PRODUCTS[1],
          selectedColor: INITIAL_PRODUCTS[1].colors[0],
          selectedFabric: INITIAL_PRODUCTS[1].fabric,
          selectedSize: 42,
          quantity: 1,
          addedAt: Date.now() - 86400000,
        },
      ],
      subtotal: 26500,
      shipping: 0,
      tax: 3180,
      total: 29680,
      paymentMethod: 'UPI / NetBanking',
      status: 'Master Tailoring',
      trackingNumber: 'TRACK-BAR772',
      estimatedDelivery: '28 Sep 2026',
    },
    {
      id: 'ord-102',
      orderNumber: 'FB-652391',
      date: '19 Sep 2026',
      customer: {
        fullName: 'Dr. Debabrata Sen',
        email: 'debabrata.sen@medkol.in',
        phone: '8100223399',
        address: 'Dipshikha Enclave, Near Baruipur Court',
        city: 'Baruipur',
        state: 'West Bengal',
        pincode: '700144',
      },
      items: [
        {
          id: 'item-102',
          product: INITIAL_PRODUCTS[0],
          selectedColor: INITIAL_PRODUCTS[0].colors[0],
          selectedFabric: INITIAL_PRODUCTS[0].fabric,
          selectedSize: 40,
          quantity: 1,
          addedAt: Date.now() - 172800000,
        },
      ],
      subtotal: 18999,
      shipping: 0,
      tax: 2280,
      total: 21279,
      paymentMethod: 'Credit / Debit Card',
      status: 'Dispatched',
      trackingNumber: 'TRACK-BAR891',
      estimatedDelivery: '24 Sep 2026',
    },
  ]);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Scroll to top on navigation
  const navigateTo = (view: string, productId?: string) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedColor: ProductColor,
    selectedFabric: FabricOption,
    selectedSize: number,
    quantity: number,
    customMeasurements?: CustomMeasurements
  ) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor.id === selectedColor.id &&
        item.selectedFabric.id === selectedFabric.id &&
        item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        product,
        selectedColor,
        selectedFabric,
        selectedSize,
        quantity,
        customMeasurements,
        addedAt: Date.now(),
      };
      setCartItems((prev) => [newItem, ...prev]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Admin operations
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D13] text-[#F3F4F6] selection:bg-[#0064E0]/30 selection:text-white">
      {/* Universal Top Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Viewport Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            featuredProducts={products}
            onExploreCatalog={() => navigateTo('shop')}
            onOpenProduct={(id) => navigateTo('product-detail', id)}
            onOpenAtelier={() => navigateTo('atelier')}
            onOpenStoreInfo={() => navigateTo('heritage')}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            onSelectProduct={(id) => navigateTo('product-detail', id)}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            onBackToShop={() => navigateTo('shop')}
            onAddToCart={handleAddToCart}
            onUpdateProductImage={handleUpdateProductImage}
          />
        )}

        {currentView === 'atelier' && (
          <AtelierView
            onAddCustomSuitToCart={(prod, color, fabric) => {
              handleAddToCart(prod, color, fabric, 40, 1);
            }}
          />
        )}

        {currentView === 'heritage' && <HeritageView />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'checkout' && (
          <CheckoutView
            items={cartItems}
            onBackToShop={() => navigateTo('shop')}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            products={products}
            orders={orders}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Universal Shopping Bag Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => navigateTo('checkout')}
      />

      {/* Universal Footer with exact physical business details */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
