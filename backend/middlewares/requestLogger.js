const { logApp } = require("../utils/logger");

const requestLogger = (req, res, next) => {
  logApp("Request received", req);
  next();
};

module.exports = requestLogger;
