import os
import json
from validator import schema_validation

def test_core_schemas():
  for root, dirs, files in os.walk('core'):
    for f in files:
      schema = json.load(open(os.path.join(root, f), 'r'))
      yield schema_validation, schema
