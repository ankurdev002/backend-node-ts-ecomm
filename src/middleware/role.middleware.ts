import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/common.type";
import { USER_ROLES } from "../constants/user_roles";

// Define route-based restrictions
const routeRestrictions: Record<string, string[]> = {
  "/api/products/all-list": [USER_ROLES.ADMIN], // Only "admin" can access this route
  // specify more if needed left side for route and right side for roles
};

// after verification check which routes user can access based on the roles...
export const authorizeRole = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    if (!req.user || !roles.includes(req.user.userType)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }
    // Check if the requested route has additional role restrictions
    const restrictedRoles = routeRestrictions[req.originalUrl];

    if (restrictedRoles && !restrictedRoles.includes(req.user.userType)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Access denied for this route" });
    }
    next();
  };
};
