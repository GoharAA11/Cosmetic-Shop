// src/routes/admin.ts
import { Router } from 'express';
import { query } from '../db';
// Իրական նախագծում կլինի նաև middleware՝ ստուգելու համար isAdmin-ը

const router = Router();

// Ապրանքի ավելացում (Admin.tsx-ի Product Form-ից)
// POST /api/admin/products
router.post('/products', async (req, res) => {
    // Կատեգորիան գալիս է որպես slug, բայց մեզ պետք է category_id
    const { name, price, category_slug, image_url, description } = req.body; 

    if (!name || !price || !category_slug) {
        return res.status(400).json({ message: "Անվավեր տվյալներ (անուն, գին կամ կատեգորիա)" });
    }

    try {
        // ա. Գտնել category_id-ն ըստ slug-ի
        const categories = await query('SELECT category_id FROM Categories WHERE slug = ?', [category_slug]) as any[];
        if (categories.length === 0) {
             return res.status(400).json({ message: "Անվավեր կատեգորիա" });
        }
        const category_id = categories[0].category_id;

        // Բ. Ավելացնել ապրանքը
        const result = await query(
            'INSERT INTO Products (name, price, category_id, image_url, description) VALUES (?, ?, ?, ?, ?)',
            [name, price, category_id, image_url || null, description || null]
        ) as any;

        res.status(201).json({ message: 'Ապրանքը հաջողությամբ ավելացվեց', productId: result.insertId });
        
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Ապրանքն ավելացնելիս սխալ տեղի ունեցավ" });
    }
});

// Ապրանքի Ջնջում
// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    
    try {
        // Ջնջում Products աղյուսակից
        const result = await query('DELETE FROM Products WHERE product_id = ?', [productId]) as any;

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ապրանքը չի գտնվել' });
        }
        
        res.json({ message: 'Ապրանքը հաջողությամբ ջնջվեց' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Ապրանքը ջնջելիս սխալ տեղի ունեցավ" });
    }
});

// Ադմինի վիճակագրություն (Admin.tsx-ի ցուցադրում)
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        // Ընդհանուր ապրանքների քանակը
        const productsCount = (await query('SELECT COUNT(*) AS count FROM Products')) as any[];
        // Ընդհանուր պատվերների քանակը
        const ordersCount = (await query('SELECT COUNT(*) AS count FROM Orders')) as any[];
        // Ընդհանուր վաճառքի գումարը
        const totalRevenue = (await query('SELECT SUM(total_amount) AS revenue FROM Orders WHERE status = "Completed"')) as any[];

        res.json({
            products: productsCount[0].count,
            orders: ordersCount[0].count,
            revenue: totalRevenue[0].revenue || 0,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Վիճակագրությունը ստանալիս սխալ տեղի ունեցավ" });
    }
});

// Կատեգորիաների ցուցակը ստանալու ռոութ (Admin.tsx-ի Select-ի համար)
// GET /api/admin/categories
router.get('/categories', async (req, res) => {
    try {
        // Ընտրում ենք բոլոր կատեգորիաները
        const categories = await query('SELECT name AS label, slug AS value FROM Categories'); 
        
        // Կարևոր է, որ դուք վերադարձնեք label/value ֆորմատով, որը հեշտ օգտագործելի է
        // React-Select-ի կամ Radix UI Select-ի համար։
        // Եթե ձեր Categories աղյուսակն ունի 'name' և 'slug' սյուներ, սա կաշխատի:
        
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Կատեգորիաները ստանալիս սխալ տեղի ունեցավ" });
    }
});

export default router;