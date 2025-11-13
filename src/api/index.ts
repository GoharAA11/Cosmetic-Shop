// src/api/index.ts
import axios from 'axios';
import { Product, Category, User, CartItem , AdminStats, AddProductData, CheckoutBody } from '../types';

// Սահմանել բեկանեդի հասցեն՝ դինամիկ development / production
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cosmetic-shop-sa2n.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================================
// ԱՊՐԱՆՔՆԵՐԻ API-ներ (Products.tsx)
// ===================================
// 1. Ստանալ բոլոր ապրանքները (կամ ըստ կատեգորիայի)
export const fetchProducts = async (categorySlug?: string): Promise<Product[]> => {
  try {
    const response = await api.get('/products', {
      params: { category: categorySlug },
    });

    // Փոխակերպել price-ը Number-ի
    const products = (response.data as any[]).map(p => ({
        ...p,
        price: parseFloat(p.price),
    }));
    return products as Product[];
    
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// 2. Ստանալ բոլոր կատեգորիաները
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/products/categories');
    return response.data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ===================================
// ՕԳՏԱՏԵՐԻ API-ներ (Auth.tsx)
// ===================================

// 3. Գրանցում
export const registerUser = async (email: string, password: string): Promise<{ user: User, message: string }> => {
  try {
    const response = await api.post('/auth/register', { email, password });
    return { user: response.data.user as User, message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Գրանցման սխալ');
  }
};

// 4. Մուտք
export const loginUser = async (email: string, password: string): Promise<{ user: User, message: string }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return { user: response.data.user as User, message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Մուտքի սխալ');
  }
};

// ===================================
// ԶԱՄԲՅՈՒՂԻ API-ներ (Cart.tsx)
// ===================================

// 5. Ստանալ զամբյուղի բովանդակությունը
export const fetchCartItems = async (userId: number): Promise<CartItem[]> => {
  try {
    const response = await api.get(`/cart/${userId}`);
    return response.data as CartItem[];
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// 6. Ավելացնել ապրանք զամբյուղ
export const addToCart = async (userId: number, productId: number, quantity: number = 1): Promise<{ message: string }> => {
  try {
    const response = await api.post('/cart/add', { userId, productId, quantity });
    return { message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ապրանքը զամբյուղ ավելացնելու սխալ');
  }
};

// 7. Հեռացնել ապրանք զամբյուղից
export const removeFromCart = async (userId: number, productId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`, { 
      data: { userId } 
    });
    return { message: response.data.message };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ապրանքը զամբյուղից հեռացնելու սխալ');
  }
};

// ===================================
// ԱԴՄԻՆԻ API-ներ (Admin.tsx)
// ===================================

// 8. Ստանալ Ադմինի Վիճակագրությունը
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await api.get('/admin/stats');
    return response.data as AdminStats;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw new Error("Վիճակագրությունը բեռնելու սխալ");
  }
};

// 9. Ավելացնել Նոր Ապրանք
export const addProduct = async (productData: AddProductData): Promise<{ message: string, productId: number }> => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ապրանքն ավելացնելու սխալ');
  }
};

// 10. Ջնջել Ապրանքը
export const deleteProduct = async (productId: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Ապրանքը ջնջելու սխալ');
  }
};

// ===================================
// ՆՈՐ API-ներ. ՊԱՏՎԵՐԻ ՁԵՎԱԿԵՐՊՈՒՄ (Checkout)
// ===================================

// 11. Պատվերի Ձևակերպում (Checkout)
export const checkout = async (data: CheckoutBody): Promise<{ orderId: number, message: string }> => {
  try {
    const response = await api.post('/cart/checkout', data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Պատվերի ձևակերպման անհայտ սխալ';
    throw new Error(errorMessage);
  }
};
