import jwt from 'jsonwebtoken'

class Auth {
  constructor() {
    this.authenticated = window.localStorage.getItem('jwt') ? true : false
  }

  isAuthenticated() {
    return this.authenticated
  }

  getAuthenticatedUserId() {
    try {
      return jwt.decode(window.localStorage.getItem('jwt')).user_id
    } catch (e) {
      return null
    }
  }

  getToken() {
    return window.localStorage.getItem('jwt')
  }

  setBaseUrl(baseUrl) {
    window.localStorage.setItem('baseUrl', baseUrl)
  }

  // add setters
  setAccountId(accountId) {
    window.localStorage.setItem('accountId', accountId)
  }

  setAlgoliaAppId(algoliaApplicationId) {
    window.localStorage.setItem('algolia-app-id', algoliaApplicationId)
  }

  setAlgoliaApiKey(algoliaSearchApi) {
    window.localStorage.setItem('algolia-api-key', algoliaSearchApi)
  }

  getAccountId() {
    return window.localStorage.getItem('accountId')
  }

  getAlgoliaAppId() {
    return window.localStorage.getItem('algolia-app-id')
  }

  getAlgoliaApiKey() {
    return window.localStorage.getItem('algolia-api-key')
  }

  getBaseUrl() {
    return window.localStorage.getItem('baseUrl')
  }

  authenticate(jwt) {
    let setCookieSecure = process.env.NODE_ENV === 'development' ? false : true
    this.authenticated = true
    window.localStorage.setItem('jwt', jwt)
  }

  signout() {
    this.authenticated = false
    window.localStorage.removeItem('jwt')
    window.localStorage.removeItem('currentOrderCount')
    window.localStorage.removeItem('currentOrderId')
    window.localStorage.removeItem('creditCardToken')
  }
}

const auth = new Auth()

export default auth
