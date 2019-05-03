import fetch from 'node-fetch'
import debug from './debug'

const cache: {
  [key: string]: object
} = {}

/**
 * Fetch object from remote, caching any results.
 *  Treats `^/` as an `import`,
 *  @dcic/signature-commons-schema pointing to the local tree
 * 
 * @param url The url to fetch the object from
 */
export async function fetch_cached<T extends {} = {}>(url: string): Promise<T> {
  
  if(url.indexOf('/') === 0) {
    // Fetch url's that start with / as impots
    cache[url] = (
      await import(
        url.replace(
          /^\/@dcic\/signature-commons-schema\/[^/]+/,
          '/../..'
        ).substr(1)
      )
    ) as T
  } else if(cache[url] === undefined) {
    // Fetch other urls as actual urls
    cache[url] = await (await fetch(url)).json()
  }

  return cache[url] as T
}
