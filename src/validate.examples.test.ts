import { strict as assert } from 'assert'
import { validate } from './validate'
import * as glob from 'glob'
import * as path from 'path'

describe('util', () => {
  describe('validate', () => {
    describe('examples validate', () => {
      for(const examples_file of glob.sync(
        path.join(
          __dirname,
          '../../../',
          'examples/',
          '**/*.json',
        )
      )) {
        describe(examples_file, () => {
          const examples = require(examples_file)
          for(const test of examples.tests) {
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
      }
    })
  })
})
