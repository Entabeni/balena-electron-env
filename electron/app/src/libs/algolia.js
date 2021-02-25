import algoliasearch from 'algoliasearch'
import { createNullCache } from '@algolia/cache-common'
import { auth, unique } from 'es-libs'

export function algoliaSearch(indexName, options = {}, callback) {
  const appId = auth.getAlgoliaAppId()
  const apiKey = auth.getAlgoliaApiKey()
  let extraConfig = undefined
  if (options.cachePolicy && options.cachePolicy === 'no-cache') {
    extraConfig = {
      responsesCache: createNullCache(),
      requestsCache: createNullCache()
    }
  }
  const algoliaClient = algoliasearch(appId, apiKey, extraConfig)
  const index = algoliaClient.initIndex(indexName)

  if (index) {
    let searchArgs = {
      attributesToHighlight: [],
      query: options.query || '',
      hitsPerPage: options.hitsPerPage || 1000,
      facets: '*'
    }

    if (options.attributesToRetrieve) {
      searchArgs.attributesToRetrieve = options.attributesToRetrieve
    }

    if (options.filters) {
      searchArgs.filters = options.filters
    }

    if (options.restrictSearchableAttributes) {
      searchArgs.restrictSearchableAttributes = options.restrictSearchableAttributes
    }

    index.search(searchArgs, (err, content) => {
      if (!err && content) {
        callback(null, content.hits, content.facets, content.nbHits)
      } else {
        callback(err)
      }
    })
  }

  callback(new Error('Invalid index.'))
}

export function algoliaMultiRequestForIndex(queries, callback, cachePolicy) {
  const appId = auth.getAlgoliaAppId()
  const apiKey = auth.getAlgoliaApiKey()
  let extraConfig = undefined
  if (cachePolicy && cachePolicy === 'no-cache') {
    extraConfig = {
      responsesCache: createNullCache(),
      requestsCache: createNullCache()
    }
  }
  const algoliaClient = algoliasearch(appId, apiKey, extraConfig)
  if (algoliaClient) {
    algoliaClient.search(queries, (err, { results } = {}) => {
      const hits = []
      if (results && results.length) {
        results.forEach(result => {
          if (result.hits.length) {
            hits.push(...result.hits)
          }
        })
      }
      callback(err, unique(hits, ['objectID']))
    })
  }
}
