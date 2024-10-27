exports.sendResponse = (res, statusCode, message, data = null, error = null) => {
  res.status(statusCode).json({ message, data, error });
};
