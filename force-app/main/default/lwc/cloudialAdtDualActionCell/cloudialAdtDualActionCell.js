import { LightningElement, api } from "lwc";
import LABEL_EDIT from "@salesforce/label/c.CloudialAdt_Edit";
import LABEL_DELETE from "@salesforce/label/c.CloudialAdt_Delete";

export default class CloudialAdtDualActionCell extends LightningElement {
  @api keyField;
  @api keyFieldValue;
  @api leftIconName = "utility:edit";
  @api leftIconSrc;
  @api leftName = "left-action";
  @api leftDisabled = false;
  @api leftHidden = false;
  @api leftTooltip = LABEL_EDIT;
  @api leftAlternativeText = LABEL_EDIT;
  @api rightIconName = "utility:delete";
  @api rightIconSrc;
  @api rightName = "right-action";
  @api rightDisabled = false;
  @api rightHidden = false;
  @api rightTooltip = LABEL_DELETE;
  @api rightAlternativeText = LABEL_DELETE;
  @api variant = "bare";
  @api size = "small";

  get showLeft() {
    return !(this.leftHidden === true || this.leftHidden === "true");
  }

  get showRight() {
    return !(this.rightHidden === true || this.rightHidden === "true");
  }

  get leftIsDisabled() {
    return this.leftDisabled === true || this.leftDisabled === "true";
  }

  get rightIsDisabled() {
    return this.rightDisabled === true || this.rightDisabled === "true";
  }

  fireAction(name) {
    this.dispatchEvent(
      new CustomEvent("rowaction", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          action: { name },
          row: { [this.keyField]: this.keyFieldValue }
        }
      })
    );
  }

  handleLeft() {
    if (this.leftIsDisabled || !this.showLeft) {
      return;
    }
    this.fireAction(this.leftName);
  }

  handleRight() {
    if (this.rightIsDisabled || !this.showRight) {
      return;
    }
    this.fireAction(this.rightName);
  }
}
