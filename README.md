# Cloudial Advanced Table

Generic, themeable Lightning data table for nested LWCs: config-driven columns,
custom cell types, client-side sort/search/filter, column picker, bulk header
actions, validation hooks, and visual themes.

| | |
|--|--|
| Namespace | `CloudialPackage` |
| Catalog ID | `cloudial-advanced-table` |
| LWC | `cloudialAdvancedTable` |
| Package ID | `0HoJ60000000064KAA` |
| Released version | `1.0.0.2` (`04tJ6000000Lx4RIAS`) |
| Install URL | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ6000000Lx4RIAS |
| Repo | https://github.com/SupportCloudial/Cloudial-Advanced-Table |

## What is generic vs demo

| Layer | Location | Purpose |
|-------|----------|---------|
| **Package** | `force-app/` | All chrome + cell types: search, filter, columns, refresh, bulk actions, `scoreMeter`, `vipBadge`, row `action` menu, themes, Save/Cancel |
| **Package smoke** | `test-support/` | Tiny in-memory harness for subscriber orgs after install |
| **Contacts DE harness** | `.scratch/dev-edition-smoke/` | Account-related Contacts demo (SF save, VIP/Score demo fields). **Not packaged** |

The polished Contacts UI on Dev Edition is a **consumer** of the package API — recreate it on any object by passing attributes + `column-defs` (see [`docs/API.md`](docs/API.md)).

## Nested usage (CRM chrome)

```html
<c-cloudial-advanced-table
  title="Contacts"
  record-noun="contacts"
  key-field="id"
  column-defs={columnDefs}
  data={rows}
  selected-rows={selectedRows}
  header-actions={headerActions}
  bulk-actions={bulkActions}
  enable-search
  search-placeholder="Search contacts..."
  enable-filter
  filter-defs={filterDefs}
  enable-column-picker
  enable-refresh
  theme="soft"
  onheaderaction={handleHeaderAction}
  onrowselection={handleRowSelection}
  onrowaction={handleRowAction}
  onsave={handleSave}
></c-cloudial-advanced-table>
```

Managed tag (post-package): `<cloudialPackage-cloudial-advanced-table>`.

Cross-namespace nesting requires Lightning Web Security.

## Themes

`default` · `dense` · `glass` · `soft` · `highContrast` · `custom` (CSS variables)

## Public API

Full attribute / column / event reference: [`docs/API.md`](docs/API.md).  
Spec: [`docs/SPEC-cloudial-advanced-table.md`](docs/SPEC-cloudial-advanced-table.md).

## Local testing

```bash
# Unpackaged DE deploy — temporarily clear "namespace" in sfdx-project.json if needed
sf project deploy start --source-dir force-app --target-org DevEditionPersonal
```

Contacts harness lives under `.scratch/dev-edition-smoke/` (gitignored). Copy that LWC out of `.scratch` before deploying if the CLI skips ignored paths.

## Development

```bash
npm install
npm test
```

`test-support/` and `.scratch/` are **not** part of the managed package directory.
