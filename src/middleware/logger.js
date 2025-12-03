/**
 * Logger middleware
 */

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const getStatusColor = (status) => {
  if (status >= 500) return colors.red;
  if (status >= 400) return colors.yellow;
  if (status >= 300) return colors.cyan;
  if (status >= 200) return colors.green;
  return colors.blue;
};

const getMethodColor = (method) => {
  const colors = {
    GET: "\x1b[36m",    // cyan
    POST: "\x1b[32m",   // green
    PATCH: "\x1b[33m",  // yellow
    PUT: "\x1b[33m",    // yellow
    DELETE: "\x1b[31m", // red
  };
  return colors[method] || "\x1b[0m";
};

/**
 * Request/Response logger middleware
 */
export const logger = (req, res, next) => {
  const start = Date.now();

  // Capture the original res.json function
  const originalJson = res.json;

  // Override res.json to log response
  res.json = function (data) {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const methodColor = getMethodColor(req.method);
    // console.log(req)
    console.log(
      `${methodColor}${req.method}\x1b[0m ${req.originalUrl} ${statusColor}${res.statusCode}\x1b[0m ${duration}ms`
    );

    // Call the original json function
    return originalJson.call(this, data);
  };

  next();
};

export default logger;
