import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShop } from '@/contexts/ShopContext'; // Օգտագործել user-ին ստուգելու համար
import { 
    getAdminStats, 
    addProduct as apiAddProduct, 
    deleteProduct as apiDeleteProduct,
    fetchProducts, // Բերել ապրանքների ցուցակը
    fetchCategories // Բերել կատեգորիաները Add Product Form-ի համար
} from '@/api'; 
import { AdminStats, AddProductData, Product, Category } from '@/types'; 
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

// ===================================
// 1. Zod Schema - Նոր Ապրանքի Ֆորմա
// ===================================
const formSchema = z.object({
    name: z.string().min(2, "Անունը պետք է պարունակի առնվազն 2 նիշ"),
    price: z.preprocess(
        (val) => Number(val),
        z.number().min(0.01, "Գինը պետք է լինի դրական")
    ),
    category_slug: z.string().min(1, "Ընտրեք կատեգորիա"),
    image_url: z.string().url("Նկարի հասցեն պետք է լինի վավեր URL"),
    description: z.string().min(10, "Նկարագրությունը պետք է պարունակի առնվազն 10 նիշ"),
});

type NewProductFormValues = z.infer<typeof formSchema>;

const Admin = () => {
    const queryClient = useQueryClient();
    const { user } = useShop(); // Ստուգում ենք user-ի կարգավիճակը և isAdmin-ը
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('stats');

    // Ստուգում - Եթե user-ը մուտք չի գործել կամ admin չէ
    if (!user || !user.isAdmin) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center text-red-500">
                    Մուտքը մերժված է: Դուք չունեք ադմինիստրատորի իրավունքներ։
                </div>
            </div>
        );
    }

    // ===================================
    // 2. React Query Hooks (Admin Տվյալներ)
    // ===================================

    // Admin Վիճակագրություն
    const statsQuery = useQuery<AdminStats>({
        queryKey: ['adminStats'],
        queryFn: getAdminStats,
    });
    
    // Բոլոր Ապրանքները Admin Ցուցակի համար
    const productsQuery = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: () => fetchProducts(), // Օգտագործել fetchProducts առանց slug-ի
    });

    // Կատեգորիաները ֆորմայի համար
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const { 
        data: categories, 
        isLoading: isLoadingCategories, 
        isError: isErrorCategories 
    } = categoriesQuery;

    // ===================================
    // 3. Mutations (Փոփոխություններ)
    // ===================================

    // Նոր Ապրանք Ավելացնել
    const addProductMutation = useMutation({
        mutationFn: (data: NewProductFormValues) => apiAddProduct(data as AddProductData),
        onSuccess: () => {
            // Թարմացնել ապրանքների ցուցակը և վիճակագրությունը
            queryClient.invalidateQueries({ queryKey: ['products'] }); 
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            toast({ title: "Հաջողություն", description: "Նոր ապրանքն ավելացված է:" });
            form.reset();
        },
        onError: (error: any) => {
            toast({ title: "Սխալ", description: error.message || "Ապրանքը չավելացվեց։", variant: "destructive" });
        }
    });

    // Ապրանք Ջնջել
    const deleteProductMutation = useMutation({
        mutationFn: (productId: number) => apiDeleteProduct(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] }); 
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            toast({ title: "Հաջողություն", description: "Ապրանքը հաջողությամբ ջնջված է:" });
        },
        onError: (error: any) => {
            toast({ title: "Սխալ", description: error.message || "Ապրանքը չջնջվեց։", variant: "destructive" });
        }
    });

    // ===================================
    // 4. Ֆորմայի Կառավարում
    // ===================================
    const form = useForm<NewProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            category_slug: "",
            image_url: "",
            description: "",
        },
    });

    const onSubmit = (values: NewProductFormValues) => {
        addProductMutation.mutate(values);
    };

    const handleDeleteProduct = (productId: number, productName: string) => {
        if (window.confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել ${productName}-ը:`)) {
            deleteProductMutation.mutate(productId);
        }
    };

    // ===================================
    // 5. Կոմպոնենտի Ցուցադրում
    // ===================================
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Ադմինի Վահանակ</h1>

                {/* Tabs Ֆիլտր */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                    <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                        <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
                        <TabsTrigger value="add">Ավելացնել Ապրանք</TabsTrigger>
                        <TabsTrigger value="list">Ապրանքների Ցուցակ</TabsTrigger>
                    </TabsList>

                    {/* ՏԱԲ 1: Վիճակագրություն */}
                    <TabsContent value="stats">
                        {statsQuery.isLoading && <div className="text-center py-8">Բեռնում...</div>}
                        {statsQuery.isError && <div className="text-center py-8 text-red-500">Վիճակագրությունը բեռնել չհաջողվեց</div>}
                        {statsQuery.data && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">Ընդհանուր Ապրանքներ</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-blue-600">{statsQuery.data.products}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">Ընդհանուր Պատվերներ</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-green-600">{statsQuery.data.orders}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">Ընդհանուր Վաճառք</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-yellow-600">{statsQuery.data.revenue.toFixed(2)} ֏</div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    {/* ՏԱԲ 2: Ավելացնել Ապրանք */}
                    <TabsContent value="add">
                        <Card className="max-w-xl mx-auto mt-6">
                            <CardHeader>
                                <CardTitle>Նոր Ապրանքի Ավելացում</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Անուն</FormLabel>
                                                    <FormControl><Input placeholder="Ապրանքի անունը" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Գին</FormLabel>
                                                    <FormControl><Input type="number" placeholder="0.00" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="category_slug"
                                            render={({ field }) => { 

                                                console.log("Field Value:", field.value, "Type:", typeof field.value); 
                                                            // Console-ում տեսեք, թե ինչ արժեք է ընդունում field.value-ն ընտրելուց հետո
                                                // Փնտրել ընտրված կատեգորիան
                                                const selectedCategory = categories?.find(
                                                   (cat) => String(cat.id) === String(field.value)
                                              );
                                              console.log("Selected Category:", selectedCategory);
                                                            // Console-ում տեսեք, թե արդյոք ճիշտ կատեգորիան է գտնվում
                                                
                                                return (
                                                    <FormItem>
                                                        <FormLabel>Կատեգորիա</FormLabel>
                                                        <Select onValueChange={field.onChange} 
                                                        value={field.value || ""}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                  
                                                                   <SelectValue>
                                                                    {selectedCategory?.label || "Ընտրեք կատեգորիա"}
                                                                </SelectValue>
                                                                   
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                
                                                                {/* 1. Եթե Բեռնում է, ցուցադրել հաղորդագրություն */}
                                                                {isLoadingCategories && (
                                                                    <SelectItem key="loading-status-unique" value="loading" disabled>
                                                                        Բեռնում...
                                                                    </SelectItem>
                                                                )}

                                                                {/* 2. Եթե Բեռնված է, բայց կա Սխալ կամ Կատեգորիաներ չկան */}
                                                                {!isLoadingCategories && (isErrorCategories || !categories || categories.length === 0) && (
                                                                    <SelectItem key="empty-error-status" value="empty" disabled>
                                                                        {isErrorCategories ? "Կատեգորիաների բեռնման սխալ" : "Կատեգորիաներ չկան"}
                                                                    </SelectItem>
                                                                )}

                                                                {/* 3. Եթե Տվյալները կան և բեռնումը ավարտված է, ցուցադրել դրանք */}
                                                                {!isLoadingCategories && categories && categories.length > 0 && !isErrorCategories && (
                                                                    categories.map(cat => ( 
                                                                        <SelectItem 
                                                                            key={cat.id}
                                                                            value={String(cat.id)} 
                                                                        >
                                                                            {cat.label} 
                                                                        </SelectItem>
                                                                    ))
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="image_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Նկարի Հասցե (URL)</FormLabel>
                                                    <FormControl><Input placeholder="http://example.com/image.jpg" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Նկարագրություն</FormLabel>
                                                    <FormControl><Input placeholder="Մանրամասն նկարագրություն" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={addProductMutation.isPending}
                                        >
                                            {addProductMutation.isPending ? 'Ավելացնում...' : 'Ավելացնել Ապրանք'}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    {/* ՏԱԲ 3: Ապրանքների Ցուցակ և Ջնջում */}
                    <TabsContent value="list">
                        <Card className="mt-6">
                            <CardHeader><CardTitle>Ապրանքների Կառավարում</CardTitle></CardHeader>
                            <CardContent>
                                {productsQuery.isLoading && <div className="text-center py-4">Ապրանքները բեռնվում են...</div>}
                                {productsQuery.isError && <div className="text-center py-4 text-red-500">Ապրանքները բեռնել չհաջողվեց</div>}
                                {productsQuery.data && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Անուն</TableHead>
                                                <TableHead>Գին</TableHead>
                                                <TableHead>Կատեգորիա</TableHead>
                                                <TableHead className="text-right">Գործողություն</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {productsQuery.data.map((product) => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium">{product.id}</TableCell>
                                                    <TableCell>{product.name}</TableCell>
                                                    <TableCell>{product.price.toFixed(2)} ֏</TableCell>
                                                    <TableCell>{product.category || 'N/A'}</TableCell> 
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="destructive" 
                                                            size="icon"
                                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                                            disabled={deleteProductMutation.isPending}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

export default Admin;