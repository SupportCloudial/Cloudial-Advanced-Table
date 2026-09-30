# SPEC — Cloudial Advanced Table v1

## Goal

Ship a **generic**, config-driven Lightning datatable package (inspiration from Rooms Package Builder products table and modern `lightning-datatable` capabilities — **not** a same-to-same copy).

## Acceptance (v1)

- [x] Nested LWC public API with `column-defs` / `columns` + `data`
- [x] Client-side ASC/DESC sort (numbers numeric, text locale A–Z, dates chronological)
- [x] Custom types: combobox, pencilEditable, booleanCheckbox, actionWithTooltip, dualActionWithTooltip, statusIcon
- [x] No packaged dateInput (use standard date types)
- [x] Draft edit events; host owns save
- [x] Declarative validation + host error map + validity methods
- [x] Themes: default, dense, glass, soft, highContrast (+ custom tokens)
- [x] Toolbar slot; empty + error banner
- [x] No Apex in v1
- [ ] Manual smoke on DevEditionPersonal via test-support consumer
- [ ] 2GP create/promote **only after user approval**

## Non-goals (v1)

- Multi-section product panels / Rooms Apex
- Flow / record page App Builder exposure (nested only)
- Managed package release before approval
