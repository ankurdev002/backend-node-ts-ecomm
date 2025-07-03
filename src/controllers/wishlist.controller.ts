import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import {
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProductId,
  getUserWishlist,
  checkIfInWishlist,
  getWishlistCount,
  clearWishlist,
  moveWishlistItemToCart,
} from "../services/wishlist.service";

export const addItemToWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const wishlistItem = await addToWishlist(userId, productId);

    res.status(201).json({
      success: true,
      message: "Item added to wishlist successfully",
      data: wishlistItem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItemFromWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { wishlistItemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await removeFromWishlist(userId, parseInt(wishlistItemId));

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItemByProductId = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await removeFromWishlistByProductId(
      userId,
      parseInt(productId)
    );

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const wishlist = await getUserWishlist(userId, page, limit);

    res.json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkWishlistItem = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await checkIfInWishlist(userId, parseInt(productId));

    res.json({
      success: true,
      message: "Wishlist check completed",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlistItemCount = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await getWishlistCount(userId);

    res.json({
      success: true,
      message: "Wishlist count retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearUserWishlist = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await clearWishlist(userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const moveToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { wishlistItemId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await moveWishlistItemToCart(
      userId,
      parseInt(wishlistItemId)
    );

    res.json({
      success: true,
      message: result.message,
      data: { productId: result.productId },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
