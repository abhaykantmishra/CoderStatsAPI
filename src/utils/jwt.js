import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {Object} data - Data to encode in token (typically user info)
 * @param {string} data._id - User ID
 * @param {string} data.email - User email
 * @returns {string} JWT token
 */
export function generateToken(data) {
  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";
    const expiry = process.env.JWT_EXPIRY || "7d";

    const token = jwt.sign(
      {
        _id: data._id,
        email: data.email,
      },
      secret,
      {
        expiresIn: expiry,
        algorithm: "HS256",
      }
    );

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token data
 */
export function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export function extractTokenFromHeader(authHeader) {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token data or null
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

export default {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  decodeToken,
};