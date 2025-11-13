import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./contexts/ShopContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Cart from "./pages/Cart";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Product, User } from "./types"; 
import Checkout from './pages/Checkout';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ShopProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
         <Route
                path="/products"
                element={
                  <Products
                  
                  />
                }
                />
  

            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ShopProvider>
  </QueryClientProvider>
);

export default App;

