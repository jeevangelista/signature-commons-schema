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

def context_validation(ctx, typ, data):
  if ctx == 'https://raw.githubusercontent.com/jeevangelista/signature-commons-schema/master/':
    try:
      schema = fetch(typ, get=get_local)
    except:
      schema = fetch(ctx + typ)
  else:
    schema = fetch(ctx + typ)

  Draft4Validator(schema).validate(data)

def deep_validation(data):
  # NOTE: This misses @type's that don't have a parent @context
  for ctx in Tree(data).execute('$..*[@.@context is not None]'):
    for data in Tree(ctx).execute('$..*[@.@type is not None]'):
      context_validation(ctx['@context'], data['@type'], data)

def schema_validation(schema):
  Draft4Validator.check_schema(schema)