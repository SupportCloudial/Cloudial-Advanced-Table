# Smoke notes — Cloudial Advanced Table

## Released

| Item | Value |
|------|--------|
| Package display name | Cloudial Advanced Table |
| Catalog ID | `cloudial-advanced-table` |
| Namespace | `CloudialPackage` |
| Package ID (`0Ho`) | `0HoJ60000000064KAA` |
| Version ID (`04t`) | `04tJ6000000Lx4RIAS` |
| Version | `1.0.0.2` |
| Code coverage | 100% |
| Install URL | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ6000000Lx4RIAS |
| Status | **Released** |

Previous beta: `04tJ6000000Lx4MIAS` (`1.0.0.1`).

## Dev Edition (UX polish QA)

Harness at `.scratch/dev-edition-smoke/` (Account Contacts). Manual QA on
`DevEditionPersonal` approved before this upload.

## Automated

- `npm test` — 6/6 passed
- Package version create `1.0.0.2` — Success (100% coverage)
- Promote — Success

## Promote gate

Promoted `04tJ6000000Lx4RIAS` after DE UX approval.
