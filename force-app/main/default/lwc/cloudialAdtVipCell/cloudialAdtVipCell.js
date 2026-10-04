import { LightningElement, api } from "lwc";

/**
 * @deprecated Use cloudialAdtBooleanBadgeCell / column type `booleanBadge`.
 * Kept for managed-package upgrade compatibility; delegates to boolean badge.
 */
export default class CloudialAdtVipCell extends LightningElement {
  @api value;
  @api editable;
  @api fieldName;
  @api keyField;
  @api keyFieldValue;
  @api trueLabel;
  @api falseLabel;
  @api trueIconName;
  @api falseIconName;
}
