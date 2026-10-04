# Cloudial Advanced Table — Public API

LWC tag (managed): `<cloudialPackage-cloudial-advanced-table>`  
Unpackaged / DE testing: `<c-cloudial-advanced-table>`

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `column-defs` | Array | `[]` | Cloudial column schema (preferred). |
| `columns` | Array | — | Raw `lightning-datatable` columns (passthrough). |
| `data` | Array | `[]` | Row objects. Host owns persistence. |
| `key-field` | String | `id` | Row key. |
| `draft-values` | Array | `[]` | Optional host drafts (merged with internal pending edits). |
| `selected-rows` | Array | `[]` | Selected key values. |
| `hide-checkbox-column` | Boolean | `false` | Hide selection checkboxes. |
| `show-row-number-column` | Boolean | `false` | Show row numbers. |
| `show-save-cancel` | Boolean | `true` | Show Save/Cancel footer while there are pending edits. |
| `title` | String | — | Optional heading above the table. |
| `header-actions` | Array | `[]` | Buttons when nothing is selected: `{ name, label, variant, disabled, iconName, requiresSelection }`. Fires `headeraction`. |
| `bulk-actions` | Array | `[]` | When rows are selected **and** this array is non-empty, replace header actions with these buttons and show “N selected”. Same shape as `header-actions`. |
| `enable-search` | Boolean | `false` | Show search input in the chrome row. |
| `search-placeholder` | String | `Search...` | Search input placeholder. |
| `search-fields` | Array | `[]` | Field names to search. Empty = all primitive fields on the row. |
| `enable-filter` | Boolean | `false` | Show Filter button + panel. |
| `filter-defs` | Array | `[]` | Filter fields: `{ name, label, type: 'text'\|'boolean'\|'picklist', options? }`. `name` must match a row property. |
| `enable-column-picker` | Boolean | `false` | Show Columns button to show/hide hideable columns. |
| `enable-refresh` | Boolean | `false` | Show Refresh in the chrome row (fires `headeraction` with `name: 'refresh'`). |
| `record-count-label` | String | — | Override the count text next to the title. |
| `record-noun` | String | `records` | Used for auto count: `"4 contacts"`. |
| `theme` | String | `default` | `default` \| `dense` \| `glass` \| `soft` \| `highContrast` \| `custom`. |
| `errors` | Array | `[]` | Host errors `{ key, field, message }`. |
| `empty-message` | String | — | Empty state text. |
| `error-message` | String | — | Banner error text. |

## Column schema (Cloudial)

```js
{
  field: 'name',
  label: 'Name',
  type: 'text', // text|number|currency|percent|date|date-local|email|phone|url|boolean|
                // combobox|pencilEditable|booleanCheckbox|
                // actionWithTooltip|dualActionWithTooltip|statusIcon|
                // scoreMeter|booleanBadge|vipBadge(deprecated)|action|rowMenu|recordLink
  trueLabel: 'On',        // booleanBadge (host-owned; defaults to packaged On/Off)
  falseLabel: 'Off',
  trueIconName: 'utility:check',
  falseIconName: 'utility:close',
  editable: true,
  sortable: true,
  recordLink: true,       // render field as hyperlink to the row record
  recordIdField: 'id',    // optional; defaults to key-field
  urlField: 'nameUrl',    // optional; auto-filled as /{recordId} when missing on the row
  initialWidth: 140,
  fixedWidth: 60,         // optional fixed width (useful for Actions)
  hideable: true,         // false = never listed in Columns picker (default true for data cols)
  defaultHidden: false,   // true = start hidden when enable-column-picker is on
  picklistValues: { Open: 'Open' }, // combobox
  max: 100,               // scoreMeter scale
  rowActions: [           // type: 'action' | 'rowMenu' — lightning-datatable ⋮ menu
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
  ],
  validation: { required: true, min: 0, max: 9999, pattern: '^[A-Z].*', message: '…' }
}
```

### Custom cell types (package)

