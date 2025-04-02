const redisClient = require("../config/redis");

// Middleware to cache responses in Redis
module.exports =
  (keyPrefix, expiry = 300) =>
  async (req, res, next) => {
    const key = `${keyPrefix}:${JSON.stringify(req.params || req.query)}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      res.sendResponse = res.json;
      res.json = async (body) => {
        await redisClient.setEx(key, expiry, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (err) {
      console.error("Redis Cache Error:", err);
      next();
    }
  };
