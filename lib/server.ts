import { env } from "@/env";
import { createHash } from "crypto";
import Redis from "ioredis";
import { NextRequest } from "next/server";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW } from "./constants";

// Use a singleton pattern to ensure only one Redis client is created
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT || "6379"),
      password: env.REDIS_PASSWORD,
    });
  }
  return redis;
}

export const getRequestIP = (request: NextRequest): string => {
  // Method 1: Using request.ip (Vercel-specific)
  const ipFromRequestObject =
    "ip" in request ? (request.ip as string) : undefined;

  // Method 2: Using X-Forwarded-For header
  const ipFromForwardedHeader = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0];

  // Method 3: Using X-Real-IP header
  const ipFromRealIPHeader = request.headers.get("x-real-ip");

  // Prioritize X-Real-IP, then X-Forwarded-For, fallback to undefined
  const remoteAddress = ipFromRealIPHeader ?? ipFromForwardedHeader;

  return ipFromRequestObject ?? remoteAddress ?? "anonymous";
};

export const hashIPAddress = (ip: string) => {
  const hash = createHash("sha256");
  hash.update(ip + env.IP_HASH_SALT);
  return hash.digest("hex");
};

export async function rateLimit(identifier: string): Promise<boolean> {
  const key = `rate_limit:${identifier}`;
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  const script = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local maxRequests = tonumber(ARGV[3])

    redis.call('ZREMRANGEBYSCORE', key, '-inf', now - window)
    local count = redis.call('ZCARD', key)

    if count < maxRequests then
      redis.call('ZADD', key, now, now)
      return 1
    else
      return 0
    end
  `;

  try {
    const client = getRedisClient();
    const result = await client.eval(
      script,
      1,
      key,
      now,
      RATE_LIMIT_WINDOW,
      RATE_LIMIT_MAX_REQUESTS,
    );
    return result === 1;
  } catch (error) {
    console.error("Redis error:", error);
    return false;
  }
}
