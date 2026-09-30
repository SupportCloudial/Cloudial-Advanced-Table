import { LightningElement, api } from "lwc";

export default class CloudialAdtVipCell extends LightningElement {
  @api value;
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;

  get isEditable() {
    return this.editable === true || this.editable === "true";
  }

  get isDisabled() {
    return !this.isEditable;
  }

  get isVip() {
    return this.value === true || this.value === "true";
  }

  get buttonClass() {
    return this.isVip
      ? "adt-vip adt-vip_on"
      : "adt-vip adt-vip_off";
  }

  get label() {
    return this.isVip ? "VIP" : "Standard";
  }

  get iconName() {
    return this.isVip ? "utility:favorite" : "utility:favorite_alt";
  }

  toggle() {
    if (!this.isEditable) {
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
              [this.fieldName]: !this.isVip,
              [this.keyField]: this.keyFieldValue
            }
          ]
        }
      })
    );
  }
}
