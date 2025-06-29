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
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All address routes require authentication
router.use(authenticateUser);

// @route POST /api/addresses
// @desc Create a new address
// @access Private
router.post(ENDPOINTS.ADDRESS_ROUTE.CREATE_ADDRESS, createUserAddress);

// @route GET /api/addresses
// @desc Get all user addresses (with optional type filter)
// @access Private
router.get(ENDPOINTS.ADDRESS_ROUTE.GET_ADDRESSES, getAddresses);

// @route GET /api/addresses/default/:type
// @desc Get default address by type (billing/shipping)
// @access Private
router.get(ENDPOINTS.ADDRESS_ROUTE.GET_DEFAULT_ADDRESS, getDefaultUserAddress);

// @route GET /api/addresses/:addressId
// @desc Get specific address
// @access Private
router.get(ENDPOINTS.ADDRESS_ROUTE.GET_ADDRESS_BY_ID, getAddress);

// @route PUT /api/addresses/:addressId
// @desc Update address
// @access Private
router.put(ENDPOINTS.ADDRESS_ROUTE.UPDATE_ADDRESS, updateUserAddress);

// @route PUT /api/addresses/:addressId/default
// @desc Set address as default
// @access Private
router.put(ENDPOINTS.ADDRESS_ROUTE.SET_ADDRESS_AS_DEFAULT, setAddressAsDefault);

// @route DELETE /api/addresses/:addressId
// @desc Delete address
// @access Private
router.delete(ENDPOINTS.ADDRESS_ROUTE.DELETE_ADDRESS, deleteUserAddress);

export default router;
