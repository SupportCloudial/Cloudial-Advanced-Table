import { LightningElement, api } from "lwc";
import LABEL_EDIT from "@salesforce/label/c.CloudialAdt_Edit";
import LABEL_EDIT_VALUE from "@salesforce/label/c.CloudialAdt_EditValue";

export default class CloudialAdtPencilCell extends LightningElement {
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  @api value;
  @api inputType = "text";
  @api step = "any";
  @api alignment = "slds-text-align_left";

  labels = {
    edit: LABEL_EDIT,
    editValue: LABEL_EDIT_VALUE
  };

  editMode = false;
  editorValue = "";

  get isEditable() {
    return this.editable === true || this.editable === "true";
  }

  get readOnlyRole() {
    return this.isEditable ? "button" : null;
  }

  get readOnlyTabIndex() {
    return this.isEditable ? "0" : null;
  }

  get nativeInputType() {
    return this.inputType === "currency" ? "number" : this.inputType || "text";
  }

  get displayValue() {
    if (this.value === null || this.value === undefined || this.value === "") {
      return "";
    }
    if (this.inputType === "currency") {
      const n = Number(this.value);
      if (Number.isNaN(n)) {
        return String(this.value);
      }
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return String(this.value);
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
    this.editorValue = this.value == null ? "" : String(this.value);
    this.editMode = true;
  }

  handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.enterEdit();
    }
  }

  handleEditorKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.commit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.editMode = false;
    }
  }

  handleBlur() {
    this.commit();
  }

  handleInput(event) {
    this.editorValue = event.target.value;
  }

  commit() {
    if (!this.editMode) {
      return;
    }
    this.editMode = false;
    let next = this.editorValue;
    if (this.inputType === "number" || this.inputType === "currency") {
      next = next === "" ? null : Number(next);
    }
    this.dispatchEvent(
      new CustomEvent("cellchange", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          draftValues: [
            {
              [this.fieldName]: next,
              [this.keyField]: this.keyFieldValue
            }
          ]
        }
      })
    );
  }
}
