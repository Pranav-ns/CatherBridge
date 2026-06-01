const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({
  app: "caterbridge-backend",
  prefix: "node_",
  timeout: 5000,
  register,
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});
register.registerMetric(httpRequestDurationMicroseconds);

const httpRequestCount = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});
register.registerMetric(httpRequestCount);

module.exports = { register, httpRequestDurationMicroseconds, httpRequestCount };
