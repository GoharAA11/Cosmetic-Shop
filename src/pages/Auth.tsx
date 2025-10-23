import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShop } from '@/contexts/ShopContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useShop();
  const { toast } = useToast();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(loginData.email, loginData.password)) {
      toast({
        title: 'Բարի գալուստ',
        description: 'Դուք հաջողությամբ մուտք եք գործել'
      });
      navigate('/');
    } else {
      toast({
        title: 'Սխալ',
        description: 'Անվավեր էլ․ հասցե կամ գաղտնաբառ',
        variant: 'destructive'
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: 'Սխալ',
        description: 'Գաղտնաբառերը չեն համընկնում',
        variant: 'destructive'
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: 'Սխալ',
        description: 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ',
        variant: 'destructive'
      });
      return;
    }

    if (register(registerData.email, registerData.password)) {
      toast({
        title: 'Հաջողություն',
        description: 'Դուք հաջողությամբ գրանցվել եք'
      });
      navigate('/');
    } else {
      toast({
        title: 'Սխալ',
        description: 'Այս էլ․ հասցեն արդեն գրանցված է',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Beauty Shop</CardTitle>
            <CardDescription>Մուտք գործեք կամ ստեղծեք նոր հաշիվ</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Մուտք</TabsTrigger>
                <TabsTrigger value="register">Գրանցում</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Էլ․ Հասցե</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="example@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Գաղտնաբառ</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Մուտք Գործել
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Ադմին հասցե: admin@cosmetic.shop
                  </p>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Էլ․ Հասցե</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="example@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Գաղտնաբառ</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Հաստատել Գաղտնաբառը</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Գրանցվել
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
