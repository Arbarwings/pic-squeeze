import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import CompressionSettings from "@/components/CompressionSettings";

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("CompressionSettings Component", () => {
  it("renders the component", () => {
    const onSettingsChange = vi.fn();
    const { unmount } = render(
      <CompressionSettings onSettingsChange={onSettingsChange} />,
    );

    expect(screen.getByText("Compression settings")).toBeTruthy();
    expect(screen.getByText("Quality: 80%")).toBeTruthy();
    unmount();
  });
});
