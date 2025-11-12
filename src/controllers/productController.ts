import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateProduct } from "../utils/validators";

const prisma = new PrismaClient();

// GET /products
// Retrieve a paginated list of products with optional search query
//Query params: ?page=1&limit=10&search=term

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "10");
  const search = (req.query.search as string) || "";

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    object: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      products,
    },
    errors: null,
  });
};

// GET /products/:id
// Retrieve a single product by ID

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product)
    return res
      .status(404)
      .json({
        success: false,
        message: "Product not found",
        object: null,
        errors: ["Product not found"],
      });

  return res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    object: product,
    errors: null,
  });
};

// POST /products
// POST /products (Admin only)

export const createProduct = async (req: Request, res: Response) => {
  const { error } = validateProduct(req.body);
  if (error)
    return res
      .status(400)
      .json({
        success: false,
        message: error.details[0].message,
        errors: [error.details[0].message],
      });

  const { name, description, price, stock, category } = req.body;
  const admin = (req as any).user;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      userId: admin?.userId,
    },
  });

  return res
    .status(201)
    .json({
      success: true,
      message: "Product created successfully",
      object: product,
      errors: null,
    });
};

// PUT /products/:id (Admin only)

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing)
    return res
      .status(404)
      .json({
        success: false,
        message: "Product not found",
        object: null,
        errors: ["Product not found"],
      });

  const data: any = {};
  const fields = ["name", "description", "price", "stock", "category"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) data[f] = req.body[f];
  });

  const updated = await prisma.product.update({ where: { id }, data });

  return res
    .status(200)
    .json({
      success: true,
      message: "Product updated successfully",
      object: updated,
      errors: null,
    });
};

// DELETE product
// DELETE /products/:id (Admin only)

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing)
    return res
      .status(404)
      .json({
        success: false,
        message: "Product not found",
        object: null,
        errors: ["Product not found"],
      });

  await prisma.product.delete({ where: { id } });

  return res
    .status(200)
    .json({
      success: true,
      message: "Product deleted successfully",
      object: null,
      errors: null,
    });
};
