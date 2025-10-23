import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface User {
  email: string;
  isAdmin: boolean;
}

interface ShopContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  cart: { productId: string; quantity: number }[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Rose Glow Serum',
    price: 45.99,
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    description: 'Luxurious rose-infused serum for radiant skin'
  },
  {
    id: '2',
    name: 'Velvet Pink Lipstick',
    price: 22.50,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
    description: 'Long-lasting velvet finish lipstick'
  },
  {
    id: '3',
    name: 'Blush & Glow Palette',
    price: 38.00,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
    description: 'Multi-tone blush palette for all skin types'
  },
  {
    id: '4',
    name: 'Hydrating Face Cream',
    price: 52.00,
    category: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    description: '24-hour moisture lock face cream'
  },
  {
    id: '5',
    name: 'Rose Petal Perfume',
    price: 68.00,
    category: 'fragrance',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
    description: 'Delicate floral fragrance with rose notes'
  },
  {
    id: '6',
    name: 'Silk Hair Serum',
    price: 28.50,
    category: 'haircare',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
    description: 'Nourishing serum for smooth, shiny hair'
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({ email: foundUser.email, isAdmin: foundUser.isAdmin });
      return true;
    }
    return false;
  };

  const register = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      email,
      password,
      isAdmin: email === 'admin@cosmetic.shop'
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser({ email: newUser.email, isAdmin: newUser.isAdmin });
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (productId: string) => {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        deleteProduct,
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart
      }}
    >
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
