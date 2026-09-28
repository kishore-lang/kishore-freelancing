const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn('[Redis] REDIS_URL not found in .env. Caching is disabled (graceful fallback to PostgreSQL).');
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('[Redis] Client Error', err));
    redisClient.on('connect', () => console.log('[Redis] Connected to Cloud Redis successfully 🚀'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('[Redis] Connection failed:', error);
    redisClient = null;
    return null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
