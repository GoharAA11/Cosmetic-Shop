import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Cart = () => {
  const { cart, products, removeFromCart } = useShop();
  const { toast } = useToast();

  const cartItems = cart.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)!
  }));

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product?.price || 0) * item.quantity, 0
  );

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: 'Հեռացված է',
      description: `${productName} հեռացվել է զամբյուղից`
    });
  };

  const handleCheckout = () => {
    toast({
      title: 'Շնորհակալություն!',
      description: 'Ձեր պատվերը ընդունված է'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Զամբյուղ</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-xl text-muted-foreground">Ձեր զամբյուղը դատարկ է</p>
              <Link to="/products">
                <Button>Գնումներ Սկսել</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="flex gap-4 p-6">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      <p className="text-muted-foreground">{item.product.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">
                          {item.product.price.toFixed(2)} ֏ × {item.quantity}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemove(item.productId, item.product.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Ամփոփում</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ենթագումար</span>
                    <span className="font-semibold">{total.toFixed(2)} ֏</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Առաքում</span>
                    <span className="font-semibold">
                      {total > 30000 ? 'Անվճար' : '2000 ֏'}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Ընդամենը</span>
                      <span className="font-bold text-primary">
                        {(total + (total > 30000 ? 0 : 2000)).toFixed(2)} ֏
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Ձեռք Բերել
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
