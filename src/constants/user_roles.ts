// constants.ts
export const USER_ROLES = {
  ADMIN: "admin",
  VENDOR: "vendor",
  DELIVERY: "delivery",
  NORMAL: "normal",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
