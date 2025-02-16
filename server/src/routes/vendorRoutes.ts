import express, { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prismaClient';
import { verifyToken } from '../middlewares/authMiddleware'; // Ensure correct import path
import { JWTPayload } from '../types/payload'; // Import the correct JWTPayload type

// Extend Express Request to include `user` as JWTPayload
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;  // This will be set by the middleware after decoding the token
    }
  }
}

const router = express.Router();

// Middleware to check if the logged-in user is a vendor
const checkVendor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'VENDOR') {
    return res.status(403).json({ message: "Access denied. Only vendors can access this." });
  }
  next();
};

// Get vendor-specific dashboard data
router.get("/dashboard", verifyToken, checkVendor, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const vendorData = await prisma.vendor.findUnique({
      where: { userId: req.user.userId }, // Using `userId`, ensure it's correct
      include: { products: true, orders: true },
    });

    if (!vendorData) {
      return res.status(404).json({ message: "Vendor data not found." });
    }

    res.status(200).json(vendorData);
  } catch (error) {
    console.error("Error fetching vendor dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new product (for vendor only)
router.post("/create-product", verifyToken, checkVendor, async (req: Request, res: Response) => {
  const { name, price, description, imageUrl } = req.body;

  if (!name || !price || !description || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields: name, price, description, imageUrl" });
  }

  if (typeof price !== 'number') {
    return res.status(400).json({ message: "Price must be a number" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        description,
        vendorId: req.user.userId,
        imageUrl,
      },
    });

    res.status(201).json({ message: "Product created successfully", newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

export default router;
