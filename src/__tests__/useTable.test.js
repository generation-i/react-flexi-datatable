import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTable from "../hooks/useTable";

const sampleData = [
  { name: "Siva", age: 28, city: "Chennai" },
  { name: "Tamil", age: 24, city: "Madurai" },
  { name: "Devi", age: 30, city: "Pudukkottai" },
];

describe("useTable", () => {
  it("returns all data when no search is applied", () => {
    const { result } = renderHook(() => useTable(sampleData));
    expect(result.current.filteredData).toHaveLength(3);
  });

  it("filters data by search term", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.setSearch("Siva");
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe("Siva");
  });

  it("search is case-insensitive", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.setSearch("chennai");
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].city).toBe("Chennai");
  });

  it("returns empty array when search matches nothing", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.setSearch("zzzzz");
    });

    expect(result.current.filteredData).toHaveLength(0);
  });

  it("sorts ascending on first click", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.sortColumn("age");
    });

    expect(result.current.filteredData[0].age).toBe(24);
    expect(result.current.filteredData[2].age).toBe(30);
  });

  it("toggles to descending on second click of same column", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.sortColumn("age");
    });
    act(() => {
      result.current.sortColumn("age");
    });

    expect(result.current.filteredData[0].age).toBe(30);
    expect(result.current.filteredData[2].age).toBe(24);
  });

  it("resets to ascending when switching to a different column", () => {
    const { result } = renderHook(() => useTable(sampleData));

    act(() => {
      result.current.sortColumn("age");
    });
    act(() => {
      result.current.sortColumn("age");
    });
    act(() => {
      result.current.sortColumn("name");
    });

    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.filteredData[0].name).toBe("Devi");
  });

  it("handles empty data gracefully", () => {
    const { result } = renderHook(() => useTable([]));
    expect(result.current.filteredData).toHaveLength(0);
  });

  it("handles undefined data gracefully", () => {
    const { result } = renderHook(() => useTable(undefined));
    expect(result.current.filteredData).toHaveLength(0);
  });
});
