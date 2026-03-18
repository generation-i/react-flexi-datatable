import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DataTable from "../components/DataTable";

const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age", sortable: true },
  { header: "City", accessor: "city" },
];

const sampleData = [
  { name: "Siva", age: 28, city: "Chennai" },
  { name: "Tamil", age: 24, city: "Madurai" },
  { name: "Devi", age: 30, city: "Pudukkottai" },
  { name: "John", age: 35, city: "London" },
  { name: "Sara", age: 22, city: "Paris" },
];

describe("DataTable", () => {
  it("renders the table with data", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    expect(screen.getByText("Siva")).toBeInTheDocument();
    expect(screen.getByText("Chennai")).toBeInTheDocument();
    expect(screen.getByText("Tamil")).toBeInTheDocument();
  });

  it('shows "No Data Found" when data is empty', () => {
    render(<DataTable columns={columns} data={[]} perPage={10} />);
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    expect(screen.getByText(/Name/)).toBeInTheDocument();
    expect(screen.getByText(/Age/)).toBeInTheDocument();
    expect(screen.getByText(/City/)).toBeInTheDocument();
  });

  it("paginates data correctly", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={2}
        isPagination
      />,
    );

    const tbody = screen.getAllByRole("row").slice(1);
    expect(tbody).toHaveLength(2);
  });

  it("shows search bar when isSearch is true", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isSearch
      />,
    );

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("filters rows based on search input", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isSearch
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "Siva" },
    });

    expect(screen.getByText("Siva")).toBeInTheDocument();
    expect(screen.queryByText("Tamil")).not.toBeInTheDocument();
  });

  it("shows Export CSV button when isCSV is true", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isCSV
      />,
    );

    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });

  it("shows Mass Delete button when isMassDelete is true", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isMassDelete
      />,
    );

    expect(screen.getByText("Mass Delete")).toBeInTheDocument();
  });

  it("shows column toggle when isColumnToggle is true", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isColumnToggle
      />,
    );

    expect(screen.getByText(/Select Columns/)).toBeInTheDocument();
  });

  it("sorts data when clicking a sortable header", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    const ageHeader = screen.getByText(/Age/);
    fireEvent.click(ageHeader);

    const rows = screen.getAllByRole("row").slice(1);
    const firstRowCells = within(rows[0]).getAllByRole("cell");
    expect(firstRowCells[2].textContent).toBe("22");
  });

  it("toggles sort direction on double-click", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    const ageHeader = screen.getByText(/Age/);
    fireEvent.click(ageHeader);
    fireEvent.click(ageHeader);

    const rows = screen.getAllByRole("row").slice(1);
    const firstRowCells = within(rows[0]).getAllByRole("cell");
    expect(firstRowCells[2].textContent).toBe("35");
  });

  it("selects a row with checkbox", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it("select-all toggles all rows", () => {
    render(
      <DataTable columns={columns} data={sampleData} perPage={10} />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAll = checkboxes[0];

    fireEvent.click(selectAll);
    checkboxes.slice(1).forEach((cb) => {
      expect(cb).toBeChecked();
    });

    fireEvent.click(selectAll);
    checkboxes.slice(1).forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  it("calls onDelete with selected rows on mass delete", () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isMassDelete
        onDelete={onDelete}
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getByText("Mass Delete"));

    expect(onDelete).toHaveBeenCalledWith([sampleData[0]]);

    vi.restoreAllMocks();
  });

  it("applies theme class", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        theme="dark"
      />,
    );

    expect(container.firstChild).toHaveClass("dt-theme-dark");
  });

  it("renders custom cell renderer", () => {
    const customColumns = [
      ...columns,
      {
        header: "Action",
        accessor: "name",
        render: (value) => <button>Edit {value}</button>,
      },
    ];

    render(
      <DataTable
        columns={customColumns}
        data={sampleData}
        perPage={10}
      />,
    );

    expect(screen.getByText("Edit Siva")).toBeInTheDocument();
  });

  it("shows rows per page selector when isRowPerPage is true", () => {
    render(
      <DataTable
        columns={columns}
        data={sampleData}
        perPage={10}
        isRowPerPage
      />,
    );

    expect(screen.getByText("Rows per page:")).toBeInTheDocument();
  });
});
