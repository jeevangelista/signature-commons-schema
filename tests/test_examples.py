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

def check_example(valid, example, schema):
  try:
    Draft4Validator(schema).validate(example)
    if not valid:
      raise 'Successful validation'
  except ValidationError as e:
    if valid:
      raise e

def test_examples():
  for root, dirs, files in os.walk('examples'):
    for f in files:
      examples = json.load(open(os.path.join(root, f), 'r'))
      for ctx in Tree(examples).execute('$..*[@.@context is not None]'):
        schema = fetch(ctx['@context'])
        yield check_example, examples['valid'], ctx, schema
