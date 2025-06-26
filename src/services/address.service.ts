import Address from "../models/address.model";
import { AddressType } from "../types/common.type";

export const createAddress = async (addressData: any): Promise<Address> => {
  const address = await Address.create(addressData);
  return address;
};

export const getUserAddresses = async (
  userId: number,
  type?: "billing" | "shipping"
): Promise<Address[]> => {
  const whereClause: any = { userId };
  if (type) {
    whereClause.type = type;
  }

  return await Address.findAll({
    where: whereClause,
    order: [
      ["isDefault", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
};

export const getAddressById = async (
  addressId: number,
  userId: number
): Promise<Address> => {
  const address = await Address.findOne({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};

export const updateAddress = async (
  addressId: number,
  userId: number,
  updateData: any
): Promise<Address> => {
  const address = await getAddressById(addressId, userId);

  await address.update(updateData);
  return address;
};

export const deleteAddress = async (
  addressId: number,
  userId: number
): Promise<{ message: string }> => {
  const address = await getAddressById(addressId, userId);

  await address.destroy();
  return { message: "Address deleted successfully" };
};

export const setDefaultAddress = async (
  addressId: number,
  userId: number
): Promise<Address> => {
  const address = await getAddressById(addressId, userId);

  // Remove default from other addresses of the same type
  await Address.update(
    { isDefault: false },
    { where: { userId, type: address.type } }
  );

  // Set this address as default
  await address.update({ isDefault: true });
  return address;
};

export const getDefaultAddress = async (
  userId: number,
  type: "billing" | "shipping"
): Promise<Address | null> => {
  return await Address.findOne({
    where: { userId, type, isDefault: true },
  });
};
