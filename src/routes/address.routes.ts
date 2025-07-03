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
import { validate } from "../middleware/validate.middleware";
import {
  addressSchema,
  updateAddressSchema,
  addressParamsSchema,
  defaultAddressSchema,
  addressQuerySchema,
} from "../schema/address.schema";
import { ENDPOINTS } from "../constants/endpoint";

const router = Router();

// All address routes require authentication
router.use(authenticateUser);

// @route POST /api/addresses
// @desc Create a new address
// @access Private
router.post(
  ENDPOINTS.ADDRESS_ROUTE.CREATE_ADDRESS,
  validate(addressSchema),
  createUserAddress
);

// @route GET /api/addresses
// @desc Get all user addresses (with optional type filter)
// @access Private
router.get(
  ENDPOINTS.ADDRESS_ROUTE.GET_ADDRESSES,
  validate(addressQuerySchema),
  getAddresses
);

// @route GET /api/addresses/default/:type
// @desc Get default address by type (billing/shipping)
// @access Private
router.get(
  ENDPOINTS.ADDRESS_ROUTE.GET_DEFAULT_ADDRESS,
  validate(defaultAddressSchema),
  getDefaultUserAddress
);

// @route GET /api/addresses/:addressId
// @desc Get specific address
// @access Private
router.get(
  ENDPOINTS.ADDRESS_ROUTE.GET_ADDRESS_BY_ID,
  validate(addressParamsSchema),
  getAddress
);

// @route PUT /api/addresses/:addressId
// @desc Update address
// @access Private
router.put(
  ENDPOINTS.ADDRESS_ROUTE.UPDATE_ADDRESS,
  validate(updateAddressSchema),
  updateUserAddress
);

// @route PUT /api/addresses/:addressId/default
// @desc Set address as default
// @access Private
router.put(
  ENDPOINTS.ADDRESS_ROUTE.SET_ADDRESS_AS_DEFAULT,
  validate(addressParamsSchema),
  setAddressAsDefault
);

// @route DELETE /api/addresses/:addressId
// @desc Delete address
// @access Private
router.delete(
  ENDPOINTS.ADDRESS_ROUTE.DELETE_ADDRESS,
  validate(addressParamsSchema),
  deleteUserAddress
);

export default router;
