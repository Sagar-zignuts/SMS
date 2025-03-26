const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379"
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis  Connected successfully');
  } catch (err) {
    console.error('Redis connection or test error:', err);
  }
})();

module.exports =  redisClient ;
