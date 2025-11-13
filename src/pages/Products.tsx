import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Products = () => {
    // Փոխել useShop-ից ստացվող տվյալները
    const { productsQuery, categoriesQuery, user, addToCartMutation } = useShop(); 
    const { toast } = useToast();
    const [activeCategory, setActiveCategory] = useState('all');

    // Բեռնման և սխալի մշակում
    if (productsQuery.isLoading || categoriesQuery.isLoading) {
        return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-8 text-center">Բեռնում...</div></div>;
    }

    if (productsQuery.error || categoriesQuery.error) {
         return <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-8 text-center text-red-500">Սխալ տվյալների բեռնման ժամանակ</div></div>;
    }

    // Օգտագործել API-ից եկած տվյալները
    const products = productsQuery.data || [];
    const categories = categoriesQuery.data || [{ id: 'all', label: 'Բոլորը' }]; // Ապահովել նվազագույն զանգված

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    // Փոխել handleAddToCart ֆունկցիան՝ օգտագործելով mutation
    const handleAddToCart = async (productId: number, productName: string) => { // Փոխել string-ը number-ի
        if (!user || !user.user_id) {
            toast({
                title: 'Մուտք գործեք',
                description: 'Զամբյուղին ավելացնելու համար անհրաժեշտ է մուտք գործել',
                variant: 'destructive'
            });
            return;
        }

        try {
            await addToCartMutation.mutateAsync({ 
                userId: user.user_id, 
                productId: productId, 
                quantity: 1 // Միշտ ավելացնում ենք 1
            });
            
            toast({
                title: 'Ավելացված է',
                description: `${productName} ավելացված է զամբյուղին`
            });
        } catch (error: any) {
            toast({
                title: 'Սխալ',
                description: error.message || 'Ապրանքը զամբյուղ չավելացվեց',
                variant: 'destructive'
            });
        }
    };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Մեր Ապրանքները</h1>
          <p className="text-muted-foreground text-lg">
            Ընտրեք լավագույն կոսմետիկան ձեր գեղեցկության համար
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id as string}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {categories.find(c => c.id === product.category)?.label}
                  </Badge>
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">
                  {product.price.toFixed(2)} ֏
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full gap-2" 
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addToCartMutation.isPending ? 'Ավելացնում...' : 'Ավելացնել Զամբյուղ'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Այս կատեգորիայում ապրանքներ չկան
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
