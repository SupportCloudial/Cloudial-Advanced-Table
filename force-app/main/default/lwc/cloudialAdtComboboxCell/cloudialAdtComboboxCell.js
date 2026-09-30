import { LightningElement, api } from "lwc";

export default class CloudialAdtComboboxCell extends LightningElement {
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  @api picklistValues;
  @api value;
  @api alignment = "slds-text-align_left";

  editMode = false;

  get isEditable() {
    return this.editable === true || this.editable === "true";
  }

  get readOnlyRole() {
    return this.isEditable ? "button" : null;
  }

  get readOnlyTabIndex() {
    return this.isEditable ? "0" : null;
  }

  get displayLabel() {
    const current = this.value;
    const map = this.picklistValues || {};
    if (current == null || current === "") {
      return "";
    }
    for (const label of Object.keys(map)) {
      if (map[label] === current) {
        return label;
      }
    }
    return String(current);
  }

  get optionsForRender() {
    const map = this.picklistValues || {};
    return Object.keys(map).map((label) => ({
      label,
      value: map[label],
      selected: map[label] === this.value
    }));
  }

  get cellClass() {
    let cls =
      "adt-cell adt-cell_editable slds-grid slds-grid_vertical-align-center slds-p-horizontal_x-small";
    if (String(this.alignment).includes("center")) {
      cls += " slds-grid_align-center";
    }
    return cls;
  }

  enterEdit() {
    if (!this.isEditable) {
      return;
    }
    this.editMode = true;
  }

  handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.enterEdit();
    }
  }

  handleChange(event) {
    const selectedValue = event.target.value;
    this.editMode = false;
    this.dispatchEvent(
      new CustomEvent("combovaluechange", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          draftValues: [
            {
              [this.fieldName]: selectedValue,
              [this.keyField]: this.keyFieldValue
            }
          ]
        }
      })
    );
  }
}
