import { LightningElement, api } from "lwc";
import LABEL_EDIT from "@salesforce/label/c.CloudialAdt_Edit";
import LABEL_EDIT_SCORE from "@salesforce/label/c.CloudialAdt_EditScore";

export default class CloudialAdtScoreCell extends LightningElement {
  @api value;
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  @api max = 100;

  labels = {
    edit: LABEL_EDIT,
    editScore: LABEL_EDIT_SCORE
  };

  editMode = false;
  editorValue = "";

  get isEditable() {
    return this.editable === true || this.editable === "true";
  }

  get numericValue() {
    const n = Number(this.value);
    return Number.isNaN(n) ? 0 : n;
  }

  get maxValue() {
    const m = Number(this.max);
    return !m || Number.isNaN(m) ? 100 : m;
  }

  get percent() {
    const pct = Math.round((this.numericValue / this.maxValue) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  get meterStyle() {
    return `width:${this.percent}%`;
  }

  get displayValue() {
    return this.value == null || this.value === "" ? "" : String(this.value);
  }

  enterEdit() {
    if (!this.isEditable) {
      return;
    }
    this.editorValue = this.value == null ? "" : String(this.value);
    this.editMode = true;
  }

  handleInput(event) {
    this.editorValue = event.target.value;
  }

  handleBlur() {
    this.commit();
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.commit();
    } else if (event.key === "Escape") {
      this.editMode = false;
    }
  }

  commit() {
    if (!this.editMode) {
      return;
    }
    this.editMode = false;
    const next = this.editorValue === "" ? null : Number(this.editorValue);
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
