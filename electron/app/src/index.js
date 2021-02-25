import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import 'react-confirm-alert/src/react-confirm-alert.css'

import App from './App'

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN
console.log('SENTRY_DSN', SENTRY_DSN)

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN })
}
try {
  require('electron-reloader')(module)
} catch {}
const Index = () => {
  return <App />
}

ReactDOM.render(<Index />, document.getElementById('app'))
