import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

// check user is authorized or not via verifying with token jwt...
const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ error: "Unauthorized: No token provided" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// Define route-based restrictions
const routeRestrictions: Record<string, string[]> = {
  "/api/products/all-list": ["admin"], // Only "admin" can access this route
  // specify more if needed left side for route and right side for roles
};

// after verification check which routes user can access based on the roles...
const authorizeRole = (roles: string[]) => {
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

export { authenticateUser, authorizeRole };
