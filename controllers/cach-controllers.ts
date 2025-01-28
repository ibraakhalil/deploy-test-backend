// import { redisClient } from '../config/redis';
// import { Request, Response } from 'express';

// // Cache middleware to check Redis for cached data
// export const getCachedData = async (req: Request, res: Response, next: Function) => {
//   const key = 'some-key'; // Customize based on your use case

//   try {
//     const cache = await redisClient.get(key);

//     if (cache) {
//       console.log('Cache hit');
//       return res.json(JSON.parse(cache));
//     }

//     console.log('Cache miss');
//     next(); // Proceed to the next controller logic if no cache found
//   } catch (err) {
//     console.error('Redis Error', err);
//     next();
//   }
// };

// // Store data in Redis cache (Example usage)
// export const setDataInCache = async (key: string, data: any) => {
//   await redisClient.set(key, JSON.stringify(data), { EX: 3600 }); // Cache for 1 hour
// };
