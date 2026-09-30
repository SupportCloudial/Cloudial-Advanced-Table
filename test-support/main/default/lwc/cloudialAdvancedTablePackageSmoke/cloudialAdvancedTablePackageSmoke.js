import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const STATUS_OPTIONS = {
  New: "New",
  Working: "Working",
  Closed: "Closed"
};

export default class CloudialAdvancedTablePackageSmoke extends LightningElement {
  keyField = "id";
  theme = "soft";
  title = "Package smoke";

  get headerActions() {
    return [
      { name: "new", label: "New", variant: "brand", iconName: "utility:add" },
      {
        name: "refresh",
        label: "Refresh",
        variant: "neutral",
        iconName: "utility:refresh"
      }
    ];
  }

  @track selectedRows = [];
  @track rows = [
    {
      id: "1",
      name: "Alpha Desk",
      status: "New",
      amount: 1200,
      active: true,
      statusIcons: [
        {
          iconName: "utility:new",
          tooltip: "New",
          alternativeText: "New"
        }
      ]
    },
    {
      id: "2",
      name: "Beta Suite",
      status: "Working",
      amount: 3400.5,
      active: false,
      statusIcons: [
        {
          iconName: "utility:warning",
          tooltip: "Needs review",
          alternativeText: "Warning"
        }
      ]
    },
    {
      id: "3",
      name: "Gamma Parking",
      status: "Closed",
      amount: 450,
      active: true,
      statusIcons: []
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
        field: "statusIcons",
        label: "",
        type: "statusIcon",
        iconsField: "statusIcons",
        initialWidth: 64,
        hideDefaultActions: true
      },
      {
        field: "name",
        label: "Name",
        type: "text",
        recordLink: true,
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
        message: "In-memory rows updated (package smoke).",
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
