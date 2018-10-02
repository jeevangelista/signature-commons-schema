import os
import json
from jsonschema import Draft4Validator

def test_core_schemas():
  for root, dirs, files in os.walk('core'):
    for f in files:
      schema = json.load(open(os.path.join(root, f), 'r'))
      yield Draft4Validator.check_schema, schema
