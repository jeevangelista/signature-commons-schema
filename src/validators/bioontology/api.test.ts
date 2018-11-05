import { strict as assert } from 'assert'
import { BioOntologyAPI } from './api'

describe('validators', () => {
  describe('bioontology', () => {
    describe('API', () => {
      describe('search', () => {
        it('works', async () => {
          const results = await BioOntologyAPI.search({
            q: 'allantoic fluid',
            ontologies: ['BTO'],
            limit: 1,
          })
          assert.notEqual(
            results,
            [],
            JSON.stringify(results)
          )
        })
      })
    })
  })
})