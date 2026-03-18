import { useState } from "react";
import { DataTable } from "./index";

const sampleData = [
  { id: 1, name: "Siva", age: 28, city: "Chennai" },
  { id: 2, name: "Tamil", age: 24, city: "Madurai" },
  { id: 3, name: "Devi", age: 30, city: "Pudukkottai" },
  { id: 4, name: "John", age: 28, city: "London" },
  { id: 5, name: "Sara", age: 24, city: "Paris" },
  { id: 6, name: "David", age: 30, city: "New York" },
];

const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age", sortable: true },
  { header: "City", accessor: "city" },
  {
    header: "Action",
    accessor: "id",
    render: (_, row) => (
      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <button onClick={() => alert(`view: ${row.name}`)}>View</button>
        <button onClick={() => alert(`delete: ${row.name}`)}>Delete</button>
      </div>
    ),
  },
];

function App() {
  const [theme, setTheme] = useState("default");
  const [data] = useState(sampleData);

  return (
    <div style={{ padding: 40 }}>
      <h2>Flexi DataTable</h2>
      <select onChange={(e) => setTheme(e.target.value)}>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
        <option value="minimal">Minimal</option>
      </select>

      <DataTable
        columns={columns}
        data={data}
        theme={theme}
        perPage={10}
        onDelete={(rows) => console.log("Deleted rows:", rows)}
        onPageChange={(info) => console.log("Page changed:", info)}
        isSearch
        isCSV
        isColumnToggle
        isMassDelete
        isRowPerPage
        isPagination
      />
    </div>
  );
}

export default App;
