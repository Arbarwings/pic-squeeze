import { NextRequest } from "next/server";
import { createHash } from "crypto";
import { env } from "@/env";

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

  return ipFromRequestObject ?? remoteAddress ?? "127.0.0.1";
};

export const hashIPAddress = (ip: string) => {
  const hash = createHash("sha256");
  hash.update(ip + env.IP_HASH_SALT);
  return hash.digest("hex");
};
