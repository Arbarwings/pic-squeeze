import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import ImagePreview from "@/components/ImagePreview";

describe("ImagePreview Component", () => {
  it("renders with title, source, and file size", () => {
    const { unmount } = render(
      <ImagePreview
        title="Test Picture"
        src="/test-image.jpg"
        fileSize={2048}
      />,
    );

    expect(screen.getByText("Test Picture")).toBeTruthy();
    expect(screen.getByText("2 KB")).toBeTruthy();
    const image = screen.getByAltText("Test Picture image");
    expect(image).toBeTruthy();
    unmount();
  });

  it("renders with title and source but without file size", () => {
    const { unmount } = render(
      <ImagePreview title="Test Picture" src="/test-image.jpg" />,
    );

    expect(screen.getByText("Test Picture")).toBeTruthy();
    expect(screen.queryByText(/KB/)).toBeNull();
    const image = screen.getByAltText("Test Picture image");
    expect(image).toBeTruthy();
    unmount();
  });

  it("renders with title but without source or file size (placeholder)", () => {
    const { unmount } = render(<ImagePreview title="Test Picture" />);

    expect(screen.getByText("Test Picture")).toBeTruthy();
    expect(screen.getByText("No image uploaded")).toBeTruthy();
    expect(screen.queryByAltText("Test Picture image")).toBeNull();
    unmount();
  });
});
