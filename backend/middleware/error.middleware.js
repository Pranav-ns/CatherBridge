const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(`Backend Exception: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
    body: req.body, 
  });

  const statusCode = err.status || 500;
  const message = err.message || "Server Error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
