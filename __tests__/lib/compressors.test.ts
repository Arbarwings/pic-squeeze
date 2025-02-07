import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import { compressImage } from "@/lib/compressors";

vi.mock("sharp", () => {
  const mockSharp = {
    resize: vi.fn().mockReturnThis(),
    png: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("compressed image")),
  };

  return {
    default: vi.fn(() => mockSharp),
  };
});

describe("compressImage", () => {
  it("should compress an image and return the compressed buffer, filename, and mime type", async () => {
    const imageFile = new File(["test"], "test.png", { type: "image/png" });
    const quality = 80;

    // Mock the arrayBuffer method
    imageFile.arrayBuffer = vi.fn().mockResolvedValue(Buffer.from("test"));

    const result = await compressImage(imageFile, quality);

    expect(sharp).toHaveBeenCalled();
    expect(result.outputBuffer).toEqual(Buffer.from("compressed image"));
    expect(result.filename).toEqual("compressed-test.png");
    expect(result.mimeType).toEqual("image/png");
  });

  it("should handle JPEG format correctly", async () => {
    const imageFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const quality = 80;

    // Mock the arrayBuffer method
    imageFile.arrayBuffer = vi.fn().mockResolvedValue(Buffer.from("test"));

    const result = await compressImage(imageFile, quality);

    expect(sharp).toHaveBeenCalled();
    expect(result.outputBuffer).toEqual(Buffer.from("compressed image"));
    expect(result.filename).toEqual("compressed-test.jpeg");
    expect(result.mimeType).toEqual("image/jpeg");
  });

  it("should handle WebP format correctly", async () => {
    const imageFile = new File(["test"], "test.webp", { type: "image/webp" });
    const quality = 80;

    // Mock the arrayBuffer method
    imageFile.arrayBuffer = vi.fn().mockResolvedValue(Buffer.from("test"));

    const result = await compressImage(imageFile, quality);

    expect(sharp).toHaveBeenCalled();
    expect(result.outputBuffer).toEqual(Buffer.from("compressed image"));
    expect(result.filename).toEqual("compressed-test.webp");
    expect(result.mimeType).toEqual("image/webp");
  });

  it("should handle errors during compression", async () => {
    const imageFile = new File(["test"], "test.png", { type: "image/png" });
    const quality = 80;

    // Mock sharp to reject
    vi.mocked(sharp).mockImplementationOnce(() => {
      return {
        resize: vi.fn().mockReturnThis(),
        png: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        webp: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockRejectedValue(new Error("Compression failed")),
      } as unknown as sharp.Sharp;
    });

    // Mock the arrayBuffer method
    imageFile.arrayBuffer = vi.fn().mockResolvedValue(Buffer.from("test"));

    await expect(compressImage(imageFile, quality)).rejects.toThrow(
      "Image compression failed",
    );
  });
});
