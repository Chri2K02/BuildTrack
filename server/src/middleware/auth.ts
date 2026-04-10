import { verifyToken } from "@clerk/backend";
import { Request, Response, NextFunction } from "express";

// Extend the Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get the token from the Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No authorization token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    req.userId = payload.sub; // "sub" is the Clerk user ID
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
