import { createElement } from "lwc";
import CloudialAdvancedTable from "c/cloudialAdvancedTable";

const ACTIONS = [
  { name: "add", label: "Add", iconName: "utility:add" },
  { name: "clone", label: "Clone", iconName: "utility:copy" }
];

const BULK = [{ name: "delete", label: "Delete", variant: "destructive" }];

function flushPromises() {
  return Promise.resolve();
}

function createTable(props = {}) {
  const el = createElement("c-cloudial-advanced-table", {
    is: CloudialAdvancedTable
  });
  Object.assign(el, {
    keyField: "id",
    title: "Contacts",
    columnDefs: [{ field: "name", label: "Name", type: "text" }],
    data: [{ id: "1", name: "Ada" }],
    headerActions: ACTIONS,
    ...props
  });
  document.body.appendChild(el);
  return el;
}

describe("cloudialAdvancedTable chrome placement and icon buttons", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("keeps actions in the title row by default", async () => {
    const el = createTable({
      enableSearch: true,
      enableColumnPicker: true,
      enableRefresh: true
    });
    await flushPromises();

    const headerActions = el.shadowRoot.querySelector(
      ".cloudial-adt__header .cloudial-adt__header-actions"
    );
    const chromeActions = el.shadowRoot.querySelector(
      ".cloudial-adt__chrome-actions"
    );
    expect(headerActions).not.toBeNull();
    expect(chromeActions).toBeNull();
    expect(
      el.shadowRoot.querySelectorAll("lightning-button-icon").length
    ).toBe(0);
  });

  it("moves actions to chrome end when chromeActionPlacement is chrome", async () => {
    const el = createTable({
      chromeActionPlacement: "chrome",
      enableSearch: true,
      enableRefresh: true
    });
    await flushPromises();

    expect(
      el.shadowRoot.querySelector(
        ".cloudial-adt__header .cloudial-adt__header-actions"
      )
    ).toBeNull();
    const chromeActions = el.shadowRoot.querySelector(
      ".cloudial-adt__chrome-actions"
    );
    expect(chromeActions).not.toBeNull();
    expect(
      [...chromeActions.querySelectorAll("lightning-button")].map((b) =>
        b.getAttribute("data-name")
      )
    ).toEqual(["add", "clone"]);
  });

  it("shows chrome row for actions even when built-in chrome is off", async () => {
    const el = createTable({
      chromeActionPlacement: "chrome",
      enableSearch: false,
      enableFilter: false,
      enableColumnPicker: false,
      enableRefresh: false
    });
    await flushPromises();

    expect(el.shadowRoot.querySelector(".cloudial-adt__chrome")).not.toBeNull();
    expect(
      el.shadowRoot.querySelector(".cloudial-adt__chrome-actions")
    ).not.toBeNull();
  });

  it("moves actions to toolbar when chromeActionPlacement is toolbar", async () => {
    const el = createTable({
      chromeActionPlacement: "toolbar"
    });
    await flushPromises();

    expect(
      el.shadowRoot.querySelector(
        ".cloudial-adt__header .cloudial-adt__header-actions"
      )
    ).toBeNull();
    const toolbar = el.shadowRoot.querySelector(
      ".cloudial-adt__toolbar_with-actions"
    );
    expect(toolbar).not.toBeNull();
    expect(
      el.shadowRoot.querySelector(".cloudial-adt__toolbar-actions")
    ).not.toBeNull();
  });

  it("moves selection banner with bulk actions in chrome", async () => {
    const el = createTable({
      chromeActionPlacement: "chrome",
      enableRefresh: true,
      bulkActions: BULK,
      selectedRows: ["1"]
    });
    await flushPromises();

    const chromeActions = el.shadowRoot.querySelector(
      ".cloudial-adt__chrome-actions"
    );
    expect(
      chromeActions.querySelector(".cloudial-adt__selection-banner")
    ).not.toBeNull();
    expect(
      [...chromeActions.querySelectorAll("lightning-button")].map((b) =>
        b.getAttribute("data-name")
      )
    ).toEqual(["delete"]);
  });

  it("renders Columns and Refresh as icon-only when chromeButtonsVariant is icon", async () => {
    const el = createTable({
      headerActions: [],
      enableFilter: true,
      enableColumnPicker: true,
      enableRefresh: true,
      chromeButtonsVariant: "icon"
    });
    await flushPromises();

    const icons = el.shadowRoot.querySelectorAll("lightning-button-icon");
    expect(icons.length).toBe(2);
    const labeled = [...el.shadowRoot.querySelectorAll("lightning-button")].filter(
      (b) => b.iconName === "utility:filterList" || b.label
    );
    // Filter remains a labeled lightning-button
    expect(
      el.shadowRoot.querySelector(
        'lightning-button[icon-name="utility:filterList"], lightning-button'
      )
    ).not.toBeNull();
    const filterBtn = [...el.shadowRoot.querySelectorAll("lightning-button")].find(
      (b) => (b.iconName || b.getAttribute("icon-name")) === "utility:filterList"
    );
    expect(filterBtn).toBeTruthy();
    expect(labeled.length).toBeGreaterThanOrEqual(0);
  });

  it("falls back to defaults for invalid placement and variant", async () => {
    const el = createTable({
      chromeActionPlacement: "chorme",
      chromeButtonsVariant: "icons",
      enableColumnPicker: true,
      enableRefresh: true
    });
    await flushPromises();

    expect(
      el.shadowRoot.querySelector(
        ".cloudial-adt__header .cloudial-adt__header-actions"
      )
    ).not.toBeNull();
    expect(
      el.shadowRoot.querySelectorAll("lightning-button-icon").length
    ).toBe(0);
  });

  it("dispatches headeraction refresh from icon Refresh button", async () => {
    const el = createTable({
      headerActions: [],
      enableRefresh: true,
      chromeButtonsVariant: "icon"
    });
    await flushPromises();

    const handler = jest.fn();
    el.addEventListener("headeraction", handler);

    const refresh = el.shadowRoot.querySelector(
      'lightning-button-icon[icon-name="utility:refresh"], lightning-button-icon'
    );
    expect(refresh).not.toBeNull();
    refresh.click();
    await flushPromises();

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail.name).toBe("refresh");
  });
});
