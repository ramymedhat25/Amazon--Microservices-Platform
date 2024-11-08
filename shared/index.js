module.exports = {
  middlewares: {
    authMiddleware: require("./middlewares/authMiddleware"),
    errorHandler: require("./middlewares/errorHandler"),
  },
  utils: {
    logger: require("./utils/logger"),
    token: require("./utils/token"),
  },
  config: require("./configs/config"),
};
