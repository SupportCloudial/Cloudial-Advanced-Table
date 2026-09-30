# Package smoke harness (subscriber / scratch)

Generic harness for installed managed package testing. Uses the namespaced tag
`<cloudialPackage-cloudial-advanced-table>`.

**Not packaged** (`force-app` only goes into the 2GP).

```bash
sf project deploy start --source-dir test-support --target-org <scratch-alias>
```

Then add **Cloudial Advanced Table Package Smoke** to an App or Home page.

Org-specific DevEditionPersonal harness lives under `.scratch/dev-edition-smoke/` (temporary).
