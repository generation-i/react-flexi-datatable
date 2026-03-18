# flexi-datatable

Lightweight, plug-and-play React DataTable with built-in search, sorting, pagination, column toggling, CSV export, mass delete, drag-reorder, and theming. Zero configuration needed -- just pass your `columns` and `data`.

## Installation

```bash
npm install flexi-datatable
```

## Step 1: Import the Component and CSS

```jsx
import { DataTable } from "flexi-datatable";
import "flexi-datatable/style.css";
```

> The CSS import is required for the table to render correctly. Import it once in your app entry point or in the component where you use `DataTable`.

## Step 2: Define Your Columns

Columns tell the table what headers to show and which field in your data each column maps to.

```jsx
const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age", sortable: true },
  { header: "City", accessor: "city" },
];
```

Each column object supports:

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `header` | `string` | Yes | Text shown in the table header |
| `accessor` | `string` | Yes | The key in your data objects that this column displays |
| `sortable` | `bool` | No | If `true`, clicking the header toggles ascending/descending sort |
| `render` | `func` | No | Custom renderer `(cellValue, rowObject) => JSX` for full control |

## Step 3: Prepare Your Data

Pass an array of objects. Each object is one row. The keys must match the `accessor` values in your columns.

```jsx
const data = [
  { name: "Siva", age: 28, city: "Chennai" },
  { name: "Tamil", age: 24, city: "Madurai" },
  { name: "Devi", age: 30, city: "Pudukkottai" },
  { name: "John", age: 35, city: "London" },
  { name: "Sara", age: 22, city: "Paris" },
];
```

## Step 4: Render the DataTable

### Minimal Example

Only `columns` and `data` are required. Everything else is optional.

```jsx
function App() {
  return <DataTable columns={columns} data={data} />;
}
```

### Full-Featured Example

Enable all features by passing boolean props:

```jsx
import { useState } from "react";
import { DataTable } from "flexi-datatable";
import "flexi-datatable/style.css";

function App() {
  const [data, setData] = useState([
    { id: 1, name: "Siva", age: 28, city: "Chennai" },
    { id: 2, name: "Tamil", age: 24, city: "Madurai" },
    { id: 3, name: "Devi", age: 30, city: "Pudukkottai" },
    { id: 4, name: "John", age: 35, city: "London" },
    { id: 5, name: "Sara", age: 22, city: "Paris" },
  ]);

  const columns = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Age", accessor: "age", sortable: true },
    { header: "City", accessor: "city" },
    {
      header: "Action",
      accessor: "id",
      render: (value, row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => alert(`Viewing ${row.name}`)}>View</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
    },
  ];

  const handleDelete = (row) => {
    setData((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleMassDelete = (selectedRows) => {
    const selectedIds = selectedRows.map((r) => r.id);
    setData((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
  };

  const handlePageChange = ({ page, rowsPerPage }) => {
    console.log(`Page: ${page}, Rows per page: ${rowsPerPage}`);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      theme="default"
      perPage={10}
      isSearch
      isPagination
      isCSV
      isColumnToggle
      isMassDelete
      isRowPerPage
      onDelete={handleMassDelete}
      onPageChange={handlePageChange}
    />
  );
}
```

## Props Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `Array` | `[]` | **Required.** Array of column definition objects (see above) |
| `data` | `Array` | `[]` | **Required.** Array of row objects |
| `page` | `number` | `1` | Initial page number |
| `perPage` | `number` | `10` | Number of rows displayed per page |
| `theme` | `string` | `"default"` | Built-in theme name: `"default"`, `"dark"`, `"blue"`, `"minimal"` |
| `customTheme` | `object` | `{}` | Inline style overrides for each part of the table (see Theming) |
| `isSearch` | `bool` | `false` | Show the search input above the table |
| `isPagination` | `bool` | `false` | Show pagination controls below the table |
| `isCSV` | `bool` | `false` | Show the "Export CSV" button |
| `isColumnToggle` | `bool` | `false` | Show the column visibility dropdown |
| `isMassDelete` | `bool` | `false` | Show the "Mass Delete" button and row checkboxes |
| `isRowPerPage` | `bool` | `false` | Show the rows-per-page dropdown selector |
| `onPageChange` | `func` | - | Called when the page or rows-per-page changes. Receives `{ page: number, rowsPerPage: number }` |
| `onDelete` | `func` | - | Called when "Mass Delete" is confirmed. Receives an array of the selected row objects |

## Feature Examples

### Search

Enable the search bar to filter rows across all columns:

```jsx
<DataTable columns={columns} data={data} isSearch />
```

Users can type any text and the table instantly filters to show only matching rows.

### Sorting

Add `sortable: true` to any column definition. Users click the header to sort:

```jsx
const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age", sortable: true },
  { header: "City", accessor: "city" }, // not sortable
];
```

