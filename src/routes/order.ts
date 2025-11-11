import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";
import { placeOrder, getUserOrders, getAllOrders} from "../controllers/orderController.js";

const router = Router();

// Place an order (Authenticated users)
router.post('/', authenticate, placeOrder);
// Get orders for the authenticated user
router.get('/', authenticate, getUserOrders);


// Get all orders (Admin only)
router.get('/all', authenticate, authorizeAdmin, getAllOrders);

export default router;