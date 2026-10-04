# Package smoke harness (subscriber / scratch)

Generic harness for installed managed package testing. Uses the namespaced tag
`<cloudialPackage-cloudial-advanced-table>`.

**Not packaged** (`force-app` only goes into the 2GP).

```bash
sf project deploy start --source-dir test-support --target-org <scratch-alias>
```

Then add **Cloudial Advanced Table Package Smoke** to an App or Home page.

## i18n / RTL pre-package smoke

`cloudialAdvancedTableI18nSmoke` uses the **local** tag `<c-cloudial-advanced-table>`
(search/filter/columns/refresh enabled) so you can validate Custom Labels + RTL
**before** cutting a package version.

```bash
# Temporarily clear "namespace" in sfdx-project.json, then:
sf project deploy start --source-dir force-app --target-org DevEditionPersonal
sf project deploy start --source-dir test-support/main/default/lwc/cloudialAdvancedTableI18nSmoke --target-org DevEditionPersonal
# Restore namespace afterward.
```

Add **Cloudial Advanced Table i18n Smoke** to an Account record page (second region).

Org-specific Contacts DE harness lives under `.scratch/dev-edition-smoke/` (temporary).
