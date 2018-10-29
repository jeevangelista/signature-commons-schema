import os
import json
from objectpath import Tree
from urllib import request
from jsonschema import Draft4Validator

fetch_cache = {}
def fetch(url, get=request.urlopen):
  global fetch_cache
  fetch_cache[url] = fetch_cache.get(url, json.load(get(url)))
  return fetch_cache[url]

def get_local(url):
  d, f = os.path.split(__file__)
  with open(
    os.path.join(
      d, '..', url
    ), 'r'
  ) as fh:
    return fh

def context_validation(ctx, data):
  schema = fetch(ctx)
  Draft4Validator(schema).validate(data)

def deep_validation(data):
  # NOTE: This misses @type's that don't have a parent @context
  for ctx in Tree(data).execute('$..*[@."$schema" is not None]'):
    context_validation(ctx['$schema'], data)

def schema_validation(schema):
  Draft4Validator.check_schema(schema)
