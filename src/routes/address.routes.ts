import { Router } from "express";
import {
  createUserAddress,
  getAddresses,
  getAddress,
  updateUserAddress,
  deleteUserAddress,
  setAddressAsDefault,
  getDefaultUserAddress,
} from "../controllers/address.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();

// All address routes require authentication
router.use(authenticateUser);

// @route POST /api/addresses
// @desc Create a new address
// @access Private
router.post("/", createUserAddress);

// @route GET /api/addresses
// @desc Get all user addresses (with optional type filter)
// @access Private
router.get("/", getAddresses);

// @route GET /api/addresses/default/:type
// @desc Get default address by type (billing/shipping)
// @access Private
router.get("/default/:type", getDefaultUserAddress);

// @route GET /api/addresses/:addressId
// @desc Get specific address
// @access Private
router.get("/:addressId", getAddress);

// @route PUT /api/addresses/:addressId
// @desc Update address
// @access Private
router.put("/:addressId", updateUserAddress);

// @route PUT /api/addresses/:addressId/default
// @desc Set address as default
// @access Private
router.put("/:addressId/default", setAddressAsDefault);

// @route DELETE /api/addresses/:addressId
// @desc Delete address
// @access Private
router.delete("/:addressId", deleteUserAddress);

export default router;
