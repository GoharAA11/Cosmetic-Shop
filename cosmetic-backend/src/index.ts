// src/index.ts
import 'dotenv/config'; // Կարդում է .env ֆայլը
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { query } from './db';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import adminRoutes from './routes/admin'

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware-ներ
app.use(cors({
    origin: 'http://localhost:8080', // Փոխարինել ձեր ֆրոնտենդի հոսթով
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json()); // Թույլատրում է սերվերին կարդալ JSON մարմինը

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
// Դուք կավելացնեք նաև /api/admin route-ը ավելի ուշ

app.get('/', (req, res) => {
    res.send('Beauty Shop Backend is Running!');
});

// Սերվերի գործարկում
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database connected to ${process.env.DB_DATABASE}`);
});