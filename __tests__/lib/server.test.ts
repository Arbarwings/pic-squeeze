import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { getRequestIP, hashIPAddress } from "@/lib/server";

// Mock Redis
vi.mock("ioredis", () => {
  const MockRedis = {
    eval: vi.fn(),
    quit: vi.fn(),
  };
  return {
    default: vi.fn(() => MockRedis),
  };
});

// Mock environment variables
vi.mock("@/env", () => ({
  env: {
    REDIS_HOST: "localhost",
    REDIS_PORT: "6379",
    REDIS_PASSWORD: "password",
    IP_HASH_SALT: "test_salt",
  },
}));

describe("Server Utility Functions Tests", () => {
  describe("getRequestIP", () => {
    it("should return 'anonymous' when no IP is found in headers or request object", () => {
      const request = new NextRequest("http://localhost");
      const ip = getRequestIP(request);
      expect(ip).toBe("anonymous");
    });

    it("should return IP from request.ip if available", () => {
      const request = new NextRequest("http://localhost");
      // @ts-expect-error (ip is not a property of NextRequest)
      request.ip = "127.0.0.1";
      const ip = getRequestIP(request);
      expect(ip).toBe("127.0.0.1");
    });

    it("should return IP from x-real-ip header if available", () => {
      const request = new NextRequest("http://localhost", {
        headers: { "x-real-ip": "192.168.1.1" },
      });
      const ip = getRequestIP(request);
      expect(ip).toBe("192.168.1.1");
    });

    it("should return IP from x-forwarded-for header if available", () => {
      const request = new NextRequest("http://localhost", {
        headers: { "x-forwarded-for": "10.0.0.1, 172.16.0.1" },
      });
      const ip = getRequestIP(request);
      expect(ip).toBe("10.0.0.1");
    });

    it("should prioritize x-real-ip over x-forwarded-for and request.ip", () => {
      const request = new NextRequest("http://localhost", {
        headers: { "x-forwarded-for": "10.0.0.1", "x-real-ip": "192.168.1.1" },
      });
      const ip = getRequestIP(request);
      expect(ip).toBe("192.168.1.1");
    });
  });

  describe("hashIPAddress", () => {
    it("should return a hashed IP address", () => {
      const ip = "127.0.0.1";
      const hashedIp = hashIPAddress(ip);
      expect(hashedIp).toBeTypeOf("string");
      expect(hashedIp).not.toBe(ip);
    });

    it("should return the same hash for the same IP address", () => {
      const ip = "127.0.0.1";
      const hashedIp1 = hashIPAddress(ip);
      const hashedIp2 = hashIPAddress(ip);
      expect(hashedIp1).toBe(hashedIp2);
    });
  });
});
