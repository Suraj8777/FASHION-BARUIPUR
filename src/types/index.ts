export type ProductCategory = 
  | 'Executive 2-Piece' 
  | 'Royal 3-Piece' 
  | 'Tuxedos & Gala' 
  | 'Italian Blazers' 
  | 'Bespoke Bandhgala' 
  | 'Formal Trousers'
  | 'Bespoke Dress Shirts'
  | 'Formal Waistcoats'
  | 'Luxury Accessories';

export type FabricType = 
  | 'Super 150s Merino Wool' 
  | 'Italian Cashmere Blend' 
  | 'Mulberry Silk Worsted' 
  | 'English Tweed' 
  | 'Royal Midnight Velvet' 
  | 'Bespoke Linen-Wool'
  | 'Sea Island Giza Cotton'
  | 'English Barathea Wool'
  | 'High-Twist Wool Hopsack';

export type FitType = 'Slim Fit' | 'Tailored Fit' | 'Classic Formal';

export type ModelType = 
  | 'two_piece' 
  | 'three_piece' 
  | 'tuxedo' 
  | 'blazer' 
  | 'bandhgala'
  | 'trouser'
  | 'shirt'
  | 'waistcoat'
  | 'accessory';

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string;
  roughness: number;
  metalness: number;
  bumpScale?: number;
}

export interface FabricOption {
  id: string;
  name: string;
  type: FabricType;
  weave: string;
  weightGsm: number;
  description: string;
  patternType: 'solid' | 'pinstripe' | 'herringbone' | 'glen-plaid' | 'velvet-matte';
  priceMultiplier: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  description: string;
  fabric: FabricOption;
  availableFabrics: FabricOption[];
  colors: ProductColor[];
  sizes: number[]; // 36, 38, 40, 42, 44, 46, 48
  inStock: boolean;
  stockCount: number;
  fitType: FitType;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  tags: string[];
  features: string[];
  stylingTips: string;
  accentColor: string;
  modelType: ModelType;
  imageUrl: string;
  galleryImages?: string[];
}

export interface CustomMeasurements {
  chest: number; // inches
  waist: number;
  shoulder: number;
  heightCm: number;
  weightKg: number;
  sleeveLength?: number;
  fitPreference: 'Fitted Slim' | 'Tailored Modern' | 'Relaxed Classic';
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedFabric: FabricOption;
  selectedSize: number;
  quantity: number;
  customMeasurements?: CustomMeasurements;
  addedAt: number;
}

export type OrderStatus = 
  | 'Order Placed' 
  | 'Fabric Reserved' 
  | 'Master Tailoring' 
  | 'Quality Audited' 
  | 'Dispatched' 
  | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    notes?: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: 'UPI / NetBanking' | 'Credit / Debit Card' | 'Cash on Delivery (Store / Local)' | 'MetaPay';
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface SizeRecommendation {
  recommendedSize: number;
  fitType: FitType;
  confidence: number;
  explanation: string;
}
