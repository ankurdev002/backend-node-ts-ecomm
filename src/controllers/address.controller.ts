import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getDefaultAddress,
} from "../services/address.service";

export const createUserAddress = async (
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

    const addressData = {
      userId,
      ...req.body,
    };

    const address = await createAddress(addressData);

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAddresses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { type } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const addresses = await getUserAddresses(
      userId,
      type as "billing" | "shipping"
    );

    res.json({
      success: true,
      message: "Addresses retrieved successfully",
      data: addresses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const address = await getAddressById(parseInt(addressId), userId);

    res.json({
      success: true,
      message: "Address retrieved successfully",
      data: address,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const address = await updateAddress(parseInt(addressId), userId, req.body);

    res.json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUserAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await deleteAddress(parseInt(addressId), userId);

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

export const setAddressAsDefault = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const address = await setDefaultAddress(parseInt(addressId), userId);

    res.json({
      success: true,
      message: "Default address set successfully",
      data: address,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDefaultUserAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { type } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const address = await getDefaultAddress(
      userId,
      type as "billing" | "shipping"
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "No default address found",
      });
    }

    res.json({
      success: true,
      message: "Default address retrieved successfully",
      data: address,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
