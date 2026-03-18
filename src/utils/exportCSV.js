function escapeCSVValue(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function exportCSV(data, filename = "table-data") {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.map(escapeCSVValue).join(",")];

  for (const row of data) {
    const values = headers.map((header) => escapeCSVValue(row[header]));
    csvRows.push(values.join(","));
  }

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}
