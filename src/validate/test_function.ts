import {strict as assert} from 'assert'
import debug from '../util/debug'

export default function test_function<T extends {id?: string}>(object: T): T {
  debug('test_function(' + JSON.stringify(object) + ')')
  assert.notEqual(
    object.id,
    undefined
  )

  return object
}
