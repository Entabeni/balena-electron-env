import React, { useEffect, useState } from 'react'
import { withToastManager } from 'react-toast-notifications'
import styled from 'styled-components'
import { formatCurrency } from 'es-libs'
import { ProductModal, H3, SpinLoader, BasicForm, RadioInput, RadioInputGroup } from 'es-components'
import { withApollo } from 'react-apollo'
import { CREATE_TERMINAL_PAYMENT } from '../../pages/dashboard/schema.js'
const { ipcRenderer } = window.require('electron')

const PaymentWrapper = styled.div`
  margin-left: 30px;
  margin-top: 20px;
  display: grid;
  height: 100%;
  grid-gap: 15px;
  align-items: center;
`
const TransactionStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const createFailedText = message => {
  if (message.includes('DUP TRANSACTION')) {
    return 'Payment failed, Duplicate transaction detected'
  } else if (message.includes('TIME OUT')) {
    return 'Payment failed, Terminal Timed out, please try again'
  } else if (message.includes('ABORTED')) {
    return 'Payment failed, The transaction was aborted by user'
  } else {
    return 'Payment failed, Please try again.'
  }
}
const TransactionStatus = ({ text, isLoading }) => {
  return (
    <TransactionStatusWrapper>
      {isLoading && <SpinLoader size="80px" color="primary" />}
      <H3 color="greyDark" size="1.3em" margin="2em 0 0 0">
        {text}
      </H3>
    </TransactionStatusWrapper>
  )
}

