import express from 'express';
import "express-async-errors";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import errorHandler from './middlewares/errorHandler.js';


dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Test database connection before starting server
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
