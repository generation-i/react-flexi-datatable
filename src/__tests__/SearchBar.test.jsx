import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders an input with placeholder", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("displays the provided value", () => {
    render(<SearchBar value="hello" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("hello");
  });

  it("calls onChange when user types", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "test" },
    });

    expect(handleChange).toHaveBeenCalledWith("test");
  });
});
