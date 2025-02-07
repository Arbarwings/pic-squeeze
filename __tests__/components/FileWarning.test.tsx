import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import FileWarning from "@/components/FileWarning";

describe("FileWarning Component", () => {
  it("renders with title and message", () => {
    const { unmount } = render(
      <FileWarning title="Warning Title" message="Warning message." />,
    );

    expect(screen.getByText("Warning Title")).toBeTruthy();
    expect(screen.getByText("Warning message.")).toBeTruthy();

    const alertElement = screen.getByRole("alert");
    expect(alertElement).toBeTruthy();
    unmount();
  });
});
