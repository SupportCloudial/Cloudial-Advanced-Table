import { LightningElement, api } from "lwc";

export default class CloudialAdtBooleanCell extends LightningElement {
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  @api value;

  get checked() {
    return this.value === true || this.value === "true";
  }

  get isDisabled() {
    return !(this.editable === true || this.editable === "true");
  }

  handleChange(event) {
    if (this.isDisabled) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("cellchange", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          draftValues: [
            {
              [this.fieldName]: event.target.checked === true,
              [this.keyField]: this.keyFieldValue
            }
          ]
        }
      })
    );
  }
}
