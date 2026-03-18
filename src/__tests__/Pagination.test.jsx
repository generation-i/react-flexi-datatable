import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../components/Pagination";

describe("Pagination", () => {
  const defaultProps = {
    total: 50,
    currentPage: 1,
    rowsPerPage: 10,
    onPageChange: vi.fn(),
  };

  it("renders correct number of page buttons", () => {
    render(<Pagination {...defaultProps} />);
    const pageButtons = screen
      .getAllByRole("button")
      .filter((btn) => !["Prev", "Next"].includes(btn.textContent));
    expect(pageButtons).toHaveLength(5);
  });

  it("disables Prev button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText("Prev")).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it("calls onPageChange when a page button is clicked", () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByText("3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with next page on Next click", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page on Prev click", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Prev"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("returns null when total fits in one page", () => {
    const { container } = render(
      <Pagination {...defaultProps} total={5} rowsPerPage={10} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("returns null when total is 0", () => {
    const { container } = render(
      <Pagination {...defaultProps} total={0} rowsPerPage={10} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("marks the active page button", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    const activeBtn = screen.getByText("3");
    expect(activeBtn).toHaveClass("active-page");
  });
});
