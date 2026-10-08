import {
  mapColumns,
  sortRows,
  compareValues,
  validateRows,
  normalizeTheme,
  normalizeChromeActionPlacement,
  normalizeChromeButtonsVariant,
  mergeDraftsIntoRows
} from "c/cloudialAdtUtils";

describe("cloudialAdtUtils", () => {
  it("normalizes themes", () => {
    expect(normalizeTheme("glass")).toBe("glass");
    expect(normalizeTheme("nope")).toBe("default");
  });

  it("normalizes chromeActionPlacement", () => {
    expect(normalizeChromeActionPlacement("header")).toBe("header");
    expect(normalizeChromeActionPlacement("chrome")).toBe("chrome");
    expect(normalizeChromeActionPlacement("toolbar")).toBe("toolbar");
    expect(normalizeChromeActionPlacement("chorme")).toBe("header");
    expect(normalizeChromeActionPlacement("")).toBe("header");
    expect(normalizeChromeActionPlacement(undefined)).toBe("header");
  });

  it("normalizes chromeButtonsVariant", () => {
    expect(normalizeChromeButtonsVariant("default")).toBe("default");
    expect(normalizeChromeButtonsVariant("icon")).toBe("icon");
    expect(normalizeChromeButtonsVariant("icons")).toBe("default");
    expect(normalizeChromeButtonsVariant("")).toBe("default");
  });

  it("maps Cloudial schema columns", () => {
    const cols = mapColumns(
      [
        { field: "name", label: "Name", type: "text" },
        {
          field: "status",
          label: "Status",
          type: "combobox",
          editable: true,
          picklistValues: { A: "a" }
        }
      ],
      { keyField: "id" }
    );
    expect(cols[0].fieldName).toBe("name");
    expect(cols[0].sortable).toBe(true);
    expect(cols[1].type).toBe("combobox");
    expect(cols[1].typeAttributes.fieldName).toBe("status");
  });

  it("sorts numbers and text", () => {
    const rows = [
      { id: "1", name: "b", amount: 10 },
      { id: "2", name: "a", amount: 2 }
    ];
    expect(sortRows(rows, "amount", "asc", "number").map((r) => r.amount)).toEqual([
      2, 10
    ]);
    expect(sortRows(rows, "name", "asc", "text").map((r) => r.name)).toEqual([
      "a",
      "b"
    ]);
    expect(compareValues(5, 2, "number")).toBeGreaterThan(0);
  });

  it("validates required and min", () => {
    const result = validateRows(
      [{ id: "1", name: "", amount: -1 }],
      [
        { field: "name", validation: { required: true } },
        { field: "amount", validation: { min: 0 } }
      ],
      "id"
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(2);
  });

  it("maps recordLink columns to url type", () => {
    const cols = mapColumns(
      [{ field: "name", label: "Name", type: "text", recordLink: true }],
      { keyField: "id" }
    );
    expect(cols[0].type).toBe("url");
    expect(cols[0].fieldName).toBe("nameUrl");
    expect(cols[0].typeAttributes.label.fieldName).toBe("name");
  });

  it("merges drafts into rows", () => {
    const merged = mergeDraftsIntoRows(
      [{ id: "1", name: "A", active: false }],
      [{ id: "1", active: true }],
      "id"
    );
    expect(merged[0].active).toBe(true);
    expect(merged[0].name).toBe("A");
  });
});
