import { useState, useMemo } from "react";

const useTable = (data = []) => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredData = useMemo(() => {
    let rows = Array.isArray(data) ? [...data] : [];

    if (search) {
      rows = rows.filter((row) =>
        Object.values(row || {}).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }

    if (sortField) {
      rows.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [data, search, sortField, sortOrder]);

  const sortColumn = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return { filteredData, search, setSearch, sortColumn, sortField, sortOrder };
};

export default useTable;
