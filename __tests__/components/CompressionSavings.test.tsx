import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import CompressionSavings from "@/components/CompressionSavings";

describe("CompressionSavings Component", () => {
  it("renders with valid original and compressed sizes", () => {
    const { unmount } = render(
      <CompressionSavings originalSize={2048} compressedSize={1024} />,
    );

    expect(screen.getByText("Space saved")).toBeTruthy();
    expect(screen.getByText("1 KB (50%)")).toBeTruthy();
    expect(screen.getByText("Original: 2 KB")).toBeTruthy();
    expect(screen.getByText("Compressed: 1 KB")).toBeTruthy();
    unmount();
  });

  it("renders null when original size is zero", () => {
    const { container, unmount } = render(
      <CompressionSavings originalSize={0} compressedSize={1024} />,
    );
    expect(container.firstChild).toBeNull();
    unmount();
  });

  it("renders null when compressed size is zero", () => {
    const { container, unmount } = render(
      <CompressionSavings originalSize={2048} compressedSize={0} />,
    );
    expect(container.firstChild).toBeNull();
    unmount();
  });

  it("displays correct values when compressed size is larger than original size", () => {
    const { unmount } = render(
      <CompressionSavings originalSize={1024} compressedSize={2048} />,
    );

    expect(screen.getByText("Space saved")).toBeTruthy();
    expect(screen.getByText("0 Bytes (0%)")).toBeTruthy();
    expect(screen.getByText("Original: 1 KB")).toBeTruthy();
    expect(screen.getByText("Compressed: 2 KB")).toBeTruthy();
    unmount();
  });
});
