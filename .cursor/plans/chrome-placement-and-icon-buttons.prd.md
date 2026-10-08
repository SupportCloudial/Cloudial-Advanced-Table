---
name: chrome-placement-and-icon-buttons
overview: Opt-in chromeActionPlacement and chromeButtonsVariant so hosts can move header/bulk actions and show Columns/Refresh as icons without breaking default UI.
source: grill-me session (2026-10-08)
isProject: false
---

# Optional chrome action placement and icon-only Columns/Refresh

## Problem Statement

Host apps that nest Cloudial Advanced Table need Add/Clone (and similar) next to Search/Columns/Refresh, or Columns/Refresh as compact icon-only controls. Today those host actions only render in the title row, and built-in chrome buttons always show text labels. Hosts that want the compact layout must turn off package chrome and reimplement search, column picker, and refresh in the toolbar slot, which duplicates package behavior and drifts from shared labels and events.

## Solution

Add two optional public attributes on Advanced Table. Hosts keep passing `header-actions` / `bulk-actions` as today. They can place that action block in the title row (default), at the logical end of the chrome row, or at the logical end of the toolbar row beside the host toolbar slot. Separately, they can render Columns and Refresh as icon-only controls with the same packaged label strings for tooltip and accessible name. Omitting both attributes leaves the current UI unchanged.

## User Stories

1. As a host LWC author, I want action placement to default to the title row when I pass nothing new, so that existing consumers do not change visually after upgrade.
2. As a host LWC author, I want to set chrome action placement to chrome, so that Add/Clone sit at the end of the Search/Filter/Columns/Refresh row.
3. As a host LWC author, I want to set chrome action placement to toolbar, so that my actions sit in the toolbar band with my custom slot content.
4. As a host LWC author, I want to keep using the same `header-actions` array shape (`name`, `label`, `variant`, `iconName`, `disabled`, `requiresSelection`), so that I do not maintain a second action list.
5. As a host LWC author, I want `bulk-actions` to replace header actions on selection in whichever region I chose, so that bulk UX stays consistent.
6. As a host LWC author, I want the “N selected” banner and separator to move with the action buttons, so that selection context stays next to the buttons it describes.
7. As a host LWC author, I want title-row actions to disappear when placement is chrome or toolbar, so that buttons are not duplicated.
8. As a host LWC author, I want the title and record count to remain in the title row when actions move away, so that the heading still reads clearly.
9. As a host LWC author, I want chrome placement to show a chrome row even when Search/Filter/Columns/Refresh are all off, so that my actions still have a stable chrome band.
10. As a host LWC author, I want toolbar placement to show the toolbar row even when the toolbar slot is empty, so that placement is not silently ignored.
11. As a host LWC author, I want the toolbar layout to put my slot content on the start side and package actions on the end side, so that the row looks balanced and consistent.
12. As a host LWC author who already uses `slot="toolbar"`, I want that slot to keep working without new required props, so that my overlay content (for example a month control) does not break.
13. As a host LWC author, I want Columns and Refresh to support an icon-only variant, so that chrome stays compact next to host actions.
14. As a host LWC author, I want Filter to keep its labeled button when icon mode is on, so that the less frequent Filter control stays obvious.
15. As a host LWC author, I want icon-only Columns and Refresh to expose the same packaged Custom Label text as tooltip and accessible name, so that keyboard and screen-reader users are not degraded.
16. As a host LWC author, I want Search to remain an input in all modes, so that find-in-table behavior does not change.
17. As a host LWC author, I want Refresh in icon or labeled mode to still fire `headeraction` with `name: 'refresh'`, so that my refresh handler does not change.
18. As a host LWC author, I want host action clicks to still fire `headeraction` with the action `name` and `selectedRows`, so that handlers stay package-agnostic.
19. As a host LWC author, I want unknown placement or variant strings to fall back to defaults, so that a typo does not blank the chrome or actions.
20. As a host LWC author in an RTL org, I want actions at the logical end of chrome/toolbar, so that Hebrew/Arabic layouts mirror correctly instead of sticking to physical right.
21. As a package maintainer, I want existing enable flags (`enable-search`, `enable-filter`, `enable-column-picker`, `enable-refresh`) to keep their defaults and meanings, so that this ships as a non-breaking minor release.
22. As a package maintainer, I want docs to show a “compact chrome” example (placement chrome + icon buttons), so that host teams can copy a known-good pattern.
23. As a package maintainer, I want docs to clarify that the toolbar slot is for host extras, not a substitute for package search/column picker, so that hosts do not disable chrome unnecessarily.
24. As a QA engineer, I want omitting both new attributes to match today’s regions and labels, so that regression is easy to verify.
25. As a QA engineer, I want unit tests for placement regions and icon mode without requiring the new props on older tests, so that the suite stays backward compatible.
26. As a subscriber admin, I want this delivered as a managed package minor version, so that hosts can upgrade without a major migration.
27. As a host designer, I want chrome and toolbar action bands to use consistent spacing and end alignment, so that the table does not look patched or uneven.
28. As a host LWC author, I want focus order in the chrome row to follow visual order including moved actions, so that keyboard users tab through Search, built-ins, then host actions (or the mirrored RTL order).
29. As a host LWC author, I want column picker and filter panels to keep their current toggle behavior when buttons are icon-only, so that panel UX is unchanged.
30. As a host LWC author, I want `requiresSelection` on header actions to keep disabling rules after actions move, so that selection gating stays correct in chrome/toolbar.
31. As a documentation reader, I want allowed values and defaults listed in API.md, so that I can configure the table without reading source.
32. As a future package author, I want flex chrome ordering deferred, so that this release stays small and reviewable.

