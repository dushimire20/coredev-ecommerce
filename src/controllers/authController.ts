import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateRegister, validateLogin } from "../utils/validators.js";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details?.[0]?.message || 'Validation error', errors: [error.details?.[0]?.message || 'Validation error'] });

    const { username, email, password } = req.body;

    // check if user already exists

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return res.status(400).json({ success: false, message: "Email already in use", errors: ["Email already in use"] });

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) return res.status(400).json({ success: false, message: "Username already taken", errors: ["Username already taken"] });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashed,
            role: "User",
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            
        }
    });

    return res.status(201).json({ success: true, message: "User registered successfully", object: user, errors: null });
};



export const login = async (req: Request, res: Response) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details?.[0]?.message || 'Validation error', errors: [error.details?.[0]?.message || 'Validation error']});
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials", errors: ["Invalid credentials"]});

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials", errors: ["Invalid credentials"]});

    const payload = { userId: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.status(200).json({ success: true, message: "Login successful", object: { token }, errors: null });
};

