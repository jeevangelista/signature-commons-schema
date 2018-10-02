import os
import json
from objectpath import Tree
from urllib import request
from jsonschema import Draft4Validator
from jsonschema.exceptions import ValidationError

fetch_cache = {}
def fetch(url):
  global fetch_cache
  fetch_cache[url] = fetch_cache.get(url, json.load(request.urlopen(url)))
  return fetch_cache[url]

def context_validation(ctx):
  schema = fetch(ctx['@context'])
  Draft4Validator(schema).validate(ctx)

def deep_validation(data):
  for ctx in Tree(data).execute('$..*[@.@context is not None]'):
    context_validation(ctx)

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
