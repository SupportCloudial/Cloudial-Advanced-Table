import { LightningElement, api } from "lwc";
import LABEL_ON from "@salesforce/label/c.CloudialAdt_BooleanOn";
import LABEL_OFF from "@salesforce/label/c.CloudialAdt_BooleanOff";

/**
 * Generic boolean toggle badge. Labels/icons come from the host column def
 * (or packaged On/Off defaults) — not domain-specific VIP wording.
 */
export default class CloudialAdtBooleanBadgeCell extends LightningElement {
  @api value;
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  /** Host override; empty uses packaged On label */
  @api trueLabel;
  /** Host override; empty uses packaged Off label */
  @api falseLabel;
  @api trueIconName = "utility:check";
  @api falseIconName = "utility:close";

  get isEditable() {
    return this.editable === true || this.editable === "true";
  }

  get isDisabled() {
    return !this.isEditable;
  }

  get isTrue() {
    return this.value === true || this.value === "true";
  }

  get label() {
    if (this.isTrue) {
      return this.trueLabel || LABEL_ON;
    }
    return this.falseLabel || LABEL_OFF;
  }

  get iconName() {
    return this.isTrue
      ? this.trueIconName || "utility:check"
      : this.falseIconName || "utility:close";
  }

  get buttonClass() {
    return this.isTrue
      ? "adt-boolean-badge adt-boolean-badge_on"
      : "adt-boolean-badge adt-boolean-badge_off";
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
              [this.fieldName]: !this.isTrue,
              [this.keyField]: this.keyFieldValue
            }
          ]
        }
      })
    );
  }
}