| Type | Purpose |
|------|---------|
| `combobox` | Inline picklist; pencil on hover |
| `pencilEditable` | Inline text/number/currency; pencil on hover |
| `booleanCheckbox` | Checkbox draft edit |
| `scoreMeter` | Number + compact progress bar; optional edit |
| `booleanBadge` | Generic boolean toggle badge; host supplies `trueLabel` / `falseLabel` / icons (defaults: packaged On/Off) |
| `vipBadge` | **Deprecated** alias of `booleanBadge` (upgrade compatibility). Prefer `booleanBadge`. |
| `action` / `rowMenu` | Single ⋮ menu (`rowActions`) |
| `actionWithTooltip` / `dualActionWithTooltip` | Icon button(s) |
| `statusIcon` | Host-supplied icon list on the row |
| `recordLink` (or `recordLink: true`) | Field shown as record URL |

Native `lightning-datatable` types (`phone`, `email`, `date-local`, etc.) still work and stay clickable where the platform supports it.

Icon / status columns are **optional** — only include them when the host needs them.

## Minimal recreate (CRM-style chrome)

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
  search-fields={searchFields}
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

```js
headerActions = [
  { name: 'new', label: 'New', variant: 'brand', iconName: 'utility:add' },
  { name: 'bulk-edit', label: 'Bulk Edit', requiresSelection: true }
];
bulkActions = [
  { name: 'bulk-edit', label: 'Edit' },
  { name: 'bulk-delete', label: 'Delete', variant: 'destructive' },
  { name: 'bulk-export', label: 'Export' }
];
filterDefs = [
  { name: 'leadSource', label: 'Lead Source', type: 'picklist', options: ['Web', 'Other'] },
  { name: 'vip', label: 'VIP', type: 'boolean' },
  { name: 'priorityScore', label: 'Score', type: 'text' }
];
columnDefs = [
  { field: 'name', label: 'Name', recordLink: true, hideable: false, initialWidth: 180 },
  { field: 'title', label: 'Title', type: 'pencilEditable', editable: true, initialWidth: 150 },
  { field: 'leadSource', label: 'Lead Source', type: 'combobox', editable: true, picklistValues: { Web: 'Web' } },
  { field: 'priorityScore', label: 'Score', type: 'scoreMeter', editable: true, max: 100, initialWidth: 110 },
  { field: 'phone', label: 'Phone', type: 'phone', editable: true },
  { field: 'email', label: 'Email', type: 'email', editable: true },
  {
    field: 'vip',
    label: 'VIP',
    type: 'booleanBadge',
    editable: true,
    trueLabel: 'VIP',
    falseLabel: 'Standard',
    trueIconName: 'utility:favorite',
    falseIconName: 'utility:favorite_alt',
    initialWidth: 110
  },
  { field: 'accountName', label: 'Account', defaultHidden: true },
  { type: 'action', label: 'Actions', hideable: false, fixedWidth: 60, rowActions: [
      { label: 'View', name: 'view' },
      { label: 'Edit', name: 'edit' },
      { label: 'Delete', name: 'delete' }
    ]
  }
];
```

Search / filter run **client-side** on the bound `data` array. The host still owns load, save, and navigation.

## Events

- `sort` — `{ fieldName, sortDirection }`
- `cellchange` / `combovaluechange` — pending `{ draftValues }` (does not commit until Save)
- `save` — `{ draftValues }` when the user clicks Save
- `cancel` — user discarded pending edits
- `headeraction` — `{ name, selectedRows }` (includes chrome Refresh as `name: 'refresh'`)
- `rowselection` / `rowaction`

## Methods

- `checkValidity()` / `reportValidity()` / `getValidationErrors()` / `clearDrafts()`

## Slots

- `toolbar` — optional chrome above the grid

## Themes

Set `theme` from the parent LWC or App Builder property. Override CSS variables for `custom`.

Built-in polish (all themes): ~44–48px row height, hover row highlight, selected-row tint, sort chevrons only on hover/active sort, name links emphasized.

## Org requirement

Cross-namespace nesting requires **Lightning Web Security**.
