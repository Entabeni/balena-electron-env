import React from 'react'
import { withCookies } from 'react-cookie'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'

// Context
import { FormContext } from 'es-context'

// Libs
import { auth, errorHandler } from 'es-libs'

// Components
import { LoginContainer, LoginBanner, LoginSidebar, PrintTerminalsModal, BalancesModal } from 'es-components'

// GraphQL queries
import { LOGIN_MUTATION, GET_PRINT_TERMINALS, UPSERT_POS_SESSION, UPDATE_POS_SESSION, GET_ACCOUNT_INFO } from './schema'

function Login(props) {
  const selectedPrintTerminalFromLocalStorage = window.localStorage.getItem('printTerminalId')
  const [loading, setLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState(null)
  const [sessionId, setSessionId] = React.useState(null)
  const [authenticated, setAuthenticated] = React.useState(false)
  const [printTerminals, setPrintTerminals] = React.useState([])
  const [balances, setBalances] = React.useState([])
  const [printTerminalId, setPrintTerminalId] = React.useState(selectedPrintTerminalFromLocalStorage)
  const [printTerminalModalOpen, setPrintTerminalModalOpen] = React.useState(false)
  const [openingBalancesModalOpen, setOpeningBalancesModalOpen] = React.useState(false)
  const printTerminalNode = process.env.PRINT_TERMINAL_ID || 'd22ddf97-0220-4dca-9fef-f3468cba7667'

  const url_string = window.location.href
  const url = new URL(url_string)
  const printTerminalIdFromUrl = printTerminalNode

  React.useEffect(() => {
    if (authenticated) {
      fetchPrintTerminalsIds(
        printTerminalsArr => {
          setPrintTerminals(printTerminalsArr)
          setErrorMsg(null)
          setLoading(false)

          const findTerminalFromUrl = printTerminalsArr.find(printTerminal => printTerminal.id === printTerminalIdFromUrl)
          const findTerminalFromLocalStorage = printTerminalsArr.find(printTerminal => printTerminal.id === selectedPrintTerminalFromLocalStorage)
          if (findTerminalFromUrl) {
            onChosenPrintTerminal(findTerminalFromUrl)
          } else if (findTerminalFromLocalStorage) {
            onChosenPrintTerminal(findTerminalFromLocalStorage)
          } else {
            setPrintTerminalModalOpen(true)
          }
        },
        err => {
          setErrorMsg(err)
          setLoading(false)
        }
      )
    }
  }, [authenticated])

  async function fetchPrintTerminalsIds(successCB, errorCB) {
    const { client, toastManager } = props
    try {
      const result = await client.query({ query: GET_PRINT_TERMINALS })
      if (!!result && result.data.pos.allPrintTerminals) {
        const { account, allPrintTerminals } = result.data.pos
        const noChildPrintTerminal = allPrintTerminals.filter(terminal => terminal.parentPrintTerminalId === null)
        const { algoliaSearchApi, algoliaApplicationId, id } = account
        auth.setAlgoliaApiKey(algoliaSearchApi)
        auth.setAlgoliaAppId(algoliaApplicationId)
        auth.setAccountId(id)
        if (noChildPrintTerminal.length > 0) {
          successCB(noChildPrintTerminal)
        } else {
          throw new Error('There are not any print terminal to show.')
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the print terminals failed.', { appearance: 'error', autoDismiss: false })
      errorCB(currentError.message)
    }
  }

  async function sessionUpsert(printTerminalId, successCB, errorCB) {
    const { client, toastManager } = props
    try {
      const result = await client.mutate({ mutation: UPSERT_POS_SESSION, variables: { printTerminalId } })
      if (!!result && result.data.pos.upsertPosSession) {
        const upsertPosSession = result.data.pos.upsertPosSession
        if (Object.keys(upsertPosSession).length > 0) {
          successCB(upsertPosSession)
        } else {
          throw new Error('There are not any sessions.')
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the session failed.', { appearance: 'error', autoDismiss: false })
      errorCB(currentError.message)
    }
  }

  async function sessionUpdate(sessionId, sessionBalances, successCB, errorCB) {
    const { client, toastManager } = props
    try {
      const result = await client.mutate({ mutation: UPDATE_POS_SESSION, variables: { id: sessionId, sessionBalances } })
      if (!!result && result.data.pos.updatePosSession) {
        const updatePosSession = result.data.pos.updatePosSession
        if (Object.keys(updatePosSession).length > 0) {
          successCB(updatePosSession)
        } else {
          throw new Error('There are not any sessions.')
        }
      } else {
        throw new Error('There was an error with the response from the server.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the session failed.', { appearance: 'error', autoDismiss: false })
      errorCB(currentError.message)
    }
  }

  function authChangeRouteHandler() {
    props.toastManager.add('You have been logged in successfully.', { appearance: 'success', autoDismiss: true })
    const defaultPage = window.localStorage.getItem('defaultPage')
    props.history.push(`/${defaultPage}`)
  }

  function onPrintTerminalChange(e) {
    setPrintTerminalId(e === null ? e : e.value)
  }

  function openingPresent(openingSessionBalances) {
    return openingSessionBalances.some(balance => balance.quantity > 0)
  }

  function onChosenPrintTerminal(printTerminal) {
    let currentPrintTerminalId = printTerminalId
    if (printTerminal && printTerminal.id) {
      currentPrintTerminalId = printTerminal.id
    }
    window.localStorage.setItem('printTerminalId', currentPrintTerminalId)
    if (printTerminal && printTerminal.customerFacingPrintTerminal) {
      window.localStorage.setItem('customerFacingPrintTerminal', printTerminal.customerFacingPrintTerminal)
    } else if (printTerminal && printTerminal.parentPrintTerminalId) {
      window.localStorage.setItem('customerFacingPrintTerminal', currentPrintTerminalId)
    }
    sessionUpsert(
      currentPrintTerminalId,
      upsertPosSession => {
        if (openingPresent(upsertPosSession.openingSessionBalances)) {
          authChangeRouteHandler()
        } else {
          setSessionId(upsertPosSession.id)
          setPrintTerminalModalOpen(false)
          setOpeningBalancesModalOpen(true)
          setBalances(upsertPosSession.openingSessionBalances)
        }
      },
      error => {
        console.error(error)
      }
    )
  }

  function onSubmittedOpeningBalance(balanceObj) {
    sessionUpdate(
      sessionId,
      Object.keys(balanceObj).map(balanceId => ({ id: balanceId, quantity: +balanceObj[balanceId] })),
      () => {
        authChangeRouteHandler()
      },
      error => {
        console.error(error)
      }
    )
  }

  const onSubmitHandler = async values => {
    setLoading(true)

    const login = values.login.toString()
    const pin = values.pin.toString()
    try {
      const loginStatus = await props.client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          login,
          pin
        }
      })

      if (!!loginStatus && loginStatus.data.pos.signinUser.success) {
        auth.authenticate(loginStatus.data.pos.signinUser.authToken)
        const defaultPage = window.localStorage.getItem('defaultPage')
        if (!defaultPage) {
          window.localStorage.setItem('defaultPage', 'order')
        }

        if (loginStatus.data.pos.signinUser.user.id) {
          window.localStorage.setItem('currentUserId', loginStatus.data.pos.signinUser.user.id)
        }

        if (loginStatus.data.pos.signinUser.user.departmentIds) {
          const departments = {}
          loginStatus.data.pos.signinUser.user.departmentIds.forEach(dep => {
            departments[dep] = true
          })

          props.client.query({ query: GET_ACCOUNT_INFO }).then(result => {
            const { account } = result.data.pos
            if (!!result && account) {
              let newDateFormatString = ''
              if (account.dateFormat) {
                let separator = '/'
                if (account.dateFormat.indexOf('-') !== -1) {
                  separator = '-'
                } else if (account.dateFormat.indexOf('/') !== -1) {
                  separator = '/'
                }
                const format = account.dateFormat.split('%')
                format.forEach(f => {
                  if (f != null) {
                    switch (f) {
                      case `m${separator}`:
                      case 'm':
                        newDateFormatString += `MM${separator}`
                        break
                      case `d${separator}`:
                      case 'd':
                        newDateFormatString += `DD${separator}`
                        break
                      case 'Y':
                      case `Y${separator}`:
                        newDateFormatString += `YYYY${separator}`
                        break
                      default:
                        newDateFormatString += f
                    }
                  }
                })
              }

              window.localStorage.setItem('dateFormat', newDateFormatString.slice(0, -1))
              window.localStorage.setItem('timeZone', account.timeZone)
            }
          })

          window.localStorage.setItem('departments', JSON.stringify(departments))
        }
        setErrorMsg(null)
        setAuthenticated(true)
      } else {
        throw new Error('Login failed, please try again.')
      }
    } catch (error) {
      const currentError = errorHandler(error)
      props.toastManager.add('Login failed, please try again.', { appearance: 'error', autoDismiss: true })
      setErrorMsg(currentError.message)
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginBanner />
      <FormContext.Provider value={{ loading: loading, error: errorMsg }}>
        <LoginSidebar onSubmitHandler={onSubmitHandler} />
        {printTerminalModalOpen && (
          <PrintTerminalsModal
            selectedPrintTerminalId={printTerminalId}
            printTerminals={printTerminals}
            onPrimaryBtnHandler={onChosenPrintTerminal}
            onListChangeHandler={onPrintTerminalChange}
          />
        )}
        {openingBalancesModalOpen && <BalancesModal title="Opening Session Balances" balances={balances} onPrimaryBtnHandler={onSubmittedOpeningBalance} />}
      </FormContext.Provider>
    </LoginContainer>
  )
}

export default withRouter(withCookies(withToastManager(withApollo(Login))))
