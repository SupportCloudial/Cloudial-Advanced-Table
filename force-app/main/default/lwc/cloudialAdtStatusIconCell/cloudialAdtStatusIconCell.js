import { LightningElement, api } from "lwc";

/**
 * Host supplies an array of icon descriptors on the row, e.g.:
 * statusIcons: [
 *   { iconName: 'utility:warning', tooltip: 'Needs review', alternativeText: 'Warning' },
 *   { iconSrc: '/resource/MyIcon', tooltip: 'Custom', alternativeText: 'Custom' }
 * ]
 * Column is opt-in: only appears if the host adds a statusIcon column to columnDefs.
 */
export default class CloudialAdtStatusIconCell extends LightningElement {
  @api icons;

  get iconList() {
    return (Array.isArray(this.icons) ? this.icons : []).map((icon, index) => ({
      key: icon.key || icon.iconName || icon.iconSrc || `icon-${index}`,
      iconName: icon.iconName,
      iconSrc: icon.iconSrc,
      tooltip: icon.tooltip || "",
      alternativeText: icon.alternativeText || icon.tooltip || "Status",
      useSrc: !!(icon.iconSrc && !icon.iconName)
    }));
  }

  get hasIcons() {
    return this.iconList.length > 0;
  }
}
