import os
import json
from signature_commons_validator import schema_validation

def test_meta_schemas():
  for root, dirs, files in os.walk('meta'):
    for f in files:
      schema = json.load(open(os.path.join(root, f), 'r'))
      yield schema_validation, schema