function IntegratedCreditPaymentsModalInner({
  hasPurchaser,
  setMultiplePayments,
  multiplePayments,
  onAddCreditPayments,
  onCancelClick,
  toastManager,
  orderId,
  isRequestOpen = false,
  setRequestOpen,
  client
}) {
  const printTerminalId = window.localStorage.getItem('printTerminalId')
  const [useCurrentStep, setCurrentStep] = useState(hasPurchaser ? 'saveCard' : 'paymentInitialized')
  const [useCardToken, setCardToken] = useState(false)
  const [failedBoolean, setFailedBoolean] = useState(!hasPurchaser)
  const [successBoolean, setSuccessBoolean] = useState(!hasPurchaser)
  const [transactionId, setTransactionId] = useState(null)
  const [paymentArray, setPaymentArray] = useState([])
  const [canRetry, setFailedText] = useState('An error occured')
  const [useCurrentPaymentIndex, setCurrentPaymentIndex] = useState(0)
  const [useAmount, setAmount] = useState(parseFloat(multiplePayments[useCurrentPaymentIndex].amount))

  const createTerminalPayment = () => {
    client
      .mutate({
        mutation: CREATE_TERMINAL_PAYMENT,
        variables: {
          paymentTypeId: multiplePayments[useCurrentPaymentIndex].id,
          paymentId: multiplePayments[useCurrentPaymentIndex].paymentId,
          orderId,
          printTerminalId,
          amount: useAmount,
          saveCard: useCardToken
        }
      })
      .then(res => {
        if (res.data.pos.createTerminalPayment && res.data.pos.createTerminalPayment.status === 'created') {
          const newArray = multiplePayments.map((pArr, index) => {
            if (index === useCurrentPaymentIndex) {
              return { ...pArr, paymentId: res.data.pos.createTerminalPayment.id }
            } else {
              return pArr
            }
          })
          setMultiplePayments(newArray)
        }
        setFailedBoolean(true)
      })
      .catch(err => {
        setFailedText('An error occured')
        setFailedBoolean(true)
        setCurrentStep('failed')
      })
  }
  const cancelRequest = () => {
    onCancelClick()
  }

  useEffect(() => {
    if (useCurrentStep === 'paymentInitialized') {
      createTerminalPayment()
    }
  }, [useCurrentStep])

  let primaryBtnTitle
  switch (useCurrentStep) {
    case 'saveCard':
      primaryBtnTitle = 'Continue'
      break
    case 'failed':
    case 'payment':
      primaryBtnTitle = 'retry'
      break
    default:
      primaryBtnTitle = 'Complete'
      break
  }
  useEffect(() => {
    ipcRenderer.send('open-payment-subscription', orderId)
  }, [])

  const [useData, setData] = useState(null)
  ipcRenderer.on('payment-data', (event, data) => {
    console.log('🚀 ~ file: IntegratedCreditPaymentsModal.js ~ line 139 ~ ipcRenderer.on ~ data', data)
    setData(data)
  })
  ipcRenderer.on('action-cable-instance', (event, data) => {
    console.log('🚀 ~ file: IntegratedCreditPaymentsModal.js ~ line 143 ~ ipcRenderer.on ~ data', data)
    setTimeout(() => {
      data()
    }, 3000)
  })
  if (useData && useData.transaction && useData.transaction.success && successBoolean && transactionId !== useData.transaction.id) {
    setSuccessBoolean(false)
    setTransactionId(useData.transaction.id)
    if (useCurrentPaymentIndex === multiplePayments.length - 1) {
      onAddCreditPayments(multiplePayments, 'success')
    } else {
      setCurrentPaymentIndex(useCurrentPaymentIndex + 1)
      setAmount(parseFloat(multiplePayments[useCurrentPaymentIndex + 1].amount))
      setCurrentStep('saveCard')
      setPaymentArray([...paymentArray])
    }
    toastManager.add('Payment Success', { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000 })
  } else if (
    useData &&
    useData.transaction &&
    useData.transaction.success === false &&
    useData.transaction.reason !== 'pending' &&
    useCurrentStep !== 'failed' &&
    failedBoolean &&
    transactionId !== useData.transaction.id
  ) {
    setCurrentStep('failed')
    setTransactionId(useData.transaction.id)
    setFailedBoolean(false)
    setFailedText(createFailedText(useData.transaction.message))
    toastManager.add('Payment Failed', { appearance: 'error', autoDismiss: true, autoDismissTimeout: 3000 })
  }
  return (
    <ProductModal
      lightLayout
      title={`Integrated Credit Card Payment ${multiplePayments[useCurrentPaymentIndex] &&
        multiplePayments[useCurrentPaymentIndex].name &&
        ' - Type: ' + multiplePayments[useCurrentPaymentIndex].name} ${multiplePayments[useCurrentPaymentIndex] &&
        multiplePayments[useCurrentPaymentIndex].amount &&
        ' - Amount: ' + formatCurrency(multiplePayments[useCurrentPaymentIndex].amount)}`}
      subTitle="Payment Sent to Credit Card Terminal - Please Follow Instructions"
      primaryBtnTitle={primaryBtnTitle}
      primaryBtnDisabled={useCurrentStep === 'processing' || useCurrentStep === 'paymentInitialized'}
      onPrimaryBtnHandler={() => {
        setSuccessBoolean(true)
        setFailedBoolean(false)
        setCurrentStep('processing')
        createTerminalPayment()
      }}
      cancelBtnTitle={'Cancel'}
      onCancelHandler={() => {
        cancelRequest()
      }}>
      <PaymentWrapper>
        {useCurrentStep === 'processing' && <TransactionStatus isLoading={true} text={'Processing Transaction'} />}
        {useCurrentStep === 'paymentInitialized' && <TransactionStatus isLoading={true} text={'Processing Transaction'} />}
        {useCurrentStep === 'failed' && canRetry !== '' && <TransactionStatus text={canRetry} />}
        {useCurrentStep === 'saveCard' && !hasPurchaser && <TransactionStatus text="Payment Successful" />}
        {useCurrentStep === 'saveCard' && hasPurchaser && (
          <BasicForm
            height="10%"
            light
            initialValues={{ saveCreditCard: false }}
            onValueChange={values => {
              setCardToken(values.saveCreditCard)
            }}>
            <RadioInputGroup fieldGroup="saveCreditCard">
              <RadioInput margin="1em 0 0 0" id="saveCard" label={'Save credit card'} radioValue={true} />
              <RadioInput margin="1em 0 0 0" id="saveCard" label={'Dont Save credit card'} radioValue={false} />
            </RadioInputGroup>
          </BasicForm>
        )}
      </PaymentWrapper>
    </ProductModal>
  )
}
export const IntegratedCreditPaymentsModal = withToastManager(withApollo(IntegratedCreditPaymentsModalInner))
