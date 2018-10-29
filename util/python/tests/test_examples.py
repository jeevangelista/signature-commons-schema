import os
import json
from signature_commons_validator import deep_validation, context_validation

def check_example(valid, example):
  try:
    deep_validation(example)
    assert valid, 'Successful validation'
  except Exception as e:
    assert not valid, e

def test_examples():
  for root, dirs, files in os.walk('examples'):
    for f in files:
      examples = json.load(open(os.path.join(root, f), 'r'))
      ctx = examples.get('$schema')
      assert ctx == 'https://raw.githubusercontent.com/dcic/signature-commons-schema/next/core/examples.json'
      context_validation(ctx, examples)
      for example in examples['tests']:
        yield check_example, examples['valid'], example
