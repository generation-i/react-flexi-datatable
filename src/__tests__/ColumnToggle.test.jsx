import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ColumnToggle from "../components/ColumnToggle";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
  { header: "City", accessor: "city" },
];

describe("ColumnToggle", () => {
  it("renders the toggle button", () => {
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "age", "city"]}
        setVisibleColumns={() => {}}
      />,
    );
    expect(screen.getByText(/Select Columns/)).toBeInTheDocument();
  });

  it("does not show dropdown initially", () => {
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "age", "city"]}
        setVisibleColumns={() => {}}
      />,
    );
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
  });

  it("opens dropdown on button click", () => {
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "age", "city"]}
        setVisibleColumns={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Select Columns/));

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
  });

  it("shows checkboxes as checked for visible columns", () => {
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "city"]}
        setVisibleColumns={() => {}}
      />,
    );

    fireEvent.click(screen.getByText(/Select Columns/));

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked(); // name
    expect(checkboxes[1]).not.toBeChecked(); // age
    expect(checkboxes[2]).toBeChecked(); // city
  });

  it("calls setVisibleColumns to remove a column when unchecking", () => {
    const setVisibleColumns = vi.fn();
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "age", "city"]}
        setVisibleColumns={setVisibleColumns}
      />,
    );

    fireEvent.click(screen.getByText(/Select Columns/));
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // uncheck "age"

    expect(setVisibleColumns).toHaveBeenCalledWith(["name", "city"]);
  });

  it("calls setVisibleColumns to add a column when checking", () => {
    const setVisibleColumns = vi.fn();
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "city"]}
        setVisibleColumns={setVisibleColumns}
      />,
    );

    fireEvent.click(screen.getByText(/Select Columns/));
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // check "age"

    expect(setVisibleColumns).toHaveBeenCalledWith(["name", "city", "age"]);
  });

  it("closes dropdown when button is clicked again", () => {
    render(
      <ColumnToggle
        columns={columns}
        visibleColumns={["name", "age", "city"]}
        setVisibleColumns={() => {}}
      />,
    );

    const toggleBtn = screen.getByText(/Select Columns/);
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Name")).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByText("Name")).not.toBeInTheDocument();
  });
});
