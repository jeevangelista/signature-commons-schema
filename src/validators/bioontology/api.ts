import fetch from 'node-fetch'

const base_api_url = 'http://data.bioontology.org'
const api_key = process.env.BIO_ONTOLOGY_API_KEY

export interface OntologyDefinition {
  '@context': object
  '@id': string
  '@type': string
  definition: string[]
  links: object
  matchType: string
  obsolete: boolean
  ontologyType: string
  prefLabel: string
  provisional: boolean
}

interface PaginatedResponse {
  nextPage: string | null
  collection: OntologyDefinition[]
}

export namespace BioOntologyAPI {
  export async function search(props: {
    q: string,
    ontologies: string[],
    suggest?: boolean,
    limit?: number,
  }): Promise<OntologyDefinition[]> {
    return _paginated_fetch({
      url: await _search_url(props),
      limit: props.limit,
    })
  }

  export async function _search_url(props: {
    q: string,
    ontologies: string[],
    suggest?: boolean,
  }): Promise<string> {
    const url = base_api_url
      + '/search?q=' + encodeURIComponent(props.q)
      + '&ontologies=' + encodeURIComponent(
        props.ontologies.join(',')
      )
      + (props.suggest === undefined ? '' : (
        '&suggest=' + props.suggest ? 'true' : 'false'
      ))
      + '&format=json'
    return url
  }

  export async function _paginated_fetch(props: {
    url: string,
    limit?: number,
  }): Promise<OntologyDefinition[]> {
    let resp = await _authenticated_fetch(props.url) as PaginatedResponse
    const results: OntologyDefinition[] = resp.collection
    while(resp.nextPage !== null && (props.limit === undefined || results.length < props.limit)) {
      resp = await _authenticated_fetch(resp.nextPage)
      results.concat(resp.collection)
    }
    return results.slice(0, props.limit)
  }
  
  export async function _authenticated_fetch(url: string): Promise<PaginatedResponse> {
    return await (await fetch(url, 
      {
        method: 'GET',
        headers: {
          'Authorization': 'apikey token=' + api_key,
        },
      }
    )).json()
  }
}
