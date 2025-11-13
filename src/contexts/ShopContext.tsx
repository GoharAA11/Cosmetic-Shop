import React, { createContext, useContext, useState, useEffect, useCallback,useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    loginUser, registerUser, 
    fetchProducts, fetchCategories, 
    fetchCartItems, addToCart as apiAddToCart, 
    removeFromCart as apiRemoveFromCart ,
    checkout
} from '@/api'; 
import { Product as ProductType, User as UserType, CartItem as CartItemType, Category as CategoryType ,CheckoutBody} from '@/types'; 

export type Product = ProductType;
export type User = UserType 
export type CartItem = CartItemType;

// Սահմանում ենք Կատեգորիայի Տիպը Context-ի համար
type CategoryContextItem = { id: string | number; label: string };

// ՈՒՂՂՈՒՄ: Լրացնել loginMutation-ի տեսակը, քանի որ այն վերադարձնում է օգտատիրոջ տվյալներ
interface LoginResponse {
    user: User; 
    message: string;
    //token: string; // Ենթադրենք նաև token է վերադարձնում
}

interface ShopContextType {
    // Տվյալների բեռնումը կառավարվում է Query-ով
    productsQuery: { data: Product[] | undefined; isLoading: boolean; error: unknown };
    categoriesQuery: {data: CategoryContextItem[]| undefined; isLoading: boolean; error: unknown };
    cartQuery: { data: CartItem[] | undefined; isLoading: boolean; error: unknown };

    user: User | null;
    
    // setUser-ը մնում է, բայց այնուամենայնիվ մենք կօգտագործենք login/logout-ը
    setUser: React.Dispatch<React.SetStateAction<User | null>>; 

    // Mutations
    loginMutation: ReturnType<typeof useMutation<LoginResponse, unknown, { email: string, password: string }>>;
    registerMutation: ReturnType<typeof useMutation>;
    logout: () => void;
    addToCartMutation: ReturnType<typeof useMutation>;
    removeFromCartMutation: ReturnType<typeof useMutation>;
    checkoutMutation: ReturnType<typeof useMutation<
        { orderId: number, message: string }, // OnSuccess-ի տեսակը
        unknown, // Error-ի տեսակը
        CheckoutBody // MutationFn-ի տեսակը
    >>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// --------------------------------------------------------------------------------------
// Ֆունկցիա՝ Session Storage-ից օգտատիրոջ տվյալները բերելու համար (ՄԻԱՅՆ ԿԱՐԴԱԼ)
const getStoredUser = (): User | null => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
        try {
            // Կարևոր է: Համոզվեք, որ այն դարձնում եք User տեսակ
            return JSON.parse(storedUser) as User; 
        } catch (e) {
            console.error("Failed to parse user from Session Storage", e);
            sessionStorage.removeItem('user');
            return null;
        }
    }
    return null;
};
// --------------------------------------------------------------------------------------


export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    
    // 1. Օգտագործել getStoredUser՝ սկզբնական վիճակը սահմանելու համար
    const [user, setUser] = useState<User | null>(getStoredUser);


    // 2. AUTH MUTATIONS (Փոփոխություններ)
    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) => loginUser(email, password),
        onSuccess: (data: LoginResponse) => {
            // Սահմանել user-ին հաջող մուտքից հետո
            setUser(data.user); 
            // Պահպանել user-ի տվյալները Session Storage-ում
            sessionStorage.setItem('user', JSON.stringify(data.user)); 
            
            // Թարմացնել զամբյուղը նոր user-ի համար
            queryClient.invalidateQueries({ queryKey: ['cart', data.user.user_id] }); 
        },
    });

    const registerMutation = useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) => registerUser(email, password),
        onSuccess: (data: LoginResponse) => {
             // Սահմանել user-ին հաջող գրանցումից հետո
            setUser(data.user);
            // Պահպանել user-ի տվյալները Session Storage-ում
            sessionStorage.setItem('user', JSON.stringify(data.user)); 
            queryClient.invalidateQueries({ queryKey: ['cart', data.user.user_id] });
        },
    });

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('user'); // Ջնջել Session Storage-ից
        queryClient.setQueryData(['cart'], []); // Մաքրել զամբյուղի cache-ը
        // Կարևոր է: Ավելացնել ցանկացած այլ անհրաժեշտ մաքրում (օրինակ՝ token-ի ջնջում)
    }, [queryClient]);
    
    // 3. Մնացած Queries և Mutations-ը մնում են նույնը
    
    // 1. PRODUCTS QUERY
    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchProducts(),
    });

    // 2. CATEGORIES QUERY
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const data = await fetchCategories();
             // Փոխակերպում CategoryType-ից CategoryContextItem-ի 
            /*const mappedCategories: CategoryContextItem[] = (data as CategoryType[]).map((cat) => ({
                id: cat.slug, 
                label: cat.name,
            }));*/
            const fetchedCategories = (data || []) as CategoryContextItem[];

            // Ավելացնել "Բոլորը" տարբերակը
            return [{ id: 'all', label: 'Բոլորը' }, ...fetchedCategories];
        },
    });

    // 3. CART QUERY (Կախված է user-ից)
    const cartQuery = useQuery({
        queryKey: ['cart', user?.user_id],
        queryFn: () => user?.user_id ? fetchCartItems(user.user_id) : Promise.resolve([]),
        enabled: !!user, // Բեռնել միայն այն դեպքում, եթե user-ը մուտք է գործած
    });

    // 5. CART MUTATIONS
    const addToCartMutation = useMutation({
        mutationFn: ({ userId, productId, quantity }: { userId: number, productId: number, quantity?: number }) => apiAddToCart(userId, productId, quantity),
        onSuccess: () => {
             // Թարմացնել զամբյուղը
            queryClient.invalidateQueries({ queryKey: ['cart'] }); 
        },
    });

    const removeFromCartMutation = useMutation({
        mutationFn: ({ userId, productId }: { userId: number, productId: number }) => apiRemoveFromCart(userId, productId),
        onSuccess: () => {
             // Թարմացնել զամբյուղը
            queryClient.invalidateQueries({ queryKey: ['cart'] }); 
        },
    });

    // ՆՈՐ 6. CHECKOUT MUTATION
    const checkoutMutation = useMutation({
        mutationFn: (data: CheckoutBody) => checkout(data),
        onSuccess: (data) => {
            // Պատվերը հաջողությամբ ձևակերպելուց հետո զամբյուղը դատարկվում է
            // Թարմացնել զամբյուղի տվյալները, որպեսզի ֆրոնտէնդը տեսնի դատարկ զամբյուղը
            queryClient.invalidateQueries({ queryKey: ['cart'] }); 
            
            // Կարող եք նաև թարմացնել օգտատիրոջ պատվերների ցանկը, եթե այդպիսին կա
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });


    // Օգտագործել useMemo-ն՝ performance-ը բարելավելու համար
    const contextValue = useMemo(() => ({
        productsQuery,
        categoriesQuery,
        cartQuery,
        user,
        setUser,
        loginMutation,
        registerMutation,
        logout,
        addToCartMutation,
        removeFromCartMutation,
        checkoutMutation,
    }), [
        productsQuery, categoriesQuery, cartQuery, 
        user, setUser, loginMutation, registerMutation, 
        logout, addToCartMutation, removeFromCartMutation,checkoutMutation
    ]);


    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};