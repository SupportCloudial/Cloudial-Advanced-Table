/**
 * Pure helpers for Cloudial Advanced Table.
 * Keep these functions `this`-free for Jest unit tests.
 */

import LABEL_EDIT from "@salesforce/label/c.CloudialAdt_Edit";
import LABEL_DELETE from "@salesforce/label/c.CloudialAdt_Delete";
import LABEL_BOOLEAN_ON from "@salesforce/label/c.CloudialAdt_BooleanOn";
import LABEL_BOOLEAN_OFF from "@salesforce/label/c.CloudialAdt_BooleanOff";

const CUSTOM_TYPES = new Set([
  "combobox",
  "pencilEditable",
  "booleanCheckbox",
  "actionWithTooltip",
  "dualActionWithTooltip",
  "statusIcon",
  "scoreMeter",
  "booleanBadge",
  "vipBadge"
]);

/** Merge draft value objects keyed by keyField into a copy of rows. */
export function mergeDraftsIntoRows(rows, draftValues, keyField = "id") {
  const drafts = Array.isArray(draftValues) ? draftValues : [];
  if (!drafts.length) {
    return Array.isArray(rows) ? [...rows] : [];
  }
  return (rows || []).map((row) => {
    const key = row?.[keyField];
    const draft = drafts.find((d) => d && d[keyField] === key);
    return draft ? { ...row, ...draft } : { ...row };
  });
}

/**
 * Ensure record-link URL fields exist on each row.
 * Uses /{recordId} which Lightning resolves to the record home.
 */
export function enrichRecordLinkUrls(rows, columnDefs, keyField = "id") {
  const cols = (columnDefs || []).filter(
    (c) => c && (c.recordLink === true || c.type === "recordLink")
  );
  if (!cols.length) {
    return rows;
  }
  return (rows || []).map((row) => {
    const out = { ...row };
    cols.forEach((col) => {
      const labelField = col.fieldName || col.field;
      const urlField = col.urlField || `${labelField}Url`;
      const idField = col.recordIdField || keyField;
      const id = row?.[idField];
      if (id != null && id !== "" && !out[urlField]) {
        out[urlField] = `/${id}`;
      }
    });
    return out;
  });
}

const NUMERIC_TYPES = new Set([
  "number",
  "currency",
  "percent",
  "pencilEditable",
  "scoreMeter"
]);

const BOOLEAN_TYPES = new Set([
  "boolean",
  "booleanCheckbox",
  "booleanBadge",
  "vipBadge"
]);

const DATE_TYPES = new Set(["date", "date-local"]);

export function normalizeTheme(theme) {
  const allowed = new Set([
    "default",
    "dense",
    "glass",
    "soft",
    "highContrast",
    "custom"
  ]);
  const t = (theme || "default").toString().trim();
  return allowed.has(t) ? t : "default";
}

/**
 * Map Cloudial column schema → lightning-datatable column defs.
 * If a column already looks like a native datatable column (has fieldName),
 * pass it through with light defaults.
 */
export function mapColumns(columnDefs, options = {}) {
  const keyField = options.keyField || "id";
  const list = Array.isArray(columnDefs) ? columnDefs : [];
  return list.map((col) => mapOneColumn(col, keyField));
}

