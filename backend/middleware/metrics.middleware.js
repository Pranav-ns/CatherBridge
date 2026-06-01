const { httpRequestDurationMicroseconds, httpRequestCount } = require("../utils/metrics");
const logger = require("../utils/logger");

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;
    
    const route = req.route ? req.route.path : req.path;

    httpRequestDurationMicroseconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);

    httpRequestCount
      .labels(req.method, route, res.statusCode)
      .inc();

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: (duration * 1000).toFixed(2),
      userAgent: req.get("user-agent"),
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error(`Failed API Request: ${req.method} ${req.originalUrl}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`API Client Error: ${req.method} ${req.originalUrl}`, logData);
    } else {
      logger.info(`API Request: ${req.method} ${req.originalUrl}`, logData);
    }
  });

  next();
};

module.exports = metricsMiddleware;
