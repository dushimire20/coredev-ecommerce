import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPlayload {
  userId: string;
  username: string;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header)
    return res
      .status(401)
      .json({
        success: false,
        message: "No token provided",
        errors: ["No token provided"],
      });

  const [, token] = header.split(" ");
  if (!token)
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid token format",
        errors: ["Invalid token format"],
      });
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as unknown as AuthPlayload;
    //attach payload to request object
    (req as any).user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid token",
        errors: ["Invalid token"],
      });
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as AuthPlayload;
  if (!user)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errors: ["Unauthorized"],
      });

  if (user.role !== "Admin")
    return res
      .status(403)
      .json({
        success: false,
        message: "Forbidden: Admins only",
        errors: ["Forbidden: Admins only"],
      });

  next();
};
