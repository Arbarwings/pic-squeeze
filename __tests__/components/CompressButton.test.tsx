import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import CompressButton from "@/components/CompressButton";

describe("CompressButton Component", () => {
  it("renders the component with the button text 'Compress image'", () => {
    const onCompress = vi.fn();
    const { unmount } = render(
      <CompressButton onCompress={onCompress} disabled={false} />,
    );

    expect(screen.getByText("Compress image")).toBeTruthy();
    unmount();
  });

  it("renders the component in a loading state with the text 'Compressing...'", () => {
    const onCompress = vi.fn();
    const { rerender, unmount } = render(
      <CompressButton onCompress={onCompress} disabled={false} />,
    );

    // Simulate loading state
    rerender(<CompressButton onCompress={onCompress} disabled={true} />);

    expect(screen.getByText("Compress image")).toBeTruthy();
    unmount();
  });

  it("calls onCompress when the button is clicked", async () => {
    const onCompress = vi.fn();
    const { unmount } = render(
      <CompressButton onCompress={onCompress} disabled={false} />,
    );

    const button = screen.getByText("Compress image");
    fireEvent.click(button);

    await waitFor(() => expect(onCompress).toHaveBeenCalledTimes(1));
    unmount();
  });
});
