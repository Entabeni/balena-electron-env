import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'
import { withFormState } from 'informed'
import { confirmAlert } from 'react-confirm-alert'

import { Button, DarkModalLayout, Icon, LazyTable, SelectInput, SpinLoader, StandardForm, TableRow, TableCellData, TextInput } from 'es-components'
import { CANADA_STATES, COUNTRIES, US_STATES, validateRequired } from 'es-libs'

const GET_GUEST_ADDRESSES = gql`
  query GetGuestAddresses($id: String!) {
    pos {
      guest(id: $id) {
        id
        objectID
        addresses {
          id
          fullName
          address1
          address2
          city
          state
          country
          zip
        }
      }
    }
  }
`

const UPDATE_GUEST_ADDRESSES = gql`
  mutation UpdateGuestAddresses($id: String!, $addresses: [PosAddressInput]!) {
    pos {
      updateGuest(id: $id, addresses: $addresses) {
        id
        objectID
        addresses {
          id
          fullName
          address1
          address2
          city
          state
          country
          zip
        }
      }
    }
  }
`

const AddressWrapper = styled.p`
  display: inline-block;
  font-size: 1.15rem;
  vertical-align: middle;

  span {
    display: block;
    line-height: 1.25;
    margin-top: 0.25rem;
  }

  span:last-child {
    margin-bottom: 0.25rem;
  }
`

const rowsToShow = 8
const addressesTableCols = [{ leftAligned: true, text: 'Click to edit an address' }, '']
const addressesCellCustomWidths = { '0': 2, '1': 0.5 }
// Addresses table setup
const addressesBaseQueryConfig = {
  noResultsMessage: 'There are not addresses to show',
  query: GET_GUEST_ADDRESSES,
  type: 'graphql'
}

const messageStyling = {
  lineHeight: '2.5rem',
  size: '1.5rem',
  textAlign: 'center'
}

