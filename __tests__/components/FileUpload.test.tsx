import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import FileUpload from "@/components/FileUpload";

describe("FileUpload Component", () => {
  it("renders the component", () => {
    const onFileUpload = vi.fn();
    const { unmount } = render(<FileUpload onFileUpload={onFileUpload} />);

    expect(
      screen.getByText("Drag & drop your image here or click to browse"),
    ).toBeTruthy();
    unmount();
  });

  it("calls onFileUpload with the selected file when a valid file is selected", async () => {
    const onFileUpload = vi.fn();
    const { unmount } = render(<FileUpload onFileUpload={onFileUpload} />);

    const file = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });
    const input = screen.getByLabelText("File upload");

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileUpload).toHaveBeenCalledWith(file);
    unmount();
  });

  it("displays an error message when an invalid file is selected", async () => {
    const mb = 1024 * 1024;
    const onFileUpload = vi.fn();
    const { unmount } = render(
      <FileUpload onFileUpload={onFileUpload} maxSize={mb} />,
    );

    const oversizedContent = new Uint8Array(mb * 2);
    const file = new File([oversizedContent], "chucknorris.png", {
      type: "image/png",
    });
    const input = screen.getByLabelText("File upload");

    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText("File size must be less than 1MB. Got: 2.0MB"),
    ).toBeTruthy();
    expect(onFileUpload).not.toHaveBeenCalled();
    unmount();
  });
});
