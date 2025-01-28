// import { createClient } from 'redis';

// const redisClient = createClient({
//   url: 'redis://localhost:6379',
// });

// redisClient.on('error', err => console.error('Redis Client Error', err));

// (async () => {
//   await redisClient.connect();
// })();

// export async function getFromCache(key: string) {
//   try {
//     const data = await redisClient.get(key);
//     return data ? JSON.parse(data) : null;
//   } catch (err) {
//     console.error('Error getting data from Redis', err);
//     return null;
//   }
// }

// export async function setToCache(key: string, value: any, expiry: number = 3600) {
//   try {
//     await redisClient.set(key, JSON.stringify(value), {
//       EX: expiry,
//     });
//   } catch (err) {
//     console.error('Error setting data to Redis', err);
//   }
// }
