# src/validate

The validation code (`index.ts`) and related tests (`*.test.ts`).

We utilize `ajv` and simply add a new keyword `$validator` which triggers another validation on data that isn't the root node. This allows for sub-schema validation and with the help of `$data`, potentially driven by the data instance.  Unlike `$ref`, `$validator` works on any object which can be resolved to a validation function including:
- Inline defined schema
- Externally defined schema
- Arbitrary `importable` function (of type `ValidationFunction`, exported by this project)

## Discussion
```json
{
  "$validator": {
    "type": "number"
  }
}
```
behaves **equivalent** to
```
{
  "type": "number"
}
```

and
```json
{
  "$validator": "/some-external-ref.json"
}
```
behaves **equivalent** to
```
{
  "$ref": "/some-external-ref.json"
}
```

So why is it useful?

### `$validator` can be used with `$data`
This enables us to drive the schema with the data instance itself.

Schema:
```json
{
  "type": "object",
  "properties": {
    "typeOfVal": {
      "type": "object"
    },
    "val": {
      "$validator": {
        "$data": "1/typeOfVal",
        "$comment": "Use the object defined in `typeOfVal` to validate THIS object"
      }
    }
  }
}
```
Instance:
```json
{
  "typeOfVal": {
    "type": "number"
  },
  "val": 6
}
```

### `$validator` also works with arbitrary javascript importables
Validator: (/my_function.js)
```js
const assert = require('assert')

export default function my_validator(obj) {
  if(database.find(obj.my_val)) {
    assert.fail(my_val + ' is already in the database')
  }

  return obj
}
```

Schema:
```json
{
  "type": "object",
  "properties": {
    "my_val": {
      "$validator": "/my_function.js",
    }
  }
}
```
Instance:
```json
{
  "my_val": "blah"
}
```

#### `$validator` functions can get context variables if needed
Validator: (/my_function.js)
```js
const assert = require('assert')

export default function my_validator(obj) {
  const prefix = this.context.prefix

  if(prefix === undefined) {
    assert.fail('prefix must be defined in schema')
  }

  if(database.find(prefix + obj.my_val)) {
    assert.fail(my_val + ' is already in the database')
  }

  return obj
}
```

Schema:
```json
{
  "type": "object",
  "properties": {
    "my_val": {
      "$validator": "/my_function.js",
      "prefix": "val/"
    }
  }
}
```
Instance:
```json
{
  "my_val": "blah"
}
```

## Bring `$validator` to the instance
We can then enable instances to actually bring their own validation, this is useful if you want to allow someone to put *anything* while still retaining validatability.


Schema:
```json
{
  "type": "object",
  "$validator": {
    "$data": "0/$validator"
  },
  "properties": {
    "$validator": {
      "oneOf": [
        {
          "type": "object"
        },
        {
          "type": "string"
        }
      ],
      "description": "How to validate *this* object"
    }
  },
  "required": [
    "$validator"
  ]
}
```

Instance:
```json
{
  "$validator": {
    "type": "object",
    "properties": {
      "id": {
        "type": "number"
      }
    }
  },
  "id": 5
}
```
