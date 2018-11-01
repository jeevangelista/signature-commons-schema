import { strict as assert } from 'assert'
import { ajv, validate } from '.'

const testJSON = {
  "$validator": "/@dcic/signature-commons-schema/core/examples.json",
  "tests": [
    {
      "name": "function pass",
      "valid": true,
      "schema": "m",
      "data": {
        "$validator": "./test_function",
        "id": 0
      }
    },
    {
      "name": "function fail",
      "valid": false,
      "schema": "m",
      "data": {
        "$validator": "./test_function"
      }
    }
  ],
  "definitions": [
    {
      "$id": "m",
      "type": "object",
      "$validator": {
        "$comment": "Validate based on run-time property of $validator on instance",
        "$data": "0/$validator"
      },
      "properties": {
        "$validator": {
          "type": "string",
          "description": "URI to schema or module for validation of this instance"
        }
      },
      "required": [
        "$validator"
      ]
    }
  ]
}

describe('util', () => {
  describe('validate', () => {
    describe('standalone validation', () => {
      before(async () => {
        for(const def of testJSON.definitions) {
          ajv.addSchema({...def, $async: true})
        }
      })
      for(const test of testJSON.tests) {
        it(test.name, async () => {
          try {
            const result = await validate(test.data)
            assert.equal(test.valid, true, 'Validated successfully')
          } catch(e) {
            assert.equal(test.valid, false, JSON.stringify(e.errors))
          }
        })
      }
    })
  })
})
