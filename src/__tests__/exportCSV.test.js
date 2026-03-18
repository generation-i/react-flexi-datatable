import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import exportCSV from "../utils/exportCSV";

describe("exportCSV", () => {
  let clickMock;

  beforeEach(() => {
    clickMock = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue({
      href: "",
      download: "",
      click: clickMock,
    });
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does nothing when data is empty", () => {
    exportCSV([]);
    expect(clickMock).not.toHaveBeenCalled();
  });

  it("does nothing when data is null", () => {
    exportCSV(null);
    expect(clickMock).not.toHaveBeenCalled();
  });

  it("creates a download link and clicks it", () => {
    const data = [{ name: "Siva", age: 28 }];
    exportCSV(data, "test");

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });

  it("generates correct CSV with headers", () => {
    let blobContent = "";
    const OrigBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts, options) {
        blobContent = parts[0];
        this._options = options;
      }
    };

    const data = [
      { name: "Siva", age: 28 },
      { name: "Tamil", age: 24 },
    ];
    exportCSV(data);

    const lines = blobContent.split("\n");
    expect(lines[0]).toBe("name,age");
    expect(lines[1]).toBe("Siva,28");
    expect(lines[2]).toBe("Tamil,24");

    globalThis.Blob = OrigBlob;
  });

  it("escapes values containing commas", () => {
    let blobContent = "";
    const OrigBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts) {
        blobContent = parts[0];
      }
    };

    exportCSV([{ name: "Doe, John", age: 30 }]);

    const lines = blobContent.split("\n");
    expect(lines[1]).toBe('"Doe, John",30');

    globalThis.Blob = OrigBlob;
  });

  it("escapes values containing double quotes", () => {
    let blobContent = "";
    const OrigBlob = globalThis.Blob;
    globalThis.Blob = class MockBlob {
      constructor(parts) {
        blobContent = parts[0];
      }
    };

    exportCSV([{ name: 'He said "hello"', age: 25 }]);

    const lines = blobContent.split("\n");
    expect(lines[1]).toBe('"He said ""hello""",25');

    globalThis.Blob = OrigBlob;
  });
});
