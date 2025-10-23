import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const Admin = () => {
  const navigate = useNavigate();
  const { products, addProduct, deleteProduct, user } = useShop();
  const { toast } = useToast();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'skincare',
    image: '',
    description: ''
  });

  if (!user?.isAdmin) {
    navigate('/');
    return null;
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) {
      toast({
        title: 'Սխալ',
        description: 'Խնդրում ենք լրացնել բոլոր դաշտերը',
        variant: 'destructive'
      });
      return;
    }

    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description
    });

    toast({
      title: 'Հաջողություն',
      description: 'Ապրանքը հաջողությամբ ավելացվեց'
    });

    setNewProduct({
      name: '',
      price: '',
      category: 'skincare',
      image: '',
      description: ''
    });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Վստա՞հ եք, որ ուզում եք ջնջել "${name}"-ը`)) {
      deleteProduct(id);
      toast({
        title: 'Ջնջված է',
        description: `${name} ջնջվել է ցանկից`
      });
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ադմինի Վահանակ</h1>
          <p className="text-muted-foreground">Կառավարեք ձեր ապրանքները և հետևեք վաճառքին</p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Ապրանքների Քանակ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Ընդհանուր Արժեք</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} ֏</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Կատեգորիաներ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Set(products.map(p => p.category)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Նոր Ապրանք Ավելացնել
            </CardTitle>
            <CardDescription>Լրացրեք դաշտերը նոր ապրանք ավելացնելու համար</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Անուն</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ապրանքի անուն"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Գին (֏)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Կատեգորիա</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skincare">Մաշկի Խնամք</SelectItem>
                    <SelectItem value="makeup">Մեյքափ</SelectItem>
                    <SelectItem value="fragrance">Բուրմունք</SelectItem>
                    <SelectItem value="haircare">Մազերի Խնամք</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Նկարի URL</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Նկարագրություն</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Ապրանքի նկարագրություն"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Ավելացնել Ապրանք
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ապրանքների Ցանկ</CardTitle>
            <CardDescription>Կառավարեք ձեր բոլոր ապրանքները</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Նկար</TableHead>
                  <TableHead>Անուն</TableHead>
                  <TableHead>Կատեգորիա</TableHead>
                  <TableHead>Գին</TableHead>
                  <TableHead className="text-right">Գործողություններ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.price.toFixed(2)} ֏</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
