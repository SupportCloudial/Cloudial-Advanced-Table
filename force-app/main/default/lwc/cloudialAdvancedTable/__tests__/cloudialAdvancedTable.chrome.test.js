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

function iconNameOf(el) {
  return el.iconName || el.getAttribute("icon-name");
}

function dataNameOf(el) {
  return el.dataset?.name || el.getAttribute("data-name");
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
      [...chromeActions.querySelectorAll("lightning-button")].map(dataNameOf)
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
      [...chromeActions.querySelectorAll("lightning-button")].map(dataNameOf)
    ).toEqual(["delete"]);
  });

  it("renders Filter, Columns, and Refresh as icon-only when chromeButtonsVariant is icon", async () => {
    const el = createTable({
      headerActions: [],
      enableFilter: true,
      enableColumnPicker: true,
      enableRefresh: true,
      chromeButtonsVariant: "icon"
    });
    await flushPromises();

    const icons = [...el.shadowRoot.querySelectorAll("lightning-button-icon")];
    expect(icons.map(iconNameOf).sort()).toEqual(
      ["utility:filterList", "utility:refresh", "utility:table"].sort()
    );
    const filterIcon = icons.find((b) => iconNameOf(b) === "utility:filterList");
    expect(filterIcon.alternativeText || filterIcon.title).toBeTruthy();
    expect(
      el.shadowRoot.querySelector(
        'lightning-button[icon-name="utility:filterList"]'
      )
    ).toBeNull();
  });

  it("keeps Filter labeled when chromeButtonsVariant is default", async () => {
    const el = createTable({
      headerActions: [],
      enableFilter: true,
      enableColumnPicker: true,
      chromeButtonsVariant: "default"
    });
    await flushPromises();

    expect(
      el.shadowRoot.querySelectorAll("lightning-button-icon").length
    ).toBe(0);
    const filterBtn = [
      ...el.shadowRoot.querySelectorAll("lightning-button")
    ].find((b) => iconNameOf(b) === "utility:filterList");
    expect(filterBtn).toBeTruthy();
  });

  it("renders iconOnly header actions as lightning-button-icon", async () => {
    const el = createTable({
      chromeActionPlacement: "chrome",
      headerActions: [
        {
          name: "add",
          label: "Add row",
          iconName: "utility:add",
          iconOnly: true,
          variant: "brand"
        },
        { name: "clone", label: "Clone", iconName: "utility:copy" }
      ]
    });
    await flushPromises();

    const chromeActions = el.shadowRoot.querySelector(
      ".cloudial-adt__chrome-actions"
    );
    const iconBtn = chromeActions.querySelector("lightning-button-icon");
    expect(iconBtn).not.toBeNull();
    expect(dataNameOf(iconBtn)).toBe("add");
    expect(iconNameOf(iconBtn)).toBe("utility:add");
    expect(iconBtn.variant || iconBtn.getAttribute("variant")).toBe("brand");
    expect(
      iconBtn.alternativeText ||
        iconBtn.getAttribute("alternative-text") ||
        iconBtn.title
    ).toMatch(/Add row/i);

    const labeled = [...chromeActions.querySelectorAll("lightning-button")].map(
      dataNameOf
    );
    expect(labeled).toEqual(["clone"]);
  });

  it("keeps labeled header actions when iconOnly is set without iconName", async () => {
    const el = createTable({
      headerActions: [
        { name: "add", label: "Add row", iconOnly: true }
      ]
    });
    await flushPromises();

    expect(
      el.shadowRoot.querySelectorAll("lightning-button-icon").length
    ).toBe(0);
    expect(
      dataNameOf(
        el.shadowRoot.querySelector(
          ".cloudial-adt__header-actions lightning-button"
        )
      )
    ).toBe("add");
  });

  it("dispatches headeraction from iconOnly header action click", async () => {
    const el = createTable({
      chromeActionPlacement: "header",
      headerActions: [
        {
          name: "add",
          label: "Add row",
          iconName: "utility:add",
          iconOnly: true
        }
      ]
    });
    await flushPromises();

    const handler = jest.fn();
    el.addEventListener("headeraction", handler);

    const add = el.shadowRoot.querySelector(
      'lightning-button-icon[data-name="add"], .cloudial-adt__header-actions lightning-button-icon'
    );
    expect(add).not.toBeNull();
    add.click();
    await flushPromises();

    expect(handler).toHaveBeenCalled();
    expect(handler.mock.calls[0][0].detail.name).toBe("add");
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
