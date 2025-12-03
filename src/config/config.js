/**
 * Application Configuration
 */

export const config = {
  // Server
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // API Configuration
  API_VERSION: "v1",
  API_PREFIX: "/api",

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // JWT (for future use)
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // Validation
  PASSWORD_MIN_LENGTH: 6,
  BIO_MAX_LENGTH: 500,
  GRADUATION_YEAR_MIN: 2020,
  GRADUATION_YEAR_MAX: 2100,

  // API Keys
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // Email Configuration
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_USER_PASSWORD,
  MAIL_EMAIL: process.env.MAIL_USER_EMAIL,

  // Profile Completeness Fields
  PROFILE_COMPLETENESS_FIELDS: [
    "bio",
    "avatar",
    "graduation_year",
    "twitter_username",
    "github_username",
    "linkedin_username",
    "leetcode_username",
    "codeforces_username",
    "codechef_username",
    "gfg_username",
  ],
};

/**
 * Validate required configuration
 */
export const validateConfig = () => {
  const required = ["MONGODB_URI"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

export default config;
