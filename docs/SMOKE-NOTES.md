# Smoke notes — Cloudial Advanced Table

## Released

| Item | Value |
|------|--------|
| Package display name | Cloudial Advanced Table |
| Catalog ID | `cloudial-advanced-table` |
| Namespace | `CloudialPackage` |
| Package ID (`0Ho`) | `0HoJ60000000064KAA` |
| Version ID (`04t`) | `04tJ6000000Lx84IAC` |
| Version | `1.5.0.1` |
| Code coverage | 100% |
| Install URL | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ6000000Lx84IAC |
| Status | **Released** |

Indexed subscriber build: **1.5.0.1** (Salesforce release **68.0**).  
Also released: `1.4.0.1` (`04tJ6000000Lx7LIAS`, release **67.0**) — chrome placement/icon APIs without Filter/`iconOnly` parity.  
`1.3.0.1` (`04tJ6000000Lx7GIAS`, release **68.0**) — same chrome APIs as 1.4.

Previous feature baseline before chrome APIs: `04tJ6000000Lx5KIAS` (`1.2.0.1`).

## 1.5.0 notes

- `chromeButtonsVariant=icon` also makes **Filter** icon-only (`utility:filterList`, packaged filter label for a11y)
- Header/bulk actions: optional `iconOnly: true` + `iconName` → `lightning-button-icon` (label/title as alternative-text/title); labeled actions unchanged
- Jest: 20 tests (chrome placement + Filter icon + iconOnly actions + refresh event)
- Package version create `1.5.0.1` — Success (100% coverage, ancestor 1.4.0, release 68); promote — Success
- Scratch `CloudialAdvancedTable130` upgrade install of 1.5.0.1 — Success
- Scratch package smoke UI — Filter/Columns/Refresh icon-only; host New `iconOnly` + labeled Clone (harness-only)
- DevEditionPersonal upgrade install of **1.5.0.1** — Success
- DevEditionPersonal deploy `cloudialAdvancedTablePackageSmoke` + UI check — Success

## 1.4.0 / 1.3.0 notes

- `@api chromeActionPlacement` — `header` (default) \| `chrome` \| `toolbar`; moves `header-actions` / `bulk-actions` + selection banner
- `@api chromeButtonsVariant` — `default` (default) \| `icon`; Columns/Refresh icon-only with packaged label a11y text (1.5 also Filter)
- Invalid enum values fall back to defaults; RTL uses logical end alignment
- Package version create needs Translation Workbench + end-user languages in the definition file (`iw` translations)
- **1.3.0** built on release 68; **1.4.0** rebuilt on release 67 so Dev Edition (67) can upgrade; **1.5.0** uses current-release scratch def (`project-scratch-def.json`) because `release: previous` is no longer valid on the Dev Hub

## 1.2.0 notes

- Generic `booleanBadge` cell: host supplies `trueLabel` / `falseLabel` / icons
- Packaged defaults: On/Off Custom Labels (+ `iw` translations)
- `vipBadge` kept as deprecated alias (managed upgrade compatibility)

## Automated / smoke

- `npm test` — 16/16 passed (utils + chrome placement/icon component tests)
- Package version create `1.3.0.1` — Success (100% coverage, ancestor 1.2.0, release 68)
- Package version create `1.4.0.1` — Success (100% coverage, ancestor 1.3.0, release 67)
- Promote 1.3.0.1 + 1.4.0.1 — Success
- Scratch `CloudialAdvancedTable130` install of 1.3.0.1 + package smoke deploy — Success
- DevEditionPersonal upgrade to **1.4.0.1** — Success
- DevEditionPersonal deploy `cloudialAdvancedTablePackageSmoke` — Success
