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
| Released version | `1.4.0.1` (`04tJ6000000Lx7LIAS`) |
| Install URL | https://login.salesforce.com/packaging/installPackage.apexp?p0=04tJ6000000Lx7LIAS |
| Repo | https://github.com/SupportCloudial/Cloudial-Advanced-Table |

## What is generic vs demo

| Layer | Location | Purpose |
|-------|----------|---------|
| **Package** | `force-app/` | All chrome + cell types: search, filter, columns, refresh, bulk actions, optional `chrome-action-placement` / `chrome-buttons-variant`, `scoreMeter`, `booleanBadge`, row `action` menu, themes, Save/Cancel |
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
  chrome-action-placement="chrome"
  chrome-buttons-variant="icon"
  theme="soft"
  onheaderaction={handleHeaderAction}
  onrowselection={handleRowSelection}
  onrowaction={handleRowAction}
  onsave={handleSave}
></c-cloudial-advanced-table>
```

`chrome-action-placement` defaults to `header` (title-row actions). Use `chrome` or `toolbar` to move the same `header-actions` / `bulk-actions` block. `chrome-buttons-variant="icon"` makes Columns/Refresh icon-only.

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
