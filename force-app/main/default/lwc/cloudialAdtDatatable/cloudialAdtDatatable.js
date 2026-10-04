import LightningDatatable from "lightning/datatable";
import comboboxType from "./comboboxType.html";
import pencilEditableType from "./pencilEditableType.html";
import booleanCheckboxType from "./booleanCheckboxType.html";
import actionWithTooltipType from "./actionWithTooltipType.html";
import dualActionWithTooltipType from "./dualActionWithTooltipType.html";
import statusIconType from "./statusIconType.html";
import scoreMeterType from "./scoreMeterType.html";
import booleanBadgeType from "./booleanBadgeType.html";
import vipBadgeType from "./vipBadgeType.html";

const POLISH = `
  table tbody td {
    vertical-align: middle !important;
    height: 2.75rem !important;
    padding-top: 0.35rem !important;
    padding-bottom: 0.35rem !important;
  }
  table tbody tr:hover > td {
    background-color: #f3f9ff !important;
  }
  table tbody tr[aria-selected="true"] > td,
  table tbody tr.slds-is-selected > td {
    background-color: #eaf5fe !important;
  }
  /* Name / record links slightly more prominent */
  table tbody td a {
    font-weight: 600 !important;
    color: #0176d3 !important;
  }
  /* Hide sort chevrons until hover / active sort */
  table thead th .slds-icon_container {
    opacity: 0 !important;
    transition: opacity 0.12s ease;
  }
  table thead th:hover .slds-icon_container,
  table thead th[aria-sort="ascending"] .slds-icon_container,
  table thead th[aria-sort="descending"] .slds-icon_container {
    opacity: 1 !important;
  }
  table thead th[aria-sort="ascending"],
  table thead th[aria-sort="descending"] {
    box-shadow: inset 0 -2px 0 #0176d3 !important;
  }
`;

const THEME_STYLES = {
  default: `
    ${POLISH}
    table thead th {
      background: #f3f3f3 !important;
      color: #181818 !important;
      font-size: 0.8125rem !important;
    }
    table tbody td {
      font-size: 0.8125rem !important;
    }
  `,
  dense: `
    ${POLISH}
    table thead th {
      background: #e5e5e5 !important;
      font-size: 0.7rem !important;
    }
    table tbody td {
      font-size: 0.7rem !important;
      height: 2rem !important;
    }
  `,
  glass: `
    ${POLISH}
    table thead th {
      background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(186,230,253,0.55)) !important;
      color: #0c4a6e !important;
    }
    table tbody td {
      background: rgba(255,255,255,0.45) !important;
    }
  `,
  soft: `
    ${POLISH}
    table thead th {
      background: #eef4fb !important;
      color: #16325c !important;
      border-bottom: 1px solid #d8e6f5 !important;
      font-size: 0.8125rem !important;
    }
    table tbody td {
      background: #ffffff !important;
      border-bottom: 1px solid #eef1f6 !important;
      font-size: 0.8125rem !important;
    }
    table tbody tr:hover > td {
      background: #f5f9fd !important;
    }
  `,
  highContrast: `
    ${POLISH}
    table thead th {
      background: #000000 !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      border: 2px solid #000000 !important;
    }
    table thead th *,
    table thead th .slds-truncate,
    table thead th a {
      color: #ffffff !important;
      fill: #ffffff !important;
    }
    table thead th .slds-icon_container {
      opacity: 1 !important;
    }
    table tbody td {
      background: #ffffff !important;
      color: #000000 !important;
      font-weight: 600 !important;
      border: 2px solid #000000 !important;
    }
    table tbody tr:hover > td {
      background: #ffff00 !important;
    }
  `,
  custom: `
    ${POLISH}
    table thead th {
      background: var(--cloudial-adt-header-bg, #f3f3f3) !important;
      color: var(--cloudial-adt-header-text, #181818) !important;
    }
    table tbody tr:hover > td {
      background: var(--cloudial-adt-row-hover, #f3f9ff) !important;
    }
  `
};

export default class CloudialAdtDatatable extends LightningDatatable {
  static customTypes = {
    combobox: {
      template: comboboxType,
      standardCellLayout: false,
      typeAttributes: [
        "editable",
        "fieldName",
        "keyField",
        "keyFieldValue",
        "picklistValues",
        "alignment"
      ]
    },
    pencilEditable: {
      template: pencilEditableType,
      standardCellLayout: false,
      typeAttributes: [
        "editable",
        "fieldName",
        "keyField",
        "keyFieldValue",
        "inputType",
        "step",
        "alignment"
      ]
    },
    booleanCheckbox: {
      template: booleanCheckboxType,
      standardCellLayout: false,
      typeAttributes: ["editable", "fieldName", "keyField", "keyFieldValue"]
    },
    actionWithTooltip: {
      template: actionWithTooltipType,
      standardCellLayout: true,
      typeAttributes: [
        "iconName",
        "iconSrc",
        "name",
        "keyField",
        "keyFieldValue",
        "disabled",
        "hidden",
        "tooltip",
        "alternativeText",
        "variant",
        "size"
      ]
    },
    dualActionWithTooltip: {
      template: dualActionWithTooltipType,
      standardCellLayout: true,
      typeAttributes: [
        "keyField",
        "keyFieldValue",
        "leftIconName",
        "leftIconSrc",
        "leftName",
        "leftDisabled",
        "leftHidden",
        "leftTooltip",
        "leftAlternativeText",
        "rightIconName",
        "rightIconSrc",
        "rightName",
        "rightDisabled",
        "rightHidden",
        "rightTooltip",
        "rightAlternativeText",
        "variant",
        "size"
      ]
    },
    statusIcon: {
      template: statusIconType,
      standardCellLayout: true,
      typeAttributes: ["icons"]
    },
    scoreMeter: {
      template: scoreMeterType,
      standardCellLayout: false,
      typeAttributes: [
        "editable",
        "fieldName",
        "keyField",
        "keyFieldValue",
        "max"
      ]
    },
    booleanBadge: {
      template: booleanBadgeType,
      standardCellLayout: false,
      typeAttributes: [
        "editable",
        "fieldName",
        "keyField",
        "keyFieldValue",
        "trueLabel",
        "falseLabel",
        "trueIconName",
        "falseIconName"
      ]
    },
    /** @deprecated Alias of booleanBadge — prefer type: 'booleanBadge' + host labels. */
    vipBadge: {
      template: vipBadgeType,
      standardCellLayout: false,
      typeAttributes: [
        "editable",
        "fieldName",
        "keyField",
        "keyFieldValue",
        "trueLabel",
        "falseLabel",
        "trueIconName",
        "falseIconName"
      ]
    }
  };

  renderedCallback() {
    if (typeof super.renderedCallback === "function") {
      super.renderedCallback();
    }
    this._injectThemeStyles();
  }

  _injectThemeStyles() {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }
    const theme = this.getAttribute("data-cloudial-theme") || "default";
    const css = THEME_STYLES[theme] || THEME_STYLES.default;
    let styleEl = root.querySelector("style[data-cloudial-adt-theme]");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.setAttribute("data-cloudial-adt-theme", "1");
      root.appendChild(styleEl);
    }
    if (styleEl.dataset.appliedTheme === theme && styleEl.textContent) {
      return;
    }
    styleEl.dataset.appliedTheme = theme;
    styleEl.textContent = css;
  }
}
