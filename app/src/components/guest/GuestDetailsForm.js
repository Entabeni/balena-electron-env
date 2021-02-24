import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import styled, { css } from 'styled-components'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'

import { Icon, Button, StandardForm, TextInput, MaskedTextInput } from 'es-components'

import { displayDateFormat, validateRequired, validateEmail, getDateFormat, saveDateFormat, validateAll, validateAgeVar, algoliaSearch } from 'es-libs'

const INVITE_GUEST_USER = gql`
  query InviteGuest($id: String!) {
    pos {
      inviteGuest(id: $id) {
        id
        email
      }
    }
  }
`

const UPDATE_GUEST_USER = gql`
  mutation UpdateGuest($id: String!, $email: String, $firstName: String!, $lastName: String!, $phone: String, $dateOfBirth: String) {
    pos {
      updateGuest(id: $id, email: $email, firstName: $firstName, lastName: $lastName, phone: $phone, dateOfBirth: $dateOfBirth) {
        id
        email
        phone
        dateOfBirth
        lastName
        fullName
        firstName
        completedWaiversInvited {
          id
          signingString
          waiver {
            id
            title
            intro
            showEmailPos
            part1
            part2
            part3
            part4
            part5
          }
        }
      }
    }
  }
`
const GuestDetail = styled.div`
  border-top: 1px solid ${props => props.theme.grey};
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 1rem 0.15rem;
  ${props =>
    props.margin
      ? css`
          margin: ${props.margin};
        `
      : null}
`

const GuestAttr = styled.p`
  border-bottom: 1px solid ${props => props.theme.grey};
  color: ${props => props.theme.greyDark};
  display: grid;
  column-gap: 1.25rem;
  font-size: 1.25rem;
  grid-template-columns: 2rem 10rem 1fr;
  line-height: 1.25rem;
  margin: 0;
  min-height: 6rem;
  padding: 1.25rem 2.5rem;

  & > .icon {
    align-self: center;
    color: ${props => props.theme.grey};
  }
`

const GuestAttrLabel = styled.span`
  align-self: center;
  font-weight: 700;
`

const GuestAttrValue = styled.span`
  align-self: center;

  & > .fieldContainer {
    margin: 0;
  }

  &.paired-fields {
    display: flex;
    justify-content: space-between;

    & > .fieldContainer {
      width: 45%;
    }
  }
`

const ButtonsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const editFormInputsCustomStyles = {
  borderColor: 'grey'
}
const editFormButtonsCustomStyles = {
  customHeight: '3.625rem',
  customPadding: '1rem',
  fontSize: '1.25rem',
  fontWeight: '700'
}
export const GuestDetailsForm = withToastManager(
  withApollo(({ guest, client, toastManager, setGuest, account, useErrorMsg, setErrorMsg }) => {
    const [useEditingGuest, setEditingGuest] = useState(false)

    const handleEditClick = e => {
      if (e) {
        e.preventDefault()
      }
      setEditingGuest(!useEditingGuest)
    }

    const handleInviteClick = () => {
      try {
        client
          .query({ query: INVITE_GUEST_USER, variables: { id: guest.id } })
          .then(result => {
            const { inviteGuest } = result.data.pos
            if (!!result && inviteGuest) {
              toastManager.add(`Invite successfully sent to ${inviteGuest.email}`, {
                appearance: 'success',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            } else {
              throw new Error('There was an error with the response from the server.')
            }
          })
          .catch(err => {
            toastManager.add('The submission of the invite failed.', { appearance: 'error', autoDismiss: false })
          })
      } catch (err) {
        toastManager.add('The submission of the invite failed.', { appearance: 'error', autoDismiss: false })
      }
    }

    const handleGuestUpdate = (guestId, values, updateGuest) => {
      values.dateOfBirth = saveDateFormat(values.dateOfBirth)
      if (!values['phone']) {
        values['phone'] = ''
      }
      if (!values['email']) {
        values['email'] = ''
      }

      updateGuest({ variables: { id: guestId, ...values } })
        .then(async ({ data }) => {
          setErrorMsg('')
          setEditingGuest(false)
          setGuest(data.pos.updateGuest)
        })
        .catch(error => {
          const newError = error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : ''
          setErrorMsg(newError)
        })
    }

    if (useEditingGuest) {
      return (
        <Mutation mutation={UPDATE_GUEST_USER}>
          {(updateGuest, { loading }) => (
            <StandardForm
              formcols={1}
              centeredButtons
              cancelButtonKind="primaryOutline"
              primaryButtonKind="red"
              buttonsCustomStyles={editFormButtonsCustomStyles}
              padding="0"
              error={useErrorMsg}
              loading={loading}
              onCancelClick={handleEditClick}
              initialValues={{ ...guest, dateOfBirth: displayDateFormat(guest.dateOfBirth) }}
              onSubmitHandler={values => handleGuestUpdate(guest.id, values, updateGuest)}>
              <GuestDetail margin="0 0 1.5rem">
                <GuestAttr>
                  <Icon name="FaIdCard" size="2rem" />
                  <GuestAttrLabel>Full Name</GuestAttrLabel>
                  <GuestAttrValue className="paired-fields">
                    <TextInput
                      {...editFormInputsCustomStyles}
                      id="firstName"
                      field="firstName"
                      label="First Name"
                      autoComplete="off"
                      validate={validateRequired}
                      validateOnChange
                    />
                    <TextInput
                      {...editFormInputsCustomStyles}
                      id="lastName"
                      field="lastName"
                      label="Last Name"
                      autoComplete="off"
                      validate={validateRequired}
                      validateOnChange
                    />
                  </GuestAttrValue>
                </GuestAttr>
                <GuestAttr>
                  <Icon name="FaAt" size="2rem" />
                  <GuestAttrLabel>Email</GuestAttrLabel>
                  <GuestAttrValue>
                    <TextInput
                      {...editFormInputsCustomStyles}
                      id="email"
                      field="email"
                      label="Email"
                      autoComplete="off"
                      validate={guest && guest.active ? validateAll([validateRequired, validateEmail]) : validateEmail}
                      validateOnChange
                    />
                  </GuestAttrValue>
                </GuestAttr>
                <GuestAttr>
                  <Icon name="FaPhone" size="2rem" />
                  <GuestAttrLabel>Phone</GuestAttrLabel>
                  <GuestAttrValue>
                    <TextInput {...editFormInputsCustomStyles} id="phone" field="phone" label="Phone Number" autoComplete="off" validateOnChange />
                  </GuestAttrValue>
                </GuestAttr>
                <GuestAttr>
                  <Icon name="FaCalendarDay" size="2rem" />
                  <GuestAttrLabel>Date of Birth</GuestAttrLabel>
                  <GuestAttrValue>
                    <MaskedTextInput
                      {...editFormInputsCustomStyles}
                      id="dateOfBirth"
                      field="dateOfBirth"
                      label={`Date of Birth (${getDateFormat()})`}
                      validate={validateAll([
                        validateRequired,
                        validateAgeVar({ ageFrom: 0, ageTo: 100 }, account.ageCalculationMethod, account.endOfWinterSeasonMonth, account.ageCalculationDate)
                      ])}
                      validateOnChange
                    />
                  </GuestAttrValue>
                </GuestAttr>
              </GuestDetail>
            </StandardForm>
          )}
        </Mutation>
      )
    }

    return (
      <GuestDetail>
        <GuestAttr>
          <Icon name="FaIdCard" size="2rem" />
          <GuestAttrLabel>Full Name</GuestAttrLabel>
          <GuestAttrValue>{`${guest.firstName} ${guest.lastName}`}</GuestAttrValue>
        </GuestAttr>
        <GuestAttr>
          <Icon name="FaAt" size="2rem" />
          <GuestAttrLabel>Email</GuestAttrLabel>
          <GuestAttrValue>{guest.email}</GuestAttrValue>
        </GuestAttr>
        <GuestAttr>
          <Icon name="FaPhone" size="2rem" />
          <GuestAttrLabel>Phone</GuestAttrLabel>
          <GuestAttrValue>{guest.phone}</GuestAttrValue>
        </GuestAttr>
        <GuestAttr>
          <Icon name="FaCalendarDay" size="2rem" />
          <GuestAttrLabel>Date of Birth</GuestAttrLabel>
          <GuestAttrValue>{displayDateFormat(guest.dateOfBirth)}</GuestAttrValue>
        </GuestAttr>
        <ButtonsWrapper>
          <Button
            title="Edit"
            kind="primaryOutline"
            icon="FaEdit"
            iconSize="1.25rem"
            onClickHandler={handleEditClick}
            customHeight="3.625rem"
            customPadding="1rem"
            fontSize="1.25rem"
            fontWeight="700"
            margin="3rem auto 0"
          />
          {!guest.active && (
            <Button
              title="Email Invite"
              kind="redOutline"
              icon="FaRegEnvelope"
              iconSize="1.25rem"
              onClickHandler={handleInviteClick}
              customHeight="3.625rem"
              customPadding="1rem"
              fontSize="1.25rem"
              fontWeight="700"
              margin="3rem auto 0"
              disabled={!guest.email || validateEmail(guest.email) !== undefined}
            />
          )}
        </ButtonsWrapper>
      </GuestDetail>
    )
  })
)
