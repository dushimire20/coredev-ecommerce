import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateOrder } from '../utils/validators.js';

const prisma = new PrismaClient();

// POST /orders
// body: { items: [ { productId: string, quantity: }], description}


export const placeOrder = async (req: Request, res: Response) => {
    const { error } = validateOrder(req.body);
    if (error)
        return res
        .status(400)
        .json( { success: false, message: error.details[0].message, errors: [error.details[0].message] });


    const { items, description} = req.body;
    const user = (req as any).user;

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
        let totalPrice = 0;
        const orderItems: any[] = [];

        for (const i of items) {
            const product = await tx.product.findUnique({ where: { id: i.productId } });
            if (!product)
                throw new error(`Product ${i.productId} not found`);
            if (product.stock < i.quantity)
                throw new Error(`Not enough stock for product ${product.name}`);

            const itemTotal = product.price * i.quantity;
            totalPrice += itemTotal;

            // reduce stock
            await tx.product.update({
                where: { id: i.productId },
                data: { stock: product.stock - i.quantity },
            });

            orderItems.push({
                productId: i.productId,
                quantity: i.quantity,
                priceAtPurchase: product.price,
            });

        }

        const order = await tx.order.create({
            data: {
                userId: user.userId,
                description,
                totalPrice,
                items: {
                    create: orderItems,
                },
            },

            include: {
                items: true,
            },

    });
        return order;
    });

    return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        object: result,
        errors: null,

    });
};

// GET /orders
//Authenticated user sees only their orders

export const getUserOrders = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const orders = await prisma.order.findMany({
        where: { userId: user.userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
        success: true,
        message: 'User orders retrieved',
        object: orders,
        errors: null,
    });
};

// GET /orders/all
// Admin only: get all orders

export const getAllOrders = async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { id: true, username: true, email: true } },
            items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
    });


    return res.status(200).json({
        success: true,
        message: 'All orders retrieved',
        object: orders,
        errors: null,
    });
};
