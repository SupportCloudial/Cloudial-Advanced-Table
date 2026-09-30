import { LightningElement, api } from "lwc";

export default class CloudialAdtActionCell extends LightningElement {
  @api iconName = "utility:delete";
  @api iconSrc;
  @api name = "row-action";
  @api keyField;
  @api keyFieldValue;
  @api disabled = false;
  @api hidden = false;
  @api tooltip = "";
  @api alternativeText = "Action";
  @api variant = "bare";
  @api size = "small";

  get isHidden() {
    return this.hidden === true || this.hidden === "true";
  }

  get isDisabled() {
    return this.disabled === true || this.disabled === "true";
  }

  handleClick() {
    if (this.isDisabled || this.isHidden) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("rowaction", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          action: { name: this.name },
          row: { [this.keyField]: this.keyFieldValue }
        }
      })
    );
  }
}
