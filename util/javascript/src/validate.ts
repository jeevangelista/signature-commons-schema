import {fetch_cached} from './fetch-cached'
import * as Ajv from 'ajv'
import draft4metaSchema from 'ajv/lib/refs/json-schema-draft-04.json'
import {promise_like_to_promise, promise_to_promise_like} from './util'
import debug from './debug'

// Prepare ajv object with custom params/keywords
export const ajv = new Ajv({
  // Fetch schema from remote if necessary
  loadSchema: fetch_cached,
  // Support $data keyword, enables schema mutatations via instance
  $data: true,
  // Ensure we can pass context variables
  passContext: true,

  allErrors: true,
  jsonPointers: true,
  verbose: true,
  // $comment: true,
})
// Based on draft 4 meta schema
ajv.addMetaSchema(draft4metaSchema, 'http://json-schema.org/draft-04/schema')

/**
 * Custom `$validator` keyword, enables us to validate the object in question based on a reference
 *  unlike `$ref`, this supports arbitrary functions and works with $data to enable instance-driven validation.
 */
ajv.addKeyword('$validator', {
  $data: true,
  async: true,
  errors: true,
  validate: function(schema: any, data: any) {
    if(this.root === data) {
      // $validate should be ignored on the current element as it is currently being handled
      debug('skipped $validator(' + JSON.stringify(schema) + ', ' + JSON.stringify(data) + ')')
      return true
    } else {
      // $validate should trigger another validate to process children
      debug('$validator(' + JSON.stringify(schema) + ', ' + JSON.stringify(data) + ')')
      return promise_to_promise_like(
        validate.call(this, data/*, schema*/)
      )
    }
  }
})

/**
 * Given a validator reference, resolve it into a function capable of doing a validation.
 * 
 * @param validator Function, URL, or Module path to validation function
 * 
 * @throws Ajv.ValidationError
 * @returns Validation function
 */
async function get_validator(validator: any): Promise<(data: object) => Promise<object>> {
  debug('get_validator(' + validator + ')')

  if(typeof validator === 'string') {
    debug('validator is a string, resolving as pointer')

    try {
      const ret = ajv.getSchema(validator)
      if(ret !== undefined)
        validator = ret
    } catch(e) {}
  }

  if(typeof validator === 'string') {
    debug('validator is a string, resolving as importable')

    try {
      const ret = (await import(validator)).default
      if(ret !== undefined)
        validator = ret
    } catch(e) {}
  }

  if(typeof validator === 'string') {
    debug('validator is a string, resolving as url')

    try {
      const ret = await fetch_cached(validator)
      if(ret !== undefined)
        validator = ret
    } catch(e) {}
  }

  if(typeof validator === 'object') {
    debug('validator is a object, converting to function')

    validator = await promise_like_to_promise(
      ajv.compileAsync({
        ...validator,
        $async: true
      }) as PromiseLike<any>
    )
  }

  if(typeof validator !== 'function') {
    throw {
      errors: [
        'Could not resolve validator of type ' + typeof validator
      ]
    } as Ajv.ErrorParameters
  }

  return validator
}

/**
 * Given data validate it.
 * 
 * @param data Object being validated
 * @param schema (optional) validator for which to validate against (schema, function, etc..)
 * 
 * @returns List of strings corresponding to errors, or empty list
 */
export async function validate(data: object, validator?: any): Promise<object> {
  this.root = data
  const validator_func = await get_validator.call(this,
    validator || (<any>data).$validator || draft4metaSchema
  )
  if(ajv.errors) throw ajv.errors
  const result = await validator_func.call(this,
    data
  )
  if(ajv.errors) throw ajv.errors
  return result
}
