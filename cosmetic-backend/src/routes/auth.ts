// src/routes/auth.ts
import { Router } from 'express';
import { query } from '../db';
import bcrypt from 'bcryptjs';

const router = Router();

// 1. Գրանցում (Auth.tsx -> handleRegister)
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    // Պարզ ստուգումներ
    if (!email || !password) {
        return res.status(400).json({ message: 'Լրացրեք բոլոր դաշտերը' });
    }

    try {
        // ա. Գաղտնաբառի հեշավորում
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        // Բ. Ստուգել ադմինիստրատորի դերը
        const is_admin = email === 'admin@cosmetic.shop';

        // Գ. Ներմուծում Users աղյուսակ
        const result = await query(
            'INSERT INTO Users (email, password_hash, is_admin) VALUES (?, ?, ?)',
            [email, password_hash, is_admin]
        ) as { insertId: number };

        res.status(201).json({ 
            message: 'Հաջող գրանցում', 
            user: { email, is_admin, id: result.insertId } 
        });

    } catch (error: any) {
        // MySQL-ի UNIQUE սխալը (օգտատերը արդեն գոյություն ունի)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Այս էլ․ հասցեն արդեն գրանցված է' });
        }
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Սերվերի սխալ գրանցման ժամանակ' });
    }
});

// 2. Մուտք (Auth.tsx -> handleLogin)
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // ա. Գտնել օգտատիրոջը բազայում
        const users = await query('SELECT * FROM Users WHERE email = ?', [email]) as any[];

        if (users.length === 0) {
            return res.status(401).json({ message: 'Անվավեր էլ․ հասցե կամ գաղտնաբառ' });
        }
        
        const user = users[0];

        // Բ. Համեմատել գաղտնաբառերը
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Անվավեր էլ․ հասցե կամ գաղտնաբառ' });
        }

        // Գ. Հաջող մուտք
        // Իրական նախագծում այստեղ կլինի JWT token-ի գեներացիա, բայց պարզության համար՝
        res.json({
            message: 'Հաջողությամբ մուտք եք գործել',
            user: { user_id: user.user_id, email: user.email, isAdmin: user.is_admin }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Սերվերի սխալ մուտքի ժամանակ' });
    }
});

export default router;