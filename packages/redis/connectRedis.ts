const redis = require('redis');

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,  
});

redisClient.on('connect', function () {
  console.log('Redis connected');
});
