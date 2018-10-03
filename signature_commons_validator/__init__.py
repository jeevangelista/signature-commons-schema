import json
from objectpath import Tree
from urllib import request
from jsonschema import Draft4Validator

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

def schema_validation(schema):
  Draft4Validator.check_schema(schema)
