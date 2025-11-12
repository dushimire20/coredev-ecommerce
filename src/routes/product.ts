import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController';

import { authenticate, authorizeAdmin } from '../middlewares/auth';

const router = Router();

// public endpoints
router.get('/', getProducts);
router.get('/:id', getProductById);

// protected endpoints (Admin only)
router.post('/', authenticate, authorizeAdmin, createProduct);
router.put('/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;