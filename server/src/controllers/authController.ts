import { Request, Response } from "express";
import prisma from "../prisma/prismaClient"; // Adjust to match your import structure
import { JWTPayload } from "../types/payload"; // Ensure the correct path

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    // Check if req.user is defined
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.userId;  // Access 'userId' from decoded token

    // Find user from the database using userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user profile
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during profile retrieval" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email, role } = req.body;

  // Ensure req.user is defined and access userId
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.userId; // Access 'userId' from decoded token

  try {
    // Update user details in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
    });

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during profile update" });
  }
};

// Delete user profile
export const deleteUserProfile = async (req: Request, res: Response) => {
  // Ensure req.user is defined and access userId
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.userId; // Access 'userId' from decoded token

  try {
    // Delete user from the database
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during profile deletion" });
  }
};
