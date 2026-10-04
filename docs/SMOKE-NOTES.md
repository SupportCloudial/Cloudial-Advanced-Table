# Smoke notes — Cloudial Advanced Table

## Released

| Item | Value |
|------|--------|
| Package display name | Cloudial Advanced Table |
| Catalog ID | `cloudial-advanced-table` |
| Namespace | `CloudialPackage` |
| Package ID (`0Ho`) | `0HoJ60000000064KAA` |
| Version ID (`04t`) | `04tJ6000000Lx5KIAS` |
| Version | `1.2.0.1` |
| Code coverage | 100% |
| Install URL | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ6000000Lx5KIAS |
| Status | **Released** |

Previous released: `04tJ6000000Lx5FIAS` (`1.1.0.1`).

## 1.2.0 notes

- Generic `booleanBadge` cell: host supplies `trueLabel` / `falseLabel` / icons
- Packaged defaults: On/Off Custom Labels (+ `iw` translations)
- `vipBadge` kept as deprecated alias (managed upgrade compatibility)
- Contacts DE demo passes VIP/Standard as host labels (not package chrome)

## 1.1.0 notes

- Package chrome strings via Custom Labels + packaged `iw` Translations
- `@api` overrides for host-owned copy
- RTL: `margin-inline-start` on cell edit icons

## Automated

- `npm test` — 6/6 passed
- Package version create `1.2.0.1` — Success (100% coverage, previous release)
- Promote — Success
- Install upgrade on DevEditionPersonal — Success