- First click: sorts ascending (▲)
- Second click: sorts descending (▼)
- Unsorted columns show (↕)

### Pagination

```jsx
<DataTable
  columns={columns}
  data={data}
  isPagination
  perPage={5}
  onPageChange={({ page, rowsPerPage }) => {
    console.log(`Now on page ${page}, showing ${rowsPerPage} rows`);
  }}
/>
```

Add `isRowPerPage` to let users pick 5, 10, 20, or 50 rows per page:

```jsx
<DataTable columns={columns} data={data} isPagination isRowPerPage perPage={10} />
```

### Custom Cell Rendering

Use the `render` function in a column definition to render custom JSX in each cell. The function receives `(cellValue, rowObject)`:

```jsx
const columns = [
  { header: "Name", accessor: "name" },
  {
    header: "Status",
    accessor: "isActive",
    render: (value) => (
      <span style={{ color: value ? "green" : "red" }}>
        {value ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessor: "id",
    render: (id, row) => (
      <button onClick={() => navigate(`/users/${id}`)}>
        View {row.name}
      </button>
    ),
  },
];
```

### CSV Export

```jsx
<DataTable columns={columns} data={data} isCSV />
```

Clicking "Export CSV" downloads a `.csv` file containing the currently filtered data (respects the active search query).

### Column Toggle (Show/Hide Columns)

```jsx
<DataTable columns={columns} data={data} isColumnToggle />
```

A "Select Columns" dropdown appears. Users can check/uncheck columns to show or hide them.

### Column Drag Reorder

Columns are draggable by default. Users can drag-and-drop column headers to reorder them. No extra prop needed.

### Mass Delete

```jsx
<DataTable
  columns={columns}
  data={data}
  isMassDelete
  onDelete={(selectedRows) => {
    // selectedRows is an array of the row objects the user checked
    console.log("Rows to delete:", selectedRows);
    setData((prev) =>
      prev.filter((row) => !selectedRows.includes(row))
    );
  }}
/>
```

Each row gets a checkbox. A "Select All" checkbox appears in the header. Clicking "Mass Delete" triggers a confirmation dialog, then calls `onDelete` with the selected rows.

## Theming

### Built-in Themes

```jsx
<DataTable theme="default" ... />  // light, clean
<DataTable theme="dark" ... />     // dark background, white text
<DataTable theme="blue" ... />     // blue header, blue accents
<DataTable theme="minimal" ... />  // borderless, minimal style
```

### Custom Theme (Inline Style Overrides)

Pass a `customTheme` object to override styles on specific parts of the table. Every key is optional -- only include what you want to override:

```jsx
const customTheme = {
  container: { background: "#1a1a2e", padding: "20px", borderRadius: "8px" },
  table: { border: "1px solid #333" },
  header: { background: "#16213e", color: "#e94560", fontWeight: "bold" },
  headerRow: { background: "#0f3460" },
  row: { background: "#1a1a2e" },
  cell: { padding: "12px", borderBottom: "1px solid #333" },
  searchBar: { background: "#16213e", color: "#fff", padding: "8px 12px" },
  csvButton: { background: "#e94560", color: "#fff", borderRadius: "4px" },
  deleteButton: { background: "#c0392b", color: "#fff" },
  pagiContainer: { justifyContent: "center" },
  prevButton: { background: "#16213e", color: "#fff" },
  nextButton: { background: "#16213e", color: "#fff" },
  pageButton: { background: "#16213e", color: "#fff" },
  columnToggle: {},
  columnBtn: { background: "#16213e", color: "#fff" },
  columnDropdown: { background: "#1a1a2e", border: "1px solid #333" },
  columnLabel: { color: "#fff" },
  columnInput: {},
};

<DataTable columns={columns} data={data} customTheme={customTheme} />
```

## Using with API Data

```jsx
import { useState, useEffect } from "react";
import { DataTable } from "flexi-datatable";
import "flexi-datatable/style.css";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const columns = [
    { header: "ID", accessor: "id", sortable: true },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Website",
      accessor: "website",
      render: (url) => (
        <a href={`https://${url}`} target="_blank" rel="noreferrer">
          {url}
        </a>
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <DataTable
      columns={columns}
      data={users}
      theme="blue"
      perPage={5}
      isSearch
      isPagination
      isCSV
      isColumnToggle
      isRowPerPage
    />
  );
}
```

## All Exports

You can also import individual sub-components and utilities:

```jsx
import {
  DataTable,      // Main table component
  Pagination,     // Standalone pagination control
  SearchBar,      // Standalone search input
  ColumnToggle,   // Standalone column visibility dropdown
  exportCSV,      // Utility function: exportCSV(data, filename?)
  useTable,       // Hook: returns { filteredData, search, setSearch, sortColumn, sortField, sortOrder }
} from "flexi-datatable";
```

## License

MIT
