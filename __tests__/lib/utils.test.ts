import { describe, expect, it } from "vitest";
import { cn, createFileSchema, formatBytes } from "@/lib/utils";

describe("Utility Functions Tests", () => {
  it("cn: should combine class names correctly", () => {
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
    expect(cn("class1", undefined, "class3")).toBe("class1 class3");
    expect(cn("class1", null, "class3")).toBe("class1 class3");
  });

  it("formatBytes: should format bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
  });

  describe("createFileSchema", () => {
    const maxSize = 1024 * 1024; // 1MB
    const acceptedTypes = ["image/png", "image/jpeg"];
    const schema = createFileSchema(maxSize, acceptedTypes);

    it("should pass validation for a valid file", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 500 * 1024 }); // 500KB
      const result = await schema.safeParseAsync({ image: file });
      expect(result.success).toBe(true);
    });

    it("should fail validation for a file exceeding maxSize", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      Object.defineProperty(file, "size", { value: 2 * 1024 * 1024 }); // 2MB
      const result = await schema.safeParseAsync({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "File size must be less than 1MB",
        );
      }
    });

    it("should fail validation for a file with an invalid type", async () => {
      const file = new File([""], "test.txt", { type: "text/plain" });
      Object.defineProperty(file, "size", { value: 500 * 1024 }); // 500KB
      const result = await schema.safeParseAsync({ image: file });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Only PNG, JPEG files are accepted",
        );
      }
    });

    it("should handle the case where file.type is undefined", async () => {
      const file = new File([""], "test.txt");
      Object.defineProperty(file, "size", { value: 500 * 1024 }); // 500KB
      Object.defineProperty(file, "type", { value: undefined });

      const result = await schema.safeParseAsync({ image: file });
      expect(result.success).toBe(false);
    });
  });
});
