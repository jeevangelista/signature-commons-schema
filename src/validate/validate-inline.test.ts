import { strict as assert } from 'assert'
import { validate } from '.'

const testJSON = {
  "tests": [
    {
      "name": "simple pass",
      "valid": true,
      "schema": "meta",
      "data": {
        "$validator": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          }
        },
        "id": 0
      }
    },
    {
      "name": "simple fail",
      "valid": false,
      "schema": "meta",
      "data": {
        "$validator": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            }
          }
        },
        "id": "test"
      }
    }
  ]
}

describe('util', () => {
  describe('validate', () => {
    describe('inline validation', () => {
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
