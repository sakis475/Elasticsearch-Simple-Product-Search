import { RedisClientType, createClient } from "redis";

export let redisClient: RedisClientType;

export async function redisConnection() {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    // Handle redis events
    redisClient
      .on("connect", () => console.log("Redis Connected"))
      .on("error", (err) => console.log("Redis Client Error", err))
      .on("end", () => console.log("Redis connection ended"));
    await redisClient.connect();
    // Handle process termination
    process.on("SIGINT", async () => {
      await gracefulShutdown();
    });
    process.on("SIGTERM", async () => {
      await gracefulShutdown();
    });
  } catch (error) {
    console.error("Redis connection error:", error);
    throw error;
  }
}

export async function gracefulShutdown() {
  console.log("Closing Redis connection...");
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log("Redis connection closed");
    } catch (error) {
      console.error("Error closing Redis connection:", error);
    }
  }
}

/**
 * Set a key-value pair in Redis
 * @param key The key to set
 * @param value The value to set
 * @param ttlSeconds Optional time-to-live in seconds
 * @returns Promise resolving to OK if successful
 */
export async function redisSet(
  key: string,
  value: string,
  ttlSeconds: number = -1
): Promise<string> {
  try {
    return await redisClient.setEx(key, ttlSeconds, value);
  } catch (error) {
    throw error;
  }
}

/**
 * Get a value from Redis by key
 * @param key The key to retrieve
 * @returns Promise resolving to the value or null if not found
 */
export async function redisGet(key: string): Promise<string | null> {
  try {
    return await redisClient.get(key);
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a key from Redis
 * @param key The key to delete
 * @returns Promise resolving to number of keys removed (1 if successful, 0 if key didn't exist)
 */
export async function redisDel(key: string): Promise<number> {
  try {
    return await redisClient.del(key);
  } catch (error) {
    throw error;
  }
}

/**
 * Check if a key exists in Redis
 * @param key The key to check
 * @returns Promise resolving to true if key exists, false otherwise
 */
export async function redisExists(key: string): Promise<boolean> {
  try {
    return (await redisClient.exists(key)) === 1;
  } catch (error) {
    throw error;
  }
}

/**
 * Set a key with a JSON value in Redis
 * @param key The key to set
 * @param value The object to stringify and store
 * @param ttlSeconds Optional time-to-live in seconds
 * @returns Promise resolving to OK if successful
 */
export async function redisSetJSON<T>(
  key: string,
  value: T,
  ttlSeconds?: number
): Promise<string> {
  return await redisSet(key, JSON.stringify(value), ttlSeconds);
}

/**
 * Get and parse a JSON value from Redis
 * @param key The key to retrieve
 * @returns Promise resolving to the parsed object or null if not found
 */
export async function redisGetJSON<T>(key: string): Promise<T | null> {
  const value = await redisGet(key);
  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw error;
  }
}