## Implementation Decisions

- Ship inside the managed Cloudial Advanced Table package as a minor release on top of the current 1.2.0 line (for example 1.3.0). Do not rename or remove existing public attributes or events.
- Add exactly two new public attributes:
  - `chromeActionPlacement` — string, default `header`. Allowed: `header`, `chrome`, `toolbar`. Unknown/empty → `header`.
  - `chromeButtonsVariant` — string, default `default`. Allowed: `default`, `icon`. Unknown/empty → `default`.
- Action data source remains `header-actions` and `bulk-actions`. Placement moves the existing action block (including selection banner when bulk mode is active). Do not add a separate chrome-actions array.
- When placement is `header` (default): render actions in the title row as today.
- When placement is `chrome`: render actions at the logical end of the chrome row (after Refresh when present). Do not also render them in the title row.
- When placement is `toolbar`: render actions at the logical end of the toolbar row; host `toolbar` slot content stays on the start side (space-between / end alignment). Do not also render them in the title row.
- Selection banner (“N selected” plus separator) always travels with the action buttons.
- Chrome row visibility: show when any built-in chrome control is enabled **or** when placement is `chrome` and there is at least one action item to show.
- Toolbar row visibility: show when the host slot has content **or** when placement is `toolbar` and there is at least one action item to show (do not rely on CSS `:empty` hiding in that case).
- Icon mode (`chromeButtonsVariant=icon`): Columns and Refresh render as icon-only buttons; accessible name and tooltip come from existing packaged labels (`CloudialAdt_Columns`, `CloudialAdt_Refresh`). Filter stays a labeled button. Search stays an input.
- End alignment uses logical CSS (inline-end / flex end), not physical right, for LTR and RTL.
- Invalid enum values normalize to defaults (same soft-normalize spirit as theme).
- Deferred this release: `chromeLayout` / `chromeOrder`, `showHeaderActionsInTitle`, per-control display props, public `toolbarSlotPosition`.
- Update public API documentation with the new attributes, defaults, toolbar merge rule, RTL note, and a compact-chrome host example. Clarify toolbar slot purpose.
- Versioning and subscriber packaging follow the repo’s normal managed-package minor release process; no host migration required unless they opt into the new attributes.

## Reusable Packages

None selected for install.

This work is implemented **in** Cloudial Advanced Table itself (catalog ID `cloudial-advanced-table`, released baseline `1.2.0`, package ID `0HoJ60000000064KAA`, version ID `04tJ6000000Lx5KIAS`). Grilling did not choose a separate dependency package, did not confirm a target-org alias, and did not approve an install/upgrade of another package. Cross-namespace host nesting continues to require Lightning Web Security as today.

## Testing Decisions

- Prefer the highest external seam: the public Advanced Table LWC API (attributes, slots, DOM regions, events). Assert observable behavior only — which region contains action buttons, whether Columns/Refresh expose visible labels, tooltip/accessible text presence, and that `headeraction` detail is unchanged. Do not assert private method names or internal tracking fields.
- Primary module under test: the Advanced Table host LWC (chrome, header, toolbar composition). Utils remain covered by existing unit tests; no new utils seam required unless normalization helpers are extracted.
- Prior art: Jest tests under the package utils module. Main table LWC coverage is thin today — add focused component tests for the new attributes without forcing those props onto unrelated existing cases.
- Minimum cases:
  - Both new props omitted → title-row actions, labeled Columns/Refresh (regression).
  - `chromeActionPlacement=chrome` with header actions → actions in chrome end; title row has title/count only; banner moves with bulk mode.
  - `chromeActionPlacement=toolbar` with and without slot content → actions at toolbar end; row still visible when slot empty.
  - `chromeButtonsVariant=icon` → Columns/Refresh icon-only with label-sourced accessible text; Filter still labeled; Refresh still dispatches `headeraction` `refresh`.
  - Invalid placement/variant strings → defaults.
- Manual/RTL smoke: confirm logical-end alignment in an RTL-friendly org or direction context when packaging.

## Out of Scope

- Removing, renaming, or changing defaults of existing public attributes or events.
- Requiring hosts to migrate markup.
- Flex chrome composition (`chromeLayout` / `chromeOrder`).
- Showing the same actions in both title and chrome/toolbar (`showHeaderActionsInTitle`).
- Per-button display enums for Columns/Refresh/Filter.
- Public `toolbarSlotPosition` (order is fixed: slot start, actions end).
- Icon-only mode for Filter, Search, Save/Cancel, or host-supplied header/bulk action buttons.
- Building host-specific Salesperson Targets UI inside the package (hosts keep owning button names and handlers).
- Changes to column schema APIs (`defaultHidden`, `hideable`, cell types, etc.).
- Work in Cloudial Advanced Datatable or other packages.

## Further Notes

- Grill-me locked decisions D1–D12 are the source of truth for this PRD; original long proposal’s toolbar-flex and granular-display options are intentionally cut.
- Package vocabulary: chrome row, header actions, bulk actions, toolbar slot, packaged Custom Labels, `headeraction` event.
- After this PRD, use `/to-issues` to publish commit-sized vertical slices under `.cursor/plans/chrome-placement-and-icon-buttons/issues/`.
