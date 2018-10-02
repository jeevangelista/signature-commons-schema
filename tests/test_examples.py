import os
import json
from urllib import request
from jsonschema import validate

def fetch(url):
  return json.loads(request.urlopen(url).decode())

def check_example(example):
  schema = fetch(example['$context'])
  validate(example, schema)

def test_examples():
  for root, dirs, files in os.walk('examples'):
    for f in files:
      examples = json.load(open(os.path.join(root, f), 'r'))
      for example in examples:
        yield check_example, example
