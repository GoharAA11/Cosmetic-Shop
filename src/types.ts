// src/types.ts

// Բեքենդից ստացվող ապրանքի տեսակը (Products.tsx)
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string; // category slug (e.g., 'skincare')
  image: string;    // image_url AS image
  description: string;
}

// Օգտատիրոջ տվյալների տեսակը (Auth.tsx)
export interface User {
  user_id: number;
  email: string;
  isAdmin: boolean;

  name: string | null;
  phone: string | null;
}

// Կատեգորիայի Ինտերֆեյս
export interface Category {
  id?: string; // slug
  category_id?: number;
    name?: string;
    slug?: string;
    label: string; // name AS label (Անուն, որը ցուցադրվում է)
    value: string;
} 

// Զամբյուղում պահվող ապրանքի տեսակը (Cart.tsx)
export interface CartItem extends Product {
  product_id: number;
    name: string;
    image: string;
  price: number;
  quantity: number;
  user_id?: number;
}

export interface AdminStats {
    products: number;
    orders: number;
    revenue: number;
}

export interface AddProductData {
    name: string;
    price: number;
    category_slug: string; // օգտագործվում է category_id-ն գտնելու համար
    image_url: string;
    description: string;
}

// Պատվերի ապրանքի տեսակը, որը փոխանցվում է checkout-ի ժամանակ (հիմնված CartItem-ի վրա)
export interface CheckoutCartItem {
    // id-ն այստեղ նույնական է product_id-ին, բայց այնուամենայնիվ փոխանցվում է որպես id
    id: number; 
    price: number; 
    quantity: number;
}

// Ֆրոնտէնդից գալիս է այս տեսակի մարմինը (Cart.tsx-ից դեպի /api/cart/checkout)
export interface CheckoutBody {
    userId: number; 
    items: CheckoutCartItem[]; // Այս ապրանքների զանգվածն էլ կլինի Order_Items աղյուսակում
    
    // Անձնական և առաքման տվյալներ
    recipientName: string;  
    phoneNumber: string;    
    deliveryAddress: string; 
    
    // Վճարման մեթոդ
    paymentMethod: 'Card' | 'Cash'; 
totalAmount: number;
}