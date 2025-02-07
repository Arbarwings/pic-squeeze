import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import ImageDisplay from "@/components/ImageDisplay";

describe("ImageDisplay Component", () => {
  const originalImage = {
    file: new File([""], "test-image.jpg", { type: "image/jpeg" }),
    src: "/original-image.jpg",
  };
  const compressedImage = { src: "/compressed-image.jpg", size: 1024 };

  it("renders with both original and compressed images", () => {
    const { unmount } = render(
      <ImageDisplay
        originalImage={originalImage}
        compressedImage={compressedImage}
      />,
    );

    expect(screen.getByText("Original")).toBeTruthy();
    expect(screen.getByText("Compressed")).toBeTruthy();

    const originalImageElement = screen.getByAltText("Original image");
    expect(originalImageElement).toBeTruthy();
    expect(screen.getByText("0 Bytes")).toBeTruthy();

    const compressedImageElement = screen.getByAltText("Compressed image");
    expect(compressedImageElement).toBeTruthy();
    expect(screen.getByText("1 KB")).toBeTruthy();
    unmount();
  });
});
