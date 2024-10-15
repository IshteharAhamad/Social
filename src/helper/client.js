// import { Redis } from "ioredis";
// const redis= new Redis();
// // async function gettingName() {
// //     await redis.set("Name:2","qwerty");
// // }
// // gettingName();
// export {redis}
import Redis from "express-redis-cache";
const redisClient=Redis({
    port:6379,
    host:"localhost",
    prefix:"social",
    expire:60*30,
})
export {redisClient}
