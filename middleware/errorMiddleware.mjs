import logger from "../utils/logger.mjs";
export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ message: "Internal Server Error" });
};
