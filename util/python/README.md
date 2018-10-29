# signature-commons-schema: python validator

## Usage
You can install the validators for this with pip when it's released.

Once installed, it can be used like so:
```python
from signature_commons_validator import deep_validation

deep_validation({
  '$schema': 'https://raw.githubusercontent.com/dcic/signature-commons-schema/master/core/library.json',
  'id': 'library_id',
  'meta': {
    '$schema': 'https://raw.githubusercontent.com/dcic/signature-commons-schema/master/meta/library/draft-1.json',
    'Assay': 'RNA-seq',
    ...
  },
  ...
})
```

This will perform assertions to ensure `$schema` is being respected properly, reporting any discrepencies.

## Development

### Setup
Install python dependencies with `pip install -r requirements.txt`.

### Testing
Run tests with `nosetests`.
