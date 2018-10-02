import os
import json
from urllib import request
from jsonschema import Draft4Validator
from jsonschema.exceptions import ValidationError

def fetch(url):
  return json.load(request.urlopen(url))

def check_example(valid, example):
  schema = fetch(example['$context'])
  try:
    Draft4Validator(schema).validate(example)
    result = 'Successful validation'
  except ValidationError as e:
    result = e
  assert result == valid, result


def test_examples():
  for root, dirs, files in os.walk('examples'):
    for f in files:
      examples = json.load(open(os.path.join(root, f), 'r'))
      for example in examples['tests']:
        yield check_example, examples['valid'], example
