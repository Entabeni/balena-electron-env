var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw })
    } else {
      cooked.raw = raw
    }
    return cooked
  }
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
//@ts-ignore
global.fetch = require('node-fetch')
var action_cable_node_1 = __importDefault(require('action-cable-node'))
//@ts-ignore
var node_fetch_1 = __importDefault(require('node-fetch'))
//@ts-ignore
var apollo_boost_1 = require('apollo-boost')
var apollo_client_1 = __importDefault(require('apollo-client'))
//@ts-ignore
var apollo_link_1 = require('apollo-link')
//@ts-ignore
var apollo_link_error_1 = require('apollo-link-error')
//@ts-ignore
var apollo_link_http_1 = require('apollo-link-http')
var apollo_utilities_1 = require('apollo-utilities')
//@ts-ignore
var ActionCableLink_1 = __importDefault(require('graphql-ruby-client/subscriptions/ActionCableLink'))
var jwt_decode_1 = __importDefault(require('jwt-decode'))
var ws_1 = __importDefault(require('ws'))
var isProd = process.env.IS_PRODUCTION === '1'
var backendUrl = isProd ? 'entabeni-api.herokuapp.com' : 'entabeni-api-staging.herokuapp.com'
var isPreProd = process.env.IS_PRODUCTION === '2'
if (isPreProd) {
  backendUrl = 'pre-production-api.herokuapp.com'
}
var websocketUrl = 'wss://' + backendUrl + '/cable'
var NEW_TRANSACTION_SUBSCRIPTION = apollo_boost_1.gql(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        '\n  subscription transaction($orderId: String!) {\n    transaction(orderId: $orderId) {\n      id\n      success\n      message\n      reason\n    }\n  }\n'
      ],
      [
        '\n  subscription transaction($orderId: String!) {\n    transaction(orderId: $orderId) {\n      id\n      success\n      message\n      reason\n    }\n  }\n'
      ]
    ))
)

var WebSocket = /** @class */ (function() {
  function WebSocket() {
    // mq: any;
    this.apolloClient = new apollo_client_1.default({
      cache: new apollo_boost_1.InMemoryCache(),
      link: apollo_link_http_1.createHttpLink({
        uri: '/graphql'
      })
    })
    // this.state = state;
    // this.mq = mq;
    this.printJobToRedis = []
    this.scanJobToRedis = []
  }
  WebSocket.prototype.initClient = function(token, baseUrl) {
    var authLink = new apollo_link_1.ApolloLink(function(operation, forward) {
      operation.setContext(function() {
        return {
          headers: {
            authorization: token ? token : null
          }
        }
      })
      return forward(operation)
    })
    // Create regular NetworkInterface by using apollo-client's API:
    var httpLink = new apollo_boost_1.HttpLink({
      uri: baseUrl + '/graphql',
      fetch: node_fetch_1.default
    })
    // Create WebSocket client
    this.cable = websocketUrl ? action_cable_node_1.default.createConsumer(websocketUrl, ws_1.default) : null
    this.wsLink = new ActionCableLink_1.default({
      cable: this.cable
    })
    var errorLink = apollo_link_error_1.onError(function(_a) {
      var graphQLErrors = _a.graphQLErrors,
        networkError = _a.networkError,
        operation = _a.operation
      if (!!graphQLErrors) {
        graphQLErrors.forEach(function(_a) {
          var message = _a.message,
            path = _a.path
          return console.log('[GraphQL Error]: Message: ' + message + ', Path: ' + path)
        })
      }
      if (!!networkError) {
        console.log('[Network error ' + operation.operationName + ']: Message: ' + networkError.message)
      }
    })
    // Extend the network interface with the WebSocket
    var link = apollo_link_1.split(
      function(_a) {
        var query = _a.query
        // @ts-ignore
        var _b = apollo_utilities_1.getMainDefinition(query),
          kind = _b.kind,
          operation = _b.operation
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      this.wsLink,
      httpLink
    )
    var cache = new apollo_boost_1.InMemoryCache({
      dataIdFromObject: function(object) {
        return object.id || null
      }
    })
    // Finally, create your ApolloClient instance with the modified network interface
    this.apolloClient = new apollo_client_1.default({
      link: apollo_link_1.from([errorLink, authLink, link]),
      cache: cache
    })
  }
  WebSocket.prototype.subscribe = function(token, baseUrl, mainWindow, orderId) {
    this.initClient(token, baseUrl)
    this.cable.disconnect()

    this.apolloClient
      .subscribe({
        query: NEW_TRANSACTION_SUBSCRIPTION,
        variables: {
          orderId: orderId
        },
        //@ts-ignore
        error: function(err) {
          console.error('err', err)
        }
      })
      .subscribe({
        next: function(res) {
          mainWindow.webContents.send('payment-data', res.data)
        },
        error: function(err) {
          console.error('err', err)
        }
      })
    setTimeout(() => {
      //I spent a whole day on this - Cant pass callbacks or prototypes in electron, No way to bind this to multple processes ARG
      this.cable.disconnect()
    }, 80000)
  }
  return WebSocket
})()
exports.default = WebSocket
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5
