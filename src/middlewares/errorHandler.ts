import type { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [message];
    res.status(status).json({ success: false, message, object: null, errors });
}
