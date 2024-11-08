require("dotenv").config();
const app = require("./app");
const { logger } = require("./utils/logger.js");

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});
