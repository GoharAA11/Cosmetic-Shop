// src/routes/products.ts
import { Router } from 'express';
import { query } from '../db';

const router = Router();

// 1. Ստանալ բոլոր ապրանքները (կամ ըստ կատեգորիայի)
// GET /api/products?category=skincare
router.get('/', async (req, res) => {
    const { category } = req.query; // category slug-ը Products.tsx-ից

    let sql = `
        SELECT p.product_id AS id, p.name, p.price, p.image_url AS image, p.description, c.slug AS category
        FROM Products p
        JOIN categories c ON p.category_id = c.category_id
    `;
    const params: (string | number)[] = [];

    if (category && category !== 'all') {
        sql += ' WHERE c.slug = ?';
        params.push(category as string);
    }
    
    try {
        const products = await query(sql, params);
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Տվյալները ստանալու սխալ" });
    }
});

// 2. Ստանալ բոլոր կատեգորիաները
// GET /api/products/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await query('SELECT slug AS id, name_am AS label FROM categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Կատեգորիաները ստանալու սխալ" });
    }
});

export default router;