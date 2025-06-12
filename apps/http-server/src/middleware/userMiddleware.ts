import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Augment the Express Request interface to include `userId`
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export default function userMiddleware(req: Request, res: Response, next: NextFunction) {
  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const token = req.headers.authorization;
  if(!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "secret") as JwtPayload;

    req.userId = decoded.id as string;
    next();
  } catch (e) {
    res.status(400).json({ error: "Invalid token" });
  }
}
