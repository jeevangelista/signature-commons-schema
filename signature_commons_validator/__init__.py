import json
from objectpath import Tree
from urllib import request
from jsonschema import Draft4Validator

fetch_cache = {}
def fetch(url):
  global fetch_cache
  fetch_cache[url] = fetch_cache.get(url, json.load(request.urlopen(url)))
  return fetch_cache[url]

def context_validation(ctx, typ, data):
  schema = fetch(ctx + typ)
  Draft4Validator(schema).validate(data)

def deep_validation(data):
  # NOTE: This misses @type's that don't have a parent @context
  for ctx in Tree(data).execute('$..*[@.@context is not None]'):
    for data in Tree(ctx).execute('$..*[@.@type is not None]'):
      deep_validation(ctx['@context'], data['@type'], data)

def schema_validation(schema):
  Draft4Validator.check_schema(schema)