function mapOneColumn(col, keyField) {
  if (!col || typeof col !== "object") {
    return col;
  }
  // Raw passthrough: already has fieldName and no Cloudial `field` alias
  if (col.fieldName && col.field === undefined) {
    return {
      ...col,
      sortable: col.sortable !== false
    };
  }

  const fieldName = col.fieldName || col.field;
  const type = col.type || "text";
  const editable = col.editable === true;
  const mapped = {
    label: col.label !== undefined && col.label !== null ? col.label : fieldName || "",
    fieldName,
    type: CUSTOM_TYPES.has(type) ? type : type,
    sortable: col.sortable !== false,
    editable: editable,
    wrapText: col.wrapText === true,
    hideDefaultActions: col.hideDefaultActions === true,
    initialWidth: col.initialWidth,
    fixedWidth: col.fixedWidth,
    cellAttributes: col.cellAttributes || undefined
  };

  if (col.typeAttributes) {
    mapped.typeAttributes = { ...col.typeAttributes };
  }

  // Record hyperlink: label field shown as link to the record
  if (col.recordLink === true || type === "recordLink") {
    const urlField = col.urlField || `${fieldName}Url`;
    mapped.type = "url";
    mapped.fieldName = urlField;
    mapped._sortField = fieldName;
    mapped.typeAttributes = {
      label: { fieldName },
      target: col.linkTarget || "_self",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "combobox") {
    mapped.type = "combobox";
    mapped.typeAttributes = {
      editable: editable,
      fieldName,
      keyField,
      keyFieldValue: { fieldName: keyField },
      picklistValues: col.picklistValues || col.typeAttributes?.picklistValues,
      alignment: col.alignment || "slds-text-align_left",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "pencilEditable") {
    mapped.type = "pencilEditable";
    mapped.typeAttributes = {
      editable: editable,
      fieldName,
      keyField,
      keyFieldValue: { fieldName: keyField },
      inputType: col.inputType || "text",
      step: col.step || "any",
      alignment: col.alignment || "slds-text-align_left",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "booleanCheckbox") {
    mapped.type = "booleanCheckbox";
    mapped.typeAttributes = {
      editable: editable,
      fieldName,
      keyField,
      keyFieldValue: { fieldName: keyField },
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "actionWithTooltip") {
    mapped.type = "actionWithTooltip";
    mapped.sortable = false;
    mapped.typeAttributes = {
      iconName: col.iconName || "utility:delete",
      name: col.actionName || "row-action",
      keyField,
      keyFieldValue: { fieldName: keyField },
      disabled:
        col.disabled !== undefined
          ? col.disabled
          : col.typeAttributes?.disabled || false,
      hidden:
        col.hidden !== undefined
          ? col.hidden
          : col.typeAttributes?.hidden || false,
      tooltip: col.tooltip || "",
      alternativeText: col.alternativeText || col.tooltip || "Action",
      variant: col.variant || "bare",
      size: col.size || "small",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "dualActionWithTooltip") {
    mapped.type = "dualActionWithTooltip";
    mapped.sortable = false;
    mapped.typeAttributes = {
      keyField,
      keyFieldValue: { fieldName: keyField },
      leftIconName: col.leftIconName || "utility:edit",
      leftIconSrc: col.leftIconSrc,
      leftName: col.leftName || "left-action",
      leftDisabled:
        col.leftDisabled !== undefined
          ? col.leftDisabled
          : col.typeAttributes?.leftDisabled || false,
      leftHidden:
        col.leftHidden !== undefined
          ? col.leftHidden
          : col.typeAttributes?.leftHidden || false,
      leftTooltip: col.leftTooltip || LABEL_EDIT,
      leftAlternativeText: col.leftAlternativeText || LABEL_EDIT,
      rightIconName: col.rightIconName || "utility:delete",
      rightIconSrc: col.rightIconSrc,
      rightName: col.rightName || "right-action",
      rightDisabled:
        col.rightDisabled !== undefined
          ? col.rightDisabled
          : col.typeAttributes?.rightDisabled || false,
      rightHidden:
        col.rightHidden !== undefined
          ? col.rightHidden
          : col.typeAttributes?.rightHidden || false,
      rightTooltip: col.rightTooltip || LABEL_DELETE,
      rightAlternativeText: col.rightAlternativeText || LABEL_DELETE,
      variant: col.variant || "bare",
      size: col.size || "small",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "statusIcon") {
    mapped.type = "statusIcon";
    mapped.sortable = false;
    mapped.typeAttributes = {
      icons: { fieldName: col.iconsField || "statusIcons" },
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "scoreMeter") {
    mapped.type = "scoreMeter";
    mapped.typeAttributes = {
      editable: editable,
      fieldName,
      keyField,
      keyFieldValue: { fieldName: keyField },
      max: col.max != null ? col.max : 100,
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "booleanBadge" || type === "vipBadge") {
    // vipBadge kept as alias for managed upgrades; prefer booleanBadge.
    mapped.type = type === "vipBadge" ? "vipBadge" : "booleanBadge";
    const trueLabel =
      col.trueLabel ||
      col.typeAttributes?.trueLabel ||
      LABEL_BOOLEAN_ON;
    const falseLabel =
      col.falseLabel ||
      col.typeAttributes?.falseLabel ||
      LABEL_BOOLEAN_OFF;
    mapped.typeAttributes = {
      editable: editable,
      fieldName,
      keyField,
      keyFieldValue: { fieldName: keyField },
      trueLabel,
      falseLabel,
      trueIconName:
        col.trueIconName ||
        col.typeAttributes?.trueIconName ||
        "utility:check",
      falseIconName:
        col.falseIconName ||
        col.typeAttributes?.falseIconName ||
        "utility:close",
      ...(mapped.typeAttributes || {})
    };
  } else if (type === "rowMenu" || type === "action") {
    mapped.type = "action";
    mapped.sortable = false;
    mapped.fixedWidth = col.fixedWidth || 52;
    mapped.hideDefaultActions = true;
    mapped.typeAttributes = {
      rowActions: col.rowActions || col.typeAttributes?.rowActions || [],
      menuAlignment: col.menuAlignment || "auto",
      ...(mapped.typeAttributes || {})
    };
  }

  // Strip undefined keys that confuse datatable
  Object.keys(mapped).forEach((k) => {
    if (mapped[k] === undefined) {
      delete mapped[k];
    }
  });
  return mapped;
}

export function compareValues(a, b, columnType) {
  const emptyA = a === null || a === undefined || a === "";
  const emptyB = b === null || b === undefined || b === "";
  if (emptyA && emptyB) return 0;
  if (emptyA) return 1;
  if (emptyB) return -1;

  if (BOOLEAN_TYPES.has(columnType)) {
    return Number(Boolean(a)) - Number(Boolean(b));
  }

  if (NUMERIC_TYPES.has(columnType) || typeof a === "number" || typeof b === "number") {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      return na - nb;
    }
  }

  if (DATE_TYPES.has(columnType)) {
    const da = Date.parse(a);
    const db = Date.parse(b);
    if (!Number.isNaN(da) && !Number.isNaN(db)) {
      return da - db;
    }
  }

  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base"
  });
}

export function sortRows(rows, sortedBy, sortedDirection, columnType) {
  const list = Array.isArray(rows) ? [...rows] : [];
  if (!sortedBy) {
    return list;
  }
  const dir = (sortedDirection || "asc").toLowerCase() === "desc" ? -1 : 1;
  list.sort((ra, rb) => {
    const cmp = compareValues(ra?.[sortedBy], rb?.[sortedBy], columnType);
    return cmp * dir;
  });
  return list;
}

export function findColumnType(columns, fieldName) {
  const col = (columns || []).find(
    (c) =>
      c.fieldName === fieldName ||
      c.field === fieldName ||
      c._sortField === fieldName
  );
  if (!col) {
    return "text";
  }
  if (col.recordLink === true || col.type === "recordLink" || col.type === "url") {
    return "text";
  }
  return col.type || "text";
}

/** Which row property to sort when a column header is clicked. */
export function resolveSortField(columns, fieldName) {
  const col = (columns || []).find(
    (c) => c.fieldName === fieldName || c.field === fieldName
  );
  return col?._sortField || fieldName;
}

/**
 * Validate rows against column validation rules.
 * Returns { valid, errors: [{ key, field, message }] }
 */
export function validateRows(rows, columns, keyField = "id") {
  const errors = [];
  const cols = (columns || []).filter((c) => c && c.validation);
  const data = Array.isArray(rows) ? rows : [];

  data.forEach((row) => {
    const key = row?.[keyField];
    cols.forEach((col) => {
      const field = col.fieldName || col.field;
      const rules = col.validation || {};
      const value = row?.[field];
      const message = validateValue(value, rules);
      if (message) {
        errors.push({
          key,
          field,
          message: rules.message || message
        });
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

function validateValue(value, rules) {
  const empty = value === null || value === undefined || value === "";
  if (rules.required && empty) {
    return "This field is required.";
  }
  if (empty) {
    return null;
  }
  if (rules.min !== undefined && Number(value) < Number(rules.min)) {
    return `Must be at least ${rules.min}.`;
  }
  if (rules.max !== undefined && Number(value) > Number(rules.max)) {
    return `Must be at most ${rules.max}.`;
  }
  if (rules.pattern) {
    try {
      const re = new RegExp(rules.pattern);
      if (!re.test(String(value))) {
        return "Value does not match the required pattern.";
      }
    } catch (e) {
      // Invalid pattern from host — skip rather than throw
    }
  }
  return null;
}

export function mergeHostErrors(validationErrors, hostErrors) {
  const out = [...(validationErrors || [])];
  const host = Array.isArray(hostErrors) ? hostErrors : [];
  host.forEach((e) => {
    if (e && e.field) {
      out.push({
        key: e.key,
        field: e.field,
        message: e.message || "Invalid value."
      });
    }
  });
  return out;
}
