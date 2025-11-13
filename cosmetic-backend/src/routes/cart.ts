// src/routes/cart.ts
import { Router } from 'express';
import { query,pool } from '../db';

const router = Router();

// Պատվերի մարմնի տեսակը (ֆրոնտենդից ստացված)
interface CartItem {
    id: number;
    price: number;
    quantity: number;
}

interface CheckoutBody {
    userId: number; // Օգտատիրոջ ID-ն, որը գալիս է ֆրոնտենդից կամ token-ից
    items: CartItem[];
    // ԱՎԵԼԱՑՎԱԾ ԴԱՇՏԵՐԸ ՖՐՈՆՏԷՆԴԻՑ
    recipientName: string;  // Նոր
    phoneNumber: string;    // Նոր
    deliveryAddress: string; // Նոր
    paymentMethod: 'Card' | 'Cash'; // Նոր
}
// 1. Ստանալ զամբյուղի բովանդակությունը (Fetch Cart Items)
// GET /api/cart/:userId  <-- Այս route-ը բացակայում էր
router.get('/:userId', async (req, res) => {
    // Ֆրոնտենդը կանչում էր /api/cart/4, որտեղ 4-ը userId-ն է
    const userId = req.params.userId;
    try {
        const cartItems = await query(`
            SELECT 
                ci.product_id AS id, 
                p.name, 
                p.price, 
                p.image_url AS image, 
                ci.quantity 
            FROM Cart_Items ci
            JOIN Products p ON ci.product_id = p.product_id
            WHERE ci.user_id = ?
        `, [userId]) as any[];

        // ՈՒՂՂՈՒՄԸ ԱՅՍՏԵՂ Է. Փոխակերպել գները թվի
        const transformedItems = cartItems.map(item => ({
            ...item,
            // Փոխակերպել գինը Number-ի, որպեսզի toFixed() աշխատի
            price: Number(item.price), 
        }));

        res.json(transformedItems);
    } catch (error) {
        console.error("Error fetching cart for user:", userId, error);
        // Հիշեցում: Եթե աղյուսակը չկա, կստանաք 500 սխալ
        res.status(500).json({ message: "Զամբյուղի տվյալները բեռնելիս սխալ տեղի ունեցավ" });
    }
});


// 2. Ավելացնել ապրանք զամբյուղ (Add to Cart)
// POST /api/cart/add  <-- Այս route-ը բացակայում էր
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: "Անվավեր տվյալներ (userId, productId, կամ quantity)" });
    }
    
    try {
        // ա. Փնտրել՝ արդյոք ապրանքն արդեն զամբյուղում կա
        const existingItem = await query('SELECT * FROM Cart_Items WHERE user_id = ? AND product_id = ?', [userId, productId]) as any[];

        if (existingItem.length > 0) {
            // Եթե կա, թարմացնել քանակը
            await query('UPDATE Cart_Items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, userId, productId]);
        } else {
            // Եթե չկա, ավելացնել նոր տող
            await query('INSERT INTO Cart_Items (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);
        }
        
        res.json({ message: 'Ապրանքը հաջողությամբ ավելացվեց զամբյուղ' });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Զամբյուղ ավելացնելիս սխալ տեղի ունեցավ" });
    }
});



// 3. Հեռացնել ապրանք զամբյուղից կամ նվազեցնել քանակը (Remove/Decrease Quantity)
// POST /api/cart/remove
router.delete('/remove/:productId', async (req, res) => {

    console.log("Request Body:", req.body);

    const productId = req.params.productId;
    
    // Այս ռոութը կօգտագործենք մեկ ապրանքի քանակը նվազեցնելու 
    // կամ ամբողջությամբ հեռացնելու համար (եթե քանակը 0 է դառնում)
    const { userId } = req.body;
    
    if (!userId || !productId) {
        return res.status(400).json({ message: "Անվավեր տվյալներ (userId կամ productId)" });
    }
    
    try {
        const result = await query('DELETE FROM Cart_Items WHERE user_id = ? AND product_id = ?', [userId, productId]) as any;
        if (result.affectedRows === 0) {
            // Եթե ապրանքը զամբյուղում չկա
            return res.status(404).json({ message: "Ապրանքը չի գտնվել զամբյուղում" });
        }


           res.json({ message: 'Ապրանքը հաջողությամբ հեռացվեց զամբյուղից' });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Զամբյուղից հեռացնելիս սխալ տեղի ունեցավ" });
    }
});

// Գործողություն: Պատվերի Ձևակերպում (Checkout)
// POST /api/cart/checkout
router.post('/checkout', async (req, res) => {
    const { 
        userId,
         items,
        recipientName, 
        phoneNumber, 
        deliveryAddress, 
        paymentMethod} = req.body as CheckoutBody;
    
    if (!userId || !items || items.length === 0 || !recipientName || !deliveryAddress || !phoneNumber) {
        return res.status(400).json({ message: "Անվավեր տվյալներ (օգտատեր կամ զամբյուղի պարունակություն)" });
    }

    // Հաշվել ընդհանուր գումարը
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const connection = await pool.getConnection();


    try {
        await connection.beginTransaction();

        // 1. Ստեղծել նոր պատվեր Orders աղյուսակում
        const orderResult = await connection.execute(
            `INSERT INTO Orders (
                user_id, 
                total_amount, 
                status, 
                recipient_name, 
                phone_number, 
                delivery_address, 
                payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
           
            [
             userId,
            totalAmount,
            'Pending',
            recipientName, 
            phoneNumber, 
            deliveryAddress, 
            paymentMethod]
        ) as any;

        const orderId = orderResult[0].insertId;

        // 2. Ավելացնել ապրանքները Order_Items աղյուսակում
        for (const item of items) {
            await connection.execute(
                'INSERT INTO Order_Items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        // 3. Ամենակարևոր քայլերից մեկը: Դատարկել զամբյուղը Checkout-ից հետո
        await connection.execute(
            'DELETE FROM Cart_Items WHERE user_id = ?',
            [userId]
        );

        // 3. Հաստատել Transaction-ը
        await connection.commit();
        
        res.status(201).json({ 
            message: 'Պատվերը հաջողությամբ ձևակերպված է', 
            orderId 
        });

    } catch (error) {
        // Եթե սխալ է, չեղարկել բոլոր գործողությունները
        await connection.rollback();
        console.error("Checkout error:", error);
        res.status(500).json({ message: "Պատվերը ձևակերպելիս սխալ տեղի ունեցավ" });
    } finally {
        connection.release();
    }
});

export default router;