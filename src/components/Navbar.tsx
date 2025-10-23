import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, LogOut, Shield } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, cart } = useShop();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl">💄</span>
            </div>
            <span className="text-xl font-bold text-foreground">Beauty Shop</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Գլխավոր
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/products') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Ապրանքներ
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Մեր Մասին
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </Link>
                {user.isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon">
                      <Shield className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Մուտք
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
