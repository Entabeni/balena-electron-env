import React from 'react'
import { withRouter } from 'react-router-dom'
import { withToastManager } from 'react-toast-notifications'

// GraphQL
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'

import { ContentWrapper, StandardForm, Input, ButtonWrapper, StandardButton, FormErrorMsg } from 'es-components'
import { Title3 } from 'es-themes'

import { validateAll, validateRequired, validateSamePassword } from 'es-libs'

const ACTIVATE_USER_MUTATION = gql`
  mutation ActivateUser($id: String!, $password: String!, $passwordConfirmation: String!) {
    ecommerce {
      activateUser(id: $id, password: $password, passwordConfirmation: $passwordConfirmation) {
        success
        reason
      }
    }
  }
`

const ActivateUser = ({ history, toastManager, guestId }) => {
  const [errorMsg, setErrorMsg] = React.useState(null)
  const [errorOnSubmit, setErrorOnSubmit] = React.useState(false)

  const handleOnSubmit = (values, activateUser) => {
    activateUser({ variables: { password: values.password, passwordConfirmation: values.password, id: guestId } })
      .then(res => {
        if (res.data.ecommerce.activateUser.success === 'true') {
          setErrorMsg(null)
          setErrorOnSubmit(false)
          history.push('/')
          toastManager.add('Your account has been activated.', { appearance: 'success', autoDismiss: true })
        } else {
          setErrorMsg(res.data.ecommerce.activateUser.reason)
          setErrorOnSubmit(true)
        }
      })
      .catch(error => {
        const newError = error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : ''
        setErrorMsg(newError)
        setErrorOnSubmit(true)
      })
  }

  return (
    <Mutation mutation={ACTIVATE_USER_MUTATION}>
      {(setPassword, { loading }) => {
        return (
          <ContentWrapper flex backgroundColor="greyLightTint" padding="spacingMed" maxWidth>
            <Title3 size="1.2rem" marginBottom="spacingMed">
              If you would also like to create an account please enter a password below:
            </Title3>
            <StandardForm id="activate-user" onSubmit={values => handleOnSubmit(values, setPassword)}>
              {({ formState }) => {
                return (
                  <>
                    {errorOnSubmit && <FormErrorMsg>{errorMsg}</FormErrorMsg>}
                    <div>
                      <Input
                        type="password"
                        field="password"
                        label="Password*"
                        icon="MdLockOutline"
                        validate={validateAll([validateRequired, validateSamePassword])}
                        validateOnChange
                        notify={['passwordConfirmation']}
                      />
                    </div>

                    <ButtonWrapper borderTop justify="flex-end">
                      <StandardButton title="Activate" kind="secondary" large loading={loading} loaderColor="white" />
                    </ButtonWrapper>
                  </>
                )
              }}
            </StandardForm>
          </ContentWrapper>
        )
      }}
    </Mutation>
  )
}

export default withToastManager(withRouter(ActivateUser))
