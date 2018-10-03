import os
import json
from validator import deep_validation, context_validation

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
      assert examples.get('@context') == 'https://raw.githubusercontent.com/dcic/signature-commons-schema/master/core/examples.json'
      context_validation(examples)
      for example in examples['tests']:
        yield check_example, examples['valid'], example
