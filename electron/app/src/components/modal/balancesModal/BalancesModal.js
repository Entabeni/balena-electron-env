import React, { useState } from 'react'
import styled from 'styled-components'
import { confirmAlert } from 'react-confirm-alert'

// Component
import { DarkModalLayout, DarkModal, TextInput, BasicForm, Par } from 'es-components'
import { round, validateAll, validateRequired } from 'es-libs'

const Balance = styled.div`
  display: flex;
  justify-content: space-apart;
  margin-bottom: 1em;

  .fieldContainer {
    flex: 3;
    margin-bottom: 0;
  }

  .balanceName {
    padding-right: 0.5em;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .balanceTotal {
    padding-left: 0.5em;
    flex: 1;
    display: flex;
    align-items: center;
  }
`

const BalancesTotal = styled.span`
  font-size: 1.5em;
`

function calculateTotal(quantityObj, balances) {
  return round(
    Object.keys(quantityObj).reduce(
      (accumulator, balanceId) => accumulator + parseFloat(quantityObj[balanceId]) * balances.find(balance => balance.id === balanceId).denominationValue,
      0
    ),
    2
  )
}

const restrictEnteredKeys = evt => (evt.key === 'e' || evt.key === '.' || (evt.key === '0' && evt.target.value === '0')) && evt.preventDefault()

const removeLeadingZero = value => (+value).toString()

const validateInteger = value => (!Number.isInteger(+value) ? 'Must enter in only an integer number' : undefined)

const renderForm = (balances, setOuterFormApi, setAllFieldsFilled) => {
  return (
    <BasicForm dark>
      {({ formState, formApi }) => {
        setAllFieldsFilled(
          balances.length ===
            (formState && formState.values && formState.values.quantity && Object.values(formState.values.quantity).filter(i => i !== 'NaN').length)
        )
        setOuterFormApi(formApi)
        return (
          <>
            {balances.map((balance, index) => {
              const fieldName = `quantity[${balance.id}]`
              return (
                <Balance key={balance.id}>
                  <span className="balanceName">
                    {balance.denominationName}: {balance.denominationValue}
                  </span>
                  <TextInput
                    id={`balanceInput_${index}`}
                    type="number"
                    field={fieldName}
                    label="Quantity"
                    pattern="[0-9*]"
                    onKeyDown={restrictEnteredKeys}
                    mask={removeLeadingZero}
                    maintainCursor
                    validate={validateAll[(validateInteger, validateRequired)]}
                    validateOnChange
                    validateOnBlur
                  />
                  <span className="balanceTotal">
                    TOTAL: {formState.values.quantity ? parseFloat((formState.values.quantity[balance.id] || 0) * balance.denominationValue).toFixed(2) : 0}
                  </span>
                </Balance>
              )
            })}
            <BalancesTotal>TOTAL: </BalancesTotal>
            <BalancesTotal id="totalBalance">{formState.values.quantity ? calculateTotal(formState.values.quantity, balances) : 0}</BalancesTotal>
          </>
        )
      }}
    </BasicForm>
  )
}

export default function BalancesModal({ title, balances, onPrimaryBtnHandler }) {
  const [outerFormApi, setOuterFormApi] = useState(null)
  const [useAllFieldsFilled, setAllFieldsFilled] = useState(false)
  const [modalHidden, setModalHidden] = useState(false)

  const handleOnSubmit = () => {
    setModalHidden(true)
    const formValues = outerFormApi.getValues()
    const total = formValues.quantity ? calculateTotal(formValues.quantity, balances) : 0
    const buttons = [
      {
        label: 'Yes',
        onClick: () => onPrimaryBtnHandler(formValues.quantity)
      },
      {
        label: 'No',
        onClick: () => setModalHidden(false)
      }
    ]
    const messageStyling = {
      lineHeight: '2.5rem',
      size: '1.5rem',
      textAlign: 'center'
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DarkModal
            sizing={{ height: 'auto', maxHeight: '400px', maxWidth: '500px', width: '40%' }}
            buttons={buttons}
            className="custom-ui"
            message={
              <React.Fragment>
                {`The total is $${total}.`}
                <br />
                Do you wish to continue?
              </React.Fragment>
            }
            messageStyling={messageStyling}
            onClick={onClose}
            title={title}
            titleHint="Confirm to continue"
          />
        )
      }
    })
  }

  const modalSizing = {
    height: 'auto',
    maxHeight: '900px',
    maxWidth: '560px',
    width: '40%'
  }

  return (
    <DarkModal
      buttonLabel="Select and Submit"
      hidden={modalHidden}
      onClick={handleOnSubmit}
      primaryButtonDisabled={!useAllFieldsFilled}
      sizing={modalSizing}
      title={title}
      titleHint="Add in the balance quantities">
      {renderForm(balances, setOuterFormApi, setAllFieldsFilled)}
    </DarkModal>
  )
}
