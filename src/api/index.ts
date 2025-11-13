// src/api/index.ts
import axios from 'axios';
import { Product, Category, User, CartItem , AdminStats, AddProductData,CheckoutBody} from '../types';

// Սահմանել բեքենդի հասցեն
const API_BASE_URL = 'http://localhost:5000/api'; // Համապատասխանում է .env ֆայլի PORT-ին

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
    
    // <<<< ԱՎԵԼԱՑՆԵԼ ԱՅՍ ՄԱՍԸ >>>>
    // Փոխակերպել price-ը Number-ի
    const products = (response.data as any[]).map(p => ({
        ...p,
        price: parseFloat(p.price), // Ապահովում ենք, որ գինը ԹԻՎ լինի
    }));
    return products as Product[];
    // <<<< ԱՎԵԼԱՑՆԵԼ ԱՅՍ ՄԱՍԸ >>>>
    
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
    // Բեքենդը վերադարձնում է { message, user: { id, email, is_admin } }
    return { user: response.data.user as User, message: response.data.message };
  } catch (error: any) {
    // Կարևոր է մշակել 409 (Conflict) սխալը բեքենդից
    throw new Error(error.response?.data?.message || 'Գրանցման սխալ');
  }
};

// 4. Մուտք
export const loginUser = async (email: string, password: string): Promise<{ user: User, message: string }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Բեքենդը վերադարձնում է { message, user: { user_id, email, isAdmin } }
    return { user: response.data.user as User, message: response.data.message };
  } catch (error: any) {
    // Կարևոր է մշակել 401 (Unauthorized) սխալը բեքենդից
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
        // ՓՈԽԵԼ URL-ը՝ ավելացնելով productId-ն
        const response = await api.delete(`/cart/remove/${productId}`, { 
            // Օգտագործեք Body-ն մնացած տվյալների համար, օրինակ՝ userId-ի
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
        // Endpoint: POST /api/admin/products
        const response = await api.post('/admin/products', productData);
        // Ենթադրենք, Backend-ը վերադարձնում է { message, productId }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ապրանքն ավելացնելու սխալ');
    }
};

// 10. Ջնջել Ապրանքը
export const deleteProduct = async (productId: number): Promise<{ message: string }> => {
    try {
        // Endpoint: DELETE /api/admin/products/:id
        const response = await api.delete(`/admin/products/${productId}`);
        // Ենթադրենք, Backend-ը վերադարձնում է { message }
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
        // Endpoint: POST /api/cart/checkout
        const response = await api.post('/cart/checkout', data);
        return response.data;
    } catch (error: any) {
        // Բեքէնդից եկած սխալի հաղորդագրությունը փոխանցել
        const errorMessage = error.response?.data?.message || 'Պատվերի ձևակերպման անհայտ սխալ';
        // Կարևոր է: Գցել սխալ, որպեսզի useMutation-ը կարողանա այն մշակել
        throw new Error(errorMessage);
    }
};