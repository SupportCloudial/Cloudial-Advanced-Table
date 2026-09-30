import { LightningElement, api, track } from "lwc";
import {
  mapColumns,
  sortRows,
  findColumnType,
  resolveSortField,
  validateRows,
  mergeHostErrors,
  normalizeTheme,
  mergeDraftsIntoRows,
  enrichRecordLinkUrls
} from "c/cloudialAdtUtils";

export default class CloudialAdvancedTable extends LightningElement {
  @api columnDefs = [];
  @api columns;
  @api
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = Array.isArray(value) ? value : [];
    this._refreshView();
  }

  @api keyField = "id";
  @api
  get draftValues() {
    return this._hostDraftValues;
  }
  set draftValues(value) {
    this._hostDraftValues = Array.isArray(value) ? value : [];
    this._refreshView();
  }
  @api selectedRows = [];
  @api hideCheckboxColumn = false;
  @api showRowNumberColumn = false;
  @api readOnly = false;
  @api maxRowSelection;
  @api theme = "default";
  @api title = "";
  @api headerActions = [];
  /** Optional bulk actions when rows are selected: [{ name, label, variant, iconName }] */
  @api bulkActions = [];
  @api errors = [];
  @api emptyMessage = "No records to display.";
  @api errorMessage = "";
  /** Show search box */
  @api enableSearch = false;
  @api searchPlaceholder = "Search...";
  /** Fields to search; empty = all string-ish fields on rows */
  @api searchFields = [];
  /** Show Filter button + panel. Filter defs: [{ name, label, type: 'text'|'boolean'|'picklist', options? }] */
  @api enableFilter = false;
  @api filterDefs = [];
  /** Show Columns picker for hideable columns */
  @api enableColumnPicker = false;
  /** Show Refresh in the chrome row (Search / Filter / Columns / Refresh) */
  @api enableRefresh = false;
  /** Optional total count label override; default uses filtered length */
  @api recordCountLabel = "";
  @api recordNoun = "records";

  _suppressBottomBar = true;
  @api
  get suppressBottomBar() {
    return this._suppressBottomBar;
  }
  set suppressBottomBar(value) {
    if (value === undefined || value === null) {
      this._suppressBottomBar = true;
      return;
    }
    this._suppressBottomBar = value === true || value === "true";
  }

  _showSaveCancel = true;
  @api
  get showSaveCancel() {
    return this._showSaveCancel;
  }
  set showSaveCancel(value) {
    if (value === undefined || value === null) {
      this._showSaveCancel = true;
      return;
    }
    this._showSaveCancel = value === true || value === "true";
  }

  @track sortedBy;
  @track sortedDirection = "asc";
  @track displayData = [];
  @track _validationErrors = [];
  @track _internalDrafts = [];
  @track searchTerm = "";
  @track showFilterPanel = false;
  @track showColumnPanel = false;
  @track activeFilters = {};
  @track hiddenFields = {};
  _hiddenFieldsInitialized = false;

  _data = [];
  _hostDraftValues = [];
  _lastValidity = true;

  get allMappedColumns() {
    if (Array.isArray(this.columns) && this.columns.length) {
      return this.columns;
    }
    return mapColumns(this.columnDefs, { keyField: this.keyField });
  }

  get schemaColumns() {
    return this.columnDefs?.length ? this.columnDefs : this.allMappedColumns;
  }

  get resolvedColumns() {
    return this.allMappedColumns.filter((col) => {
      const field = col.fieldName || col.field || col._sortField;
      if (!field) {
        return true;
      }
      return !this.hiddenFields[field];
    });
  }

  get combinedDrafts() {
    return mergeDraftMaps(
      this._hostDraftValues,
      this._internalDrafts,
      this.keyField
    );
  }

  get hostClass() {
    const theme = normalizeTheme(this.theme);
    const bulk = this.hasSelection ? " cloudial-adt_bulk" : "";
    return `cloudial-adt cloudial-adt_theme-${theme}${bulk}`;
  }

  get hasTitle() {
    return !!(this.title && String(this.title).trim());
  }

  get selectionCount() {
    return Array.isArray(this.selectedRows) ? this.selectedRows.length : 0;
  }

  get hasSelection() {
    return this.selectionCount > 0;
  }

  get headerActionItems() {
    const source = this.hasSelection && (this.bulkActions || []).length
      ? this.bulkActions
      : this.headerActions;
    return (Array.isArray(source) ? source : []).map((action, index) => ({
      key: action.name || `action-${index}`,
      name: action.name || `action-${index}`,
      label: action.label || action.name || "Action",
      variant: action.variant || "neutral",
      disabled:
        action.disabled === true ||
        (action.requiresSelection === true && !this.hasSelection),
      iconName: action.iconName || null,
      title: action.title || action.label || ""
    }));
  }

  get hasHeaderActions() {
    return this.headerActionItems.length > 0;
  }

  get showHeaderBar() {
    return (
      this.hasTitle ||
      this.hasHeaderActions ||
      this.enableSearch ||
      this.enableFilter ||
      this.enableColumnPicker ||
      this.enableRefresh
    );
  }

  get showChromeRow() {
    return (
      this.enableSearch ||
      this.enableFilter ||
      this.enableColumnPicker ||
      this.enableRefresh
    );
  }

  get computedRecordCountLabel() {
    if (this.recordCountLabel) {
      return this.recordCountLabel;
    }
    const n = this.displayData.length;
    const noun = this.recordNoun || "records";
    return `${n.toLocaleString()} ${noun}`;
  }

  get selectionBanner() {
    return `${this.selectionCount} selected`;
  }

  get hasRows() {
    return (this.displayData || []).length > 0;
  }

  get showEmpty() {
    return !this.hasRows && !this.errorMessage;
  }

  get showErrorBanner() {
    return !!(this.errorMessage && String(this.errorMessage).trim());
  }

  get hasPendingDrafts() {
    return (this._internalDrafts || []).length > 0;
  }

  get showFooterActions() {
    return this.showSaveCancel && this.hasPendingDrafts && !this.readOnly;
  }

  get filterDefItems() {
    return (Array.isArray(this.filterDefs) ? this.filterDefs : []).map((f) => {
      const current = this.activeFilters[f.name];
      return {
        ...f,
        key: f.name,
        isBoolean: f.type === "boolean",
        isPicklist: f.type === "picklist",
        isText: !f.type || f.type === "text",
        value: current == null ? "" : current,
        checked: current === true || current === "true",
        options: (f.options || []).map((o) =>
          typeof o === "string"
            ? { label: o, value: o }
            : { label: o.label, value: o.value }
        )
      };
    });
  }

  get activeFilterChips() {
    const chips = [];
    (this.filterDefs || []).forEach((f) => {
      const v = this.activeFilters[f.name];
      if (v === undefined || v === null || v === "") {
        return;
      }
      let display = String(v);
      if (f.type === "boolean") {
        display = v === true || v === "true" ? "Yes" : "No";
      }
      chips.push({
        key: f.name,
        label: `${f.label}: ${display}`
      });
    });
    return chips;
  }

  get hasActiveFilterChips() {
    return this.activeFilterChips.length > 0;
  }

  get columnPickerItems() {
    return (this.schemaColumns || [])
      .filter((c) => c && (c.field || c.fieldName) && c.hideable !== false)
      .filter((c) => c.type !== "action" && c.type !== "rowMenu")
      .map((c) => {
        const field = c.fieldName || c.field;
        const label =
          c.label !== undefined && c.label !== null && c.label !== ""
            ? c.label
            : field;
        return {
          key: field,
          field,
          label,
          checked: !this.hiddenFields[field]
        };
      })
      .filter((c) => c.label);
  }

  get errorsForTable() {
    const merged = mergeHostErrors(this._validationErrors, this.errors);
    if (!merged.length) {
      return undefined;
    }
    const rows = {};
    merged.forEach((e) => {
      const key = e.key;
      if (key == null) {
        return;
      }
      if (!rows[key]) {
        rows[key] = { title: "Error", messages: [], fieldNames: [] };
      }
      rows[key].messages.push(e.message);
      if (e.field && !rows[key].fieldNames.includes(e.field)) {
        rows[key].fieldNames.push(e.field);
      }
    });
    return { rows };
  }

  connectedCallback() {
    this._initDefaultHiddenFields();
    this._refreshView();
  }

  _initDefaultHiddenFields() {
    if (this._hiddenFieldsInitialized) {
      return;
    }
    const next = { ...this.hiddenFields };
    let changed = false;
    (this.schemaColumns || []).forEach((c) => {
      const field = c?.fieldName || c?.field;
      if (!field || c.defaultHidden !== true) {
        return;
      }
      if (next[field] === undefined) {
        next[field] = true;
        changed = true;
      }
    });
    if (changed) {
      this.hiddenFields = next;
    }
    this._hiddenFieldsInitialized = true;
  }

  _refreshView() {
    const sortField = resolveSortField(this.resolvedColumns, this.sortedBy);
    const type = findColumnType(this.schemaColumns, sortField);
    let rows = mergeDraftsIntoRows(
      this._data,
      this.combinedDrafts,
      this.keyField
    );
    rows = enrichRecordLinkUrls(rows, this.schemaColumns, this.keyField);
    rows = this._applySearchAndFilters(rows);
    this.displayData = sortRows(rows, sortField, this.sortedDirection, type);
  }

  _applySearchAndFilters(rows) {
    let out = rows || [];
    const term = (this.searchTerm || "").trim().toLowerCase();
    if (term) {
      const fields =
        Array.isArray(this.searchFields) && this.searchFields.length
          ? this.searchFields
          : null;
      out = out.filter((row) => {
        const keys = fields || Object.keys(row || {});
        return keys.some((k) => {
          const v = row[k];
          if (v == null || typeof v === "object") {
            return false;
          }
          return String(v).toLowerCase().includes(term);
        });
      });
    }
    Object.keys(this.activeFilters || {}).forEach((name) => {
      const raw = this.activeFilters[name];
      if (raw === undefined || raw === null || raw === "") {
        return;
      }
      out = out.filter((row) => {
        const v = row[name];
        if (typeof raw === "boolean" || raw === "true" || raw === "false") {
          const want = raw === true || raw === "true";
          return (v === true || v === "true") === want;
        }
        return String(v ?? "") === String(raw);
      });
    });
    return out;
  }

  handleSearchInput(event) {
    this.searchTerm = event.target.value || "";
    this._refreshView();
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
    this.showColumnPanel = false;
  }

  toggleColumnPanel() {
    this.showColumnPanel = !this.showColumnPanel;
    this.showFilterPanel = false;
  }

  handleFilterTextChange(event) {
    const name = event.target.dataset.name;
    this.activeFilters = {
      ...this.activeFilters,
      [name]: event.target.value
    };
    this._refreshView();
  }

  handleFilterPicklistChange(event) {
    const name = event.target.dataset.name;
    this.activeFilters = {
      ...this.activeFilters,
      [name]: event.detail.value
    };
    this._refreshView();
  }

  handleFilterBooleanChange(event) {
    const name = event.target.dataset.name;
    this.activeFilters = {
      ...this.activeFilters,
      [name]: event.target.checked === true
    };
    this._refreshView();
  }

  clearFilter(event) {
    const name = event.currentTarget.dataset.name;
    const next = { ...this.activeFilters };
    delete next[name];
    this.activeFilters = next;
    this._refreshView();
  }

  clearAllFilters() {
    this.activeFilters = {};
    this._refreshView();
  }

  handleColumnToggle(event) {
    const field = event.target.dataset.field;
    const checked = event.target.checked === true;
    this.hiddenFields = {
      ...this.hiddenFields,
      [field]: !checked
    };
    this._refreshView();
  }

  handleHeaderActionClick(event) {
    const name = event.currentTarget?.dataset?.name;
    if (!name) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("headeraction", {
        detail: {
          name,
          selectedRows: this.selectedRows
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleRefreshClick() {
    this.dispatchEvent(
      new CustomEvent("headeraction", {
        detail: {
          name: "refresh",
          selectedRows: this.selectedRows
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortedDirection = event.detail.sortDirection;
    this._refreshView();
    this.dispatchEvent(
      new CustomEvent("sort", {
        detail: {
          fieldName: resolveSortField(this.resolvedColumns, this.sortedBy),
          sortDirection: this.sortedDirection
        },
        bubbles: true,
        composed: true
      })
    );
  }

  handleRowSelection(event) {
    this.dispatchEvent(
      new CustomEvent("rowselection", {
        detail: event.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  handleCellChange(event) {
    this._accumulateDrafts(event.detail?.draftValues || []);
    this.dispatchEvent(
      new CustomEvent("cellchange", {
        detail: { draftValues: this._internalDrafts },
        bubbles: true,
        composed: true
      })
    );
  }

  handleComboValueChange(event) {
    this._accumulateDrafts(event.detail?.draftValues || []);
    this.dispatchEvent(
      new CustomEvent("combovaluechange", {
        detail: { draftValues: this._internalDrafts },
        bubbles: true,
        composed: true
      })
    );
  }

  handleRowAction(event) {
    this.dispatchEvent(
      new CustomEvent("rowaction", {
        detail: event.detail,
        bubbles: true,
        composed: true
      })
    );
  }

  handleFooterSave() {
    const drafts = [...this._internalDrafts];
    this.dispatchEvent(
      new CustomEvent("save", {
        detail: { draftValues: drafts },
        bubbles: true,
        composed: true
      })
    );
    this._data = mergeDraftsIntoRows(this._data, drafts, this.keyField);
    this._internalDrafts = [];
    this._refreshView();
  }

  handleFooterCancel() {
    this._internalDrafts = [];
    this._refreshView();
    this.dispatchEvent(
      new CustomEvent("cancel", {
        detail: {},
        bubbles: true,
        composed: true
      })
    );
  }

  handleDatatableSave(event) {
    this._accumulateDrafts(event.detail?.draftValues || []);
    this.handleFooterSave();
  }

  _accumulateDrafts(incoming) {
    if (!incoming?.length) {
      return;
    }
    this._internalDrafts = mergeDraftMaps(
      this._internalDrafts,
      incoming,
      this.keyField
    );
    this._refreshView();
  }

  @api
  checkValidity() {
    const rows = mergeDraftsIntoRows(
      this._data,
      this.combinedDrafts,
      this.keyField
    );
    const result = validateRows(rows, this.schemaColumns, this.keyField);
    this._validationErrors = result.errors;
    this._lastValidity = result.valid && !(this.errors || []).length;
    return this._lastValidity;
  }

  @api
  reportValidity() {
    return this.checkValidity();
  }

  @api
  getValidationErrors() {
    return mergeHostErrors(this._validationErrors, this.errors);
  }

  @api
  clearDrafts() {
    this._internalDrafts = [];
    this._refreshView();
  }
}

function mergeDraftMaps(existing, incoming, keyField) {
  const map = new Map();
  (existing || []).forEach((d) => {
    if (d && d[keyField] != null) {
      map.set(d[keyField], { ...d });
    }
  });
  (incoming || []).forEach((d) => {
    if (!d || d[keyField] == null) {
      return;
    }
    const prev = map.get(d[keyField]) || { [keyField]: d[keyField] };
    map.set(d[keyField], { ...prev, ...d });
  });
  return Array.from(map.values());
}
