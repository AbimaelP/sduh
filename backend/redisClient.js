  import { createClient } from "redis";
  import { REDIS_HOST } from "./config.js";

  const redis = createClient({
    url: REDIS_HOST,
  });

  redis.on("error", (err) => console.error("Redis error:", err));
  redis.on("connect", () => console.log("Redis connected!"));

  await redis.connect();
  console.log("Redis está pronto para uso");

  export default redis;
