import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const STATUS_OPTIONS = {
  New: "New",
  Working: "Working",
  Closed: "Closed"
};

/**
 * Unpackaged i18n/RTL smoke: uses local c-cloudial-advanced-table (not managed tag).
 * Deploy force-app with namespace temporarily cleared, then this harness.
 */
export default class CloudialAdvancedTableI18nSmoke extends LightningElement {
  keyField = "id";
  theme = "soft";
  title = "i18n smoke";

  get headerActions() {
    return [
      { name: "new", label: "New", variant: "brand", iconName: "utility:add" }
    ];
  }

  get bulkActions() {
    return [
      {
        name: "bulkEdit",
        label: "Bulk Edit",
        variant: "neutral",
        iconName: "utility:edit"
      }
    ];
  }

  get filterDefs() {
    return [
      {
        name: "status",
        label: "Status",
        type: "picklist",
        options: [
          { label: "New", value: "New" },
          { label: "Working", value: "Working" },
          { label: "Closed", value: "Closed" }
        ]
      },
      { name: "active", label: "Active", type: "boolean" }
    ];
  }

  @track selectedRows = [];
  @track rows = [
    {
      id: "1",
      name: "Alpha Desk",
      status: "New",
      amount: 1200,
      active: true
    },
    {
      id: "2",
      name: "Beta Suite",
      status: "Working",
      amount: 3400.5,
      active: false
    },
    {
      id: "3",
      name: "Gamma Parking",
      status: "Closed",
      amount: 450,
      active: true
    }
  ];

  get columnDefs() {
    return [
      {
        type: "dualActionWithTooltip",
        fixedWidth: 72,
        leftIconName: "utility:preview",
        leftName: "view",
        leftTooltip: "View",
        rightIconName: "utility:delete",
        rightName: "delete",
        rightTooltip: "Delete"
      },
      {
        field: "name",
        label: "Name",
        type: "text",
        sortable: true,
        initialWidth: 160,
        validation: { required: true }
      },
      {
        field: "status",
        label: "Status",
        type: "combobox",
        editable: true,
        sortable: true,
        picklistValues: STATUS_OPTIONS,
        initialWidth: 140
      },
      {
        field: "amount",
        label: "Amount",
        type: "pencilEditable",
        editable: true,
        sortable: true,
        inputType: "currency",
        initialWidth: 140,
        validation: { min: 0 }
      },
      {
        field: "active",
        label: "Active",
        type: "booleanCheckbox",
        editable: true,
        sortable: true,
        initialWidth: 90
      }
    ];
  }

  handleSave(event) {
    const drafts = event.detail?.draftValues || [];
    this.rows = this.rows.map((row) => {
      const draft = drafts.find((d) => d.id === row.id);
      return draft ? { ...row, ...draft } : row;
    });
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Saved",
        message: "In-memory rows updated (i18n smoke).",
        variant: "success"
      })
    );
  }

  handleRowSelection(event) {
    this.selectedRows = (event.detail?.selectedRows || []).map((r) => r.id);
  }

  handleRowAction(event) {
    if (event.detail?.action?.name === "delete") {
      const id = event.detail?.row?.id;
      this.rows = this.rows.filter((r) => r.id !== id);
    }
  }

  handleHeaderAction(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Header action",
        message: event.detail?.name || "unknown",
        variant: "info"
      })
    );
  }

}