export const GuestAddressesTable = withToastManager(
  withApollo(({ client, guest, toastManager }) => {
    const [editingRow, setEditingRow] = useState(null)
    const [showUpdatingAddressLoadingSpinner, setShowUpdatingAddressLoadingSpinner] = useState(false)
    const [shouldRefetch, setShouldRefetch] = useState(false)
    const [addressError, setAddressError] = useState(null)

    const getOptionsFromDict = dict =>
      Object.keys(dict).map(key => ({
        label: dict[key],
        value: key
      }))

    const toggleEditingRow = addressId => {
      if (editingRow !== addressId) {
        setAddressError(null)
      }
      setEditingRow(editingRow === addressId ? null : addressId)
    }

    const handleDeleteAddress = (guestId, addressId) => {
      document.body.classList.add('react-confirm-alert-on-top')
      setShowUpdatingAddressLoadingSpinner(true)
      const buttons = [
        {
          label: 'Yes',
          onClick: () => {
            client
              .mutate({
                mutation: UPDATE_GUEST_ADDRESSES,
                variables: {
                  id: guestId,
                  addresses: [
                    {
                      _destroy: true,
                      id: addressId
                    }
                  ]
                }
              })
              .then(({ data }) => {
                if (data.pos && data.pos.updateGuest) {
                  setShouldRefetch(true)
                  toastManager.add('Address successfully deleted.', {
                    appearance: 'success',
                    autoDismissTimeout: 3000,
                    autoDismiss: true
                  })
                  clearUI()
                } else {
                  throw new Error('There was an error with the response from the server.')
                }
              })
              .catch(err => {
                toastManager.add('The deletion of the address failed.', { appearance: 'error', autoDismiss: false })
              })
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
      confirmAlert({
        afterClose: () => document.body.classList.remove('react-confirm-alert-on-top'),
        willUnmount: () => document.body.classList.remove('react-confirm-alert-on-top'),
        customUI: ({ onClose }) => {
          return (
            <DarkModalLayout
              buttons={buttons}
              className="custom-ui"
              message={
                <React.Fragment>
                  Are you sure you want to delete this address?
                  <br />
                  This cannot be undone.
                </React.Fragment>
              }
              messageStyling={messageStyling}
              onClick={onClose}
              title="Delete Address"
              titleHint="Confirm to continue"
            />
          )
        }
      })
    }

    const clearUI = () => {
      setAddressError(null)
      setEditingRow(null)
      setShowUpdatingAddressLoadingSpinner(false)
      //setShouldRefetch(false)
    }

    const handleAddressUpdate = (guestId, addressId, values) => {
      if (!values || !addressId || !guestId) {
        setAddressError('Invalid address, please review and try again.')
        return null
      }
      setAddressError(null)
      const addressToUpdate = {
        id: addressId
      }
      if (values) {
        Object.keys(values).forEach(key => {
          let val = values[key]
          if (val && val['label'] && val['value']) {
            val = val.value
          }
          addressToUpdate[key] = val || ''
        })
      }
      client
        .mutate({
          mutation: UPDATE_GUEST_ADDRESSES,
          variables: {
            id: guestId,
            addresses: [addressToUpdate]
          }
        })
        .then(({ data }) => {
          if (data.pos && data.pos.updateGuest) {
            setShouldRefetch(true)
            toastManager.add('Address successfully updated.', {
              appearance: 'success',
              autoDismissTimeout: 3000,
              autoDismiss: true
            })
            clearUI()
          } else {
            throw new Error('There was an error with the response from the server.')
          }
        })
        .catch(err => {
          toastManager.add('The update of the address failed.', { appearance: 'error', autoDismiss: false })
        })
    }

    const AddressForm = withFormState(({ formState }) => (
      <React.Fragment>
        <TextInput id="address1" field="address1" label="Address Line 1" autoComplete="off" validate={validateRequired} bgColor="white" />
        <TextInput id="address2" field="address2" label="Address Line 2" autoComplete="off" bgColor="white" />
        <TextInput id="city" field="city" label="City" autoComplete="off" validate={validateRequired} bgColor="white" />
        <SelectInput
          placeholder="Select country"
          id="country"
          field="country"
          options={getOptionsFromDict(COUNTRIES)}
          validate={validateRequired}
          borderRadius="0"
          isSearchable={true}
          initialValue={formState.values.country || null}
          controlBgColor="white"
        />
        {formState.values.country && (formState.values.country.value === 'CA' || formState.values.country.value === 'US') ? (
          <SelectInput
            placeholder="Select state"
            id="state"
            field="state"
            options={formState.values.country.value === 'CA' ? getOptionsFromDict(CANADA_STATES) : getOptionsFromDict(US_STATES)}
            validate={validateRequired}
            borderRadius="0"
            isSearchable={true}
            initialValue={formState.values.state || null}
            controlBgColor="white"
          />
        ) : (
          <TextInput id="state" field="state" label="State" autoComplete="off" validate={validateRequired} bgColor="white" />
        )}
        <TextInput id="zip" field="zip" label="ZIP Code" autoComplete="off" validate={validateRequired} bgColor="white" />
      </React.Fragment>
    ))

    const renderAddresses = data => {
      const { addresses, id: guestId } = data.pos.guest
      return addresses.map(address => {
        const { id: addressId, address1, address2, city, country, fullName, state, zip } = address
        return (
          <TableRow key={addressId} className="hoverable-row">
            <TableCellData leftAligned>
              {editingRow !== addressId && (
                <AddressWrapper>
                  {fullName && <span>{fullName}</span>}
                  <span>{`${address1}${address2 ? ` ${address2}` : ''}`}</span>
                  <span>{`${city}, ${state} - ${zip} ${country}`}</span>
                </AddressWrapper>
              )}
              {!showUpdatingAddressLoadingSpinner && editingRow === addressId && (
                <StandardForm
                  formcols={2}
                  minHeight="200px"
                  padding="1rem 0"
                  centeredButtons
                  cancelButtonKind="primaryOutline"
                  primaryButtonKind="red"
                  buttonsCustomStyles={{}}
                  error={addressError}
                  loading={showUpdatingAddressLoadingSpinner}
                  onCancelClick={() => toggleEditingRow(addressId)}
                  initialValues={{ ...address }}
                  onSubmitHandler={values => handleAddressUpdate(guestId, addressId, values)}>
                  <AddressForm />
                </StandardForm>
              )}
              {showUpdatingAddressLoadingSpinner && editingRow === addressId && <SpinLoader color="primary" size="2rem" />}
            </TableCellData>
            <TableCellData className="action-cell">
              <Button
                kind={editingRow === addressId ? 'red' : 'primary'}
                hoverBgColor="red"
                loading={showUpdatingAddressLoadingSpinner && editingRow === addressId}
                icon="FaEdit"
                iconSize="1.25rem"
                onClickHandler={e => toggleEditingRow(addressId)}
              />
              <Button
                kind="primary"
                hoverBgColor="red"
                loading={showUpdatingAddressLoadingSpinner && editingRow === addressId}
                icon="FaTrashAlt"
                iconSize="1.25rem"
                onClickHandler={e => handleDeleteAddress(guestId, addressId)}
              />
            </TableCellData>
          </TableRow>
        )
      })
    }

    return (
      <LazyTable
        lightTheme
        cellCustomWidths={addressesCellCustomWidths}
        headerData={addressesTableCols}
        onSuccess={data => renderAddresses(data)}
        queryConfig={{ ...addressesBaseQueryConfig, variables: { id: guest.id } }}
        shouldRefetch={shouldRefetch}
        verticalScroll={rowsToShow}
      />
    )
  })
)
