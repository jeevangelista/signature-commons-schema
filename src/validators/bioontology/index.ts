import { strict as assert } from 'assert'
import { BioOntologyAPI } from './api'

interface BioOntologySchema {
  $validator: string
  "@id": string
  ontology: string
  label: string
}

export default async function bioontology<T extends BioOntologySchema>(obj: Partial<T>): Promise<T> {
  console.log(obj)
  if(obj.ontology === undefined) {
    assert.fail('Ontology must be specified')
  }

  if(obj.label === undefined && obj["@id"] === undefined) {
    assert.fail('Neither label nor @id is specified')
  }

  const result = (await BioOntologyAPI.search({
    q: obj["@id"] === undefined ? obj.label : obj["@id"],
    ontologies: [obj.ontology],
    limit: 1,
  }))[0]

  if(obj.label !== undefined) {
    assert.equal(
      obj.label,
      result.prefLabel,
      "Labels differ: ontology's `"
      + result.prefLabel
      + "` is not equal to object's `"
      + obj.label
    )
  } else {
    obj.label = result.prefLabel
  }

  if(obj["@id"] !== undefined) {
    assert.equal(
      obj["@id"],
      result["@id"],
      "@ids differ: ontology's `"
      + result["@id"]
      + "` is not equal to object's `"
      + obj["@id"]
    )
  } else {
    obj["@id"] = result["@id"]
  }

  return obj as T
}
