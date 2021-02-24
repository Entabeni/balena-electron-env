import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { HashRouter as Router, withRouter, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { ToastProvider, DefaultToastContainer } from 'react-toast-notifications'
import { Common } from './commons'
// GraphQL
import { ApolloProvider, withApollo } from 'react-apollo'
import { ApolloLink, from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { SIGN_IN_TERMINAL } from './pages/dashboard/schema'

// Providers
import { SiteGlobalContextProvider } from './providers'

// Routes
import { PrivateRoute } from './routes/privateRoute'

// Pages
import { CompletedWaiverPage, CustomerFacingDash, DashboardPage, Login, NotFound } from 'es-pages'

// BG image
import bgImg from './themes/accounts/entabeni/images/Background.jpeg'

// Components
import { theme, GlobalStyle } from 'es-themes'
import { accountTheme } from './themes/accounts/index'
import { beforeLeavingInterceptor } from 'es-components'

// Libs
import { auth, getCurrentFrontEndUrl } from 'es-libs'
import { SpinLoader } from 'es-components'

// Account Settings
const SITE_THEME = process.env.REACT_APP_SITE_THEME || 'entabeni'
const themedAccount = { ...theme, ...accountTheme[SITE_THEME] }
const isProd = process.env.IS_PRODUCTION === '1'
let backendUrl = isProd ? 'entabeni-api.herokuapp.com' : 'entabeni-api-staging.herokuapp.com'
const isPreProd = process.env.IS_PRODUCTION === '2'
if (isPreProd) {
  backendUrl = 'pre-production-api.herokuapp.com'
}
const API_ENDPOINT = `https://${backendUrl}`
const FRONT_END_URL = process.env.FRONT_END_URL || 'pos-demo.entabeni.tech'
const clientFacing = process.env.CLIENT_FACING || '2'
console.log('🚀 ~ file: App.js ~ line 49 ~ process.env', process.env)
console.log('🚀 ~ file: App.js ~ line 49 ~ clientFacing', clientFacing)
const hs = process.env.TERMINAL_PASSWORD || '7fa9d42bcb8769b4df49301a3f978389'
const printTerminalNode = process.env.PRINT_TERMINAL_ID || 'd22ddf97-0220-4dca-9fef-f3468cba7667'
export const MyCustomToastContainer = props => {
  return <DefaultToastContainer {...props} style={{ zIndex: 9999 }} />
}
const GA_ID = process.env.REACT_APP_GA_ID

if (GA_ID) {
  ReactGA.initialize(GA_ID, {
    debug: false,
    titleCase: false
  })
}

const AppBody = withApollo(
  withRouter(({ location, history, showLogo, client }) => {
    const [askBeforeLeaving, setAskBeforeLeaving] = useState(false)

    const globalContextProviderConfig = {
      siteTheme: SITE_THEME,
      showLogo,
      askBeforeLeaving,
      setAskBeforeLeaving
    }

    useEffect(() => {
      //Determin if app is customer facing
      console.log('🚀 ~ file: App.js ~ line 99 ~ useEffect ~ clientFacing', clientFacing)
      if (clientFacing === '0') {
        window.localStorage.setItem('customerFacingPrintTerminal', printTerminalNode)

        auth.signout()
        client
          .mutate({
            mutation: SIGN_IN_TERMINAL,
            variables: {
              password: hs,
              printTerminalId: printTerminalNode
            }
          })
          .then(res2 => {
            if (res2 && res2.data.pos.signInTerminal.authToken) {
              auth.authenticate(res2.data.pos.signInTerminal.authToken)
            }
            history.push(`/customer-facing/${printTerminalNode}/`)
          })
      }
      if (GA_ID) {
        history.listen(location => ReactGA.pageview(location.pathname))
      }
    }, [])

    return (
      <SiteGlobalContextProvider value={{ ...globalContextProviderConfig }}>
        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRoute path="/order/:orderId" component={DashboardPage} />
          <Route path="/completed-waiver/:id" component={CompletedWaiverPage} />
          <PrivateRoute path="/customer-facing/:id" component={CustomerFacingDash} />
          <Route path="/customer-facing-preauth" component={SpinLoader} />
          <PrivateRoute path="/order" component={DashboardPage} />
          <Route key="not-found" component={NotFound} />
        </Switch>
      </SiteGlobalContextProvider>
    )
  })
)

class App extends React.Component {
  state = {
    client: null
  }

  componentDidMount() {
    this.setClient()
  }

  setClient() {
    this.getBaseUrl().then(baseUrl => {
      if (baseUrl != null) {
        auth.setBaseUrl(baseUrl)

        const httpLink = new HttpLink({
          uri: `${baseUrl}/graphql`,
          credentials: 'same-origin'
        })

        const authLink = new ApolloLink((operation, forward) => {
          const token = auth.getToken()
          operation.setContext(() => ({
            headers: {
              authorization: token ? `Bearer ${token}` : ''
            }
          }))
          return forward(operation)
        })

        const link = split(({ query }) => {
          const { kind, operation } = getMainDefinition(query)
          return kind === 'OperationDefinition' && operation === 'subscription'
        }, httpLink)

        const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
          if (!!graphQLErrors) {
            graphQLErrors.forEach(({ message, path }) => console.log(`[GraphQL Error]: Message: ${message}, Path: ${path}`))
          }

          if (!!networkError) {
            console.log(`[Network error ${operation.operationName}]: Message: ${networkError.message}`)
          }
        })

        const cache = new InMemoryCache({
          dataIdFromObject: object => object.id || null
        })

        const client = new ApolloClient({
          cache,
          link: from([errorLink, authLink, httpLink]),
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'network-only'
            },
            query: {
              fetchPolicy: 'network-only'
            }
          }
        })

        this.setState({ client })
      }
    })
  }

  getBaseUrl = () => {
    return fetch(`${API_ENDPOINT}/?frontEndUrl=https://${FRONT_END_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel'
      }
    })
      .then(res => {
        return res.json()
      })
      .then(respData => {
        const { baseUrl, backgroundImage, logo } = respData
        themedAccount['logoUrl'] = logo
        themedAccount['backgroundImage'] = backgroundImage
        return baseUrl
      })
  }

  render() {
    const { client } = this.state
    if (client == null) {
      return null
    }

    if (themedAccount['backgroundImage'] == null) {
      themedAccount['backgroundImage'] = bgImg
    }

    return (
      <ToastProvider components={{ ToastContainer: MyCustomToastContainer }} autoDismissTimeout={3000}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={themedAccount}>
            <Router getUserConfirmation={(configStr, cb) => beforeLeavingInterceptor(configStr, cb)}>
              <GlobalStyle />
              <AppBody showLogo={themedAccount['logoUrl'] != null} />
            </Router>
          </ThemeProvider>
        </ApolloProvider>
      </ToastProvider>
    )
  }
}

export default App
