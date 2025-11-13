import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import { useShop } from '@/contexts/ShopContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { user, cartQuery, checkoutMutation } = useShop();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Հաշվարկներ
  const cartItems = cartQuery.data || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 30000 ? 0 : 2000;
  const totalWithShipping = subtotal + shippingFee;

  // FormData Տիպ
  type FormData = {
    recipientName: string;  
    phoneNumber: string;    
    deliveryAddress: string; 
    paymentMethod: 'Card' | 'Cash'; 
  };

  // Ֆորմայի վիճակ
  const [formData, setFormData] = useState<FormData>({
    recipientName: user?.name || '', 
    phoneNumber: user?.phone || '', 
    deliveryAddress: '',
    paymentMethod: 'Cash', 
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Փոխակերպում է փոքրատառ արժեքները մեծատառի
  const handlePaymentChange = (value: string) => {
    const mappedValue: 'Card' | 'Cash' = value === 'cash' ? 'Cash' : 'Card';
    
    setFormData(prev => ({ 
      ...prev, 
      paymentMethod: mappedValue 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.user_id) {
      toast({ title: "Սխալ", description: "Խնդրում ենք մուտք գործել։", variant: "destructive" });
      return;
    }

    if (cartItems.length === 0) {
      toast({ title: "Զգուշացում", description: "Զամբյուղը դատարկ է:", variant: "destructive" });
      navigate('/');
      return;
    }

    try {
      await checkoutMutation.mutateAsync({
        userId: user.user_id,
        items: cartItems.map(item => ({ 
          id: item.id, 
          price: item.price,
          quantity: item.quantity 
        })),
        ...formData,
        totalAmount: totalWithShipping, 
      });
      
      toast({
        title: 'Շնորհակալություն!',
        description: 'Ձեր պատվերը հաջողությամբ ձևակերպված է։'
      });
      navigate('/'); 
    } catch (error: any) {
      toast({
        title: 'Սխալ',
        description: error.message || 'Պատվերը ձևակերպելիս սխալ տեղի ունեցավ',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Պատվերի Ձևակերպում</h1>

        {/* ՈՒՂՂՈՒՄ 1: Փոխում ենք դասավորությունը lg:grid-cols-4-ի */}
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Աջ կողմ՝ Ամփոփում (Mobile-ում վերև, Desktop-ում աջ - 2/4 տարածք) */}
          <div className="lg:col-span-2 order-1 lg:order-2"> 
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ձեր Պատվերը</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate">{item.name} (x{item.quantity})</span>
                    <span>{(item.price * item.quantity).toFixed(2)} ֏</span>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ենթագումար</span>
                    <span className="font-semibold">{subtotal.toFixed(2)} ֏</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Առաքում</span>
                    <span className="font-semibold">
                      {shippingFee === 0 ? 'Անվճար' : `${shippingFee.toFixed(2)} ֏`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg border-t pt-2">
                    <span className="font-bold">Ընդամենը</span>
                    <span className="font-bold text-primary">
                      {totalWithShipping.toFixed(2)} ֏
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Ձախ կողմ՝ Առաքման Տվյալներ (Mobile-ում ներքև, Desktop-ում ձախ - 2/4 տարածք) */}
          <div className="lg:col-span-2 order-2 lg:order-1"> 
            <Card>
              <CardHeader>
                <CardTitle>Առաքման Տվյալներ</CardTitle>
                <CardDescription>Խնդրում ենք լրացնել Ձեր տվյալները</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="recipientName">Անուն, Ազգանուն</Label>
                    <Input 
                      id="recipientName" 
                      value={formData.recipientName} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Հեռախոսահամար</Label>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryAddress">Առաքման Հասցե</Label>
                    <Input 
                      id="deliveryAddress" 
                      value={formData.deliveryAddress} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  {/* Վճարման եղանակ */}
                  <div>
                    <Label>Վճարման Եղանակ</Label>
                    <RadioGroup 
                      defaultValue={formData.paymentMethod.toLowerCase()} 
                      onValueChange={handlePaymentChange} 
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">Կանխիկ առաքման ժամանակ</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" /> 
                        <Label htmlFor="card">Քարտով (online/POS)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Պատվիրելու կոճակը */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={checkoutMutation.isPending || cartItems.length === 0}
                  >
                    {checkoutMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ձևակերպում...</>
                    ) : (
                      `Վերջնական Պատվիրել (${totalWithShipping.toFixed(2)} ֏)`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;