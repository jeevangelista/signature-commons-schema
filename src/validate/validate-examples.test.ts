import { strict as assert } from 'assert'
import { validate } from '.'
import * as glob from 'glob'
import * as path from 'path'

describe('util', () => {
  describe('validate', () => {
    describe('examples validate', () => {
      for(const examples_file of glob.sync(
        path.join(
          __dirname,
          '../../**/*.test.json',
        ),
        {
          ignore: [
            '**/node_modules/**',
            '**/dist/**',
          ],
        }
      )) {
        describe(examples_file, () => {
          const examples = require(examples_file)
          for(const test of examples.tests) {
            it(test.name, async () => {
              let success: boolean
              let error: string
              try {
                const result = await validate(test.data)
                success = true
                error = 'Successfully validated'
              } catch(e) {
                success = false
                error = JSON.stringify(e)
              }
              assert.equal(test.valid, success, error)
            })
          }
        })
      }
    })
  })
})
