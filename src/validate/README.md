# src/validate

The validation code (`index.ts`) and related tests (`*.test.ts`).

We utilize `ajv` and simply add a new keyword `$validator` which triggers another validation on data that isn't the root node. This allows for sub-schema validation and with the help of `$data`, potentially driven by the data instance.  Unlike `$ref`, `$validator` works on any object which can be resolved to a validation function including:
- Inline defined schema
- Externally defined schema
- Arbitrary `importable` function (of type `ValidationFunction`, exported by this project)
