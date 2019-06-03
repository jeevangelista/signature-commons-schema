# /src/validators

Common validators utilized in the schemas, these modules can be evaluated by referencing them in `$validate`.

```json
{
  "$validator": "/@dcic/signature-commons-schema/v4/dist/validators/entrez_gene",
  "type": "string",
  "description": "Provide a valid entrez gene."
}
```

Where `src/validators/entrez_gene.ts` looks something like so:
```ts
import {strict as assert} from 'assert'

export default function(gene: string): string {
  assert.equal(
    check_entrez_api(gene),
    200
  )

  return gene
}
```
