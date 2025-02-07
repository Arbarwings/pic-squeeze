import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import DownloadButton from "@/components/DownloadButton";

describe("DownloadButton Component", () => {
  it("renders the component", () => {
    const { unmount } = render(
      <DownloadButton
        imageData="test-image.jpg"
        fileName="test-image"
        disabled={false}
      />,
    );

    expect(screen.getByText("Download compressed image")).toBeTruthy();
    unmount();
  });
});
