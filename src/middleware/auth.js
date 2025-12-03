import { verifyToken, extractTokenFromHeader } from "../utils/jwt.js";

/**
 * Authentication Middleware
 * Validates JWT token from Authorization header on incoming requests
 * Attaches user data to req.user if token is valid
 * Returns 401 Unauthorized if token is missing, invalid, or expired
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing. Please provide a valid token.",
        statusCode: 401,
      });
    }

    // Extract token from header (format: "Bearer <token>")
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid Authorization header format. Use 'Bearer <token>'.",
        statusCode: 401,
      });
    }

    // Verify token and get user data
    const decoded = verifyToken(token);

    // Attach user data to request object for use in controllers
    req.user = decoded;
    req.userId = decoded._id;

    // Continue to next middleware/controller
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
        statusCode: 401,
        error: "TokenExpiredError",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Authentication failed.",
        statusCode: 401,
        error: "JsonWebTokenError",
      });
    }

    // General authentication error
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Please check your token.",
      statusCode: 401,
      error: error.message,
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attempts to authenticate user but doesn't block request if token is missing/invalid
 * Useful for endpoints that are accessible by both authenticated and unauthenticated users
 */
export async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);

      if (token) {
        const decoded = verifyToken(token);
        req.user = decoded;
        req.userId = decoded._id;
      }
    }

    // Always proceed to next middleware, even if auth fails
    next();
  } catch (error) {
    // Silently fail authentication for optional middleware
    // User will be treated as unauthenticated
    next();
  }
}

export default authMiddleware;
