import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { PrintModal, Table, SpinLoader, Button } from 'es-components'
import styled from 'styled-components'
import { GET_SALE_QUERY, CREATE_PRINT_JOB_MUTATION, CREATE_EMAIL_ORDER, UPDATE_SALE } from '../../pages/dashboard/schema'
import { withToastManager } from 'react-toast-notifications'
import { ButtonWrapper } from './AccessRecordPrintModal'
import GuestListItem from './GuestListItem'
const { ipcRenderer } = window.require('electron')

const SaleWrapper = styled.div`
  margin: 0;
  width: calc(100% - 0.5em);
  min-height: 100%;
  max-height: 500px;
  display: block;
  padding: 60px 0 0 0;
  position: relative;
  overflow-y: scroll;
  box-sizing: border-box;
`

const PaymentsWrapper = styled.article`
  margin: 0;
  padding: 0 0.5em 0.5em 0.5em;
`

// Table SetUp
const rowsToShow = 5
const tableCols = [
  { celltype: 'select-cell', text: 'Select' },
  { leftAligned: true, text: 'Name' }
]
const cellCustomWidths = { '0': 0.6, '1': 2 }

export const PrintingQuestions = withToastManager(({ client, toastManager, sale, useGuests, handleCloseModal }) => {
  const [useGuestIds, setGuestIds] = useState([])
  const [hasShippedLoading, setHasShippedLoading] = useState(false)
  const [hasShipped, setHasShipped] = useState(sale.hasShipped)
  const [shippedAt, setShippedAt] = useState(sale.shippedAt)

  const handlePrintClick = printJobType => {
    client
      .mutate({
        mutation: CREATE_PRINT_JOB_MUTATION,
        variables: {
          printJobType,
          printTerminalId: window.localStorage.getItem('printTerminalId'),
          printData: JSON.stringify({ saleId: sale.id }),
          saleId: sale.id
        }
      })
      .then(res => {
        toastManager.add('Success', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
        if (res.data.pos.createPrintJob) {
          ipcRenderer.send('receipt-button', res.data.pos.createPrintJob.printData)
        }
      })
      .catch(err => {
        toastManager.add('Print Job Failed, please try again.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      })
  }

  const toggleHasShipped = (value, shippedAt) => {
    setHasShippedLoading(true)
    client
      .mutate({
        mutation: UPDATE_SALE,
        variables: {
          id: sale.id,
          hasShipped: value,
          shippedAt: shippedAt
        }
      })
      .then(res => {
        setHasShippedLoading(false)
        setHasShipped(value)
        toastManager.add('Shipping status updated', { appearance: 'success', autoDismiss: true })
      })
      .catch(err => {
        setHasShippedLoading(false)
        toastManager.add('Shipping status failed to update', { appearance: 'error', autoDismiss: true })
      })
  }

  const handleSenEmailsClick = guestIds => {
    if (sale && sale.id && guestIds.length) {
      client.mutate({ mutation: CREATE_EMAIL_ORDER, variables: { saleId: sale.id, guestIds: guestIds } }).then(res => {
        if (res.data.pos.email.success) {
          toastManager.add('Email was successfully sent.', { appearance: 'success', autoDismiss: true })
        }
      })
    }
  }
  const renderQuestions = () => {
    const onCheckBoxClick = itemId => {
      const newGuestIds = useGuestIds
      if (newGuestIds.indexOf(itemId) === -1) {
        newGuestIds.push(itemId)
      } else {
        newGuestIds.forEach((val, index) => {
          if (val === itemId) {
            newGuestIds.splice(index, 1)
          }
        })
      }
      setGuestIds([...newGuestIds])
    }
    return (
      <PaymentsWrapper>
        {sale && sale.id ? (
          <SaleWrapper>
            <Query query={GET_SALE_QUERY} variables={{ id: sale.id }}>
              {({ loading, error, data }) => {
                if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
                if (error) return `Error! ${error.message}`
                const guests = data.pos.sale.guests
                return (
                  <>
                    <Table
                      lightTheme
                      footerStyles={{ borderBottom: true }}
                      headerData={tableCols}
                      headerStyles={{ borderTop: true }}
                      cellCustomWidths={cellCustomWidths}
                      verticalScroll={rowsToShow}>
                      {guests &&
                        guests.length > 0 &&
                        guests.map(guest => guest && <GuestListItem key={guest.id} saleLineItem={guest} onCheckBoxClick={id => onCheckBoxClick(id)} />)}
                    </Table>
                    <ButtonWrapper gridColumns="1fr 1.25fr 1fr 0.75fr" gridGap="2rem">
                      <Button
                        onClickHandler={() => handlePrintClick('receipt')}
                        title="Print Receipt"
                        kind="primary"
                        icon="IoMdPrint"
                        iconSize="2rem"
                        customWidth="100%"
                        customPadding="0.5rem 1rem 0.5rem 3rem"
                        floatingIcon={{ left: '0.75rem' }}
                      />
                      {/* <Button
                        onClickHandler={() => handlePrintClick('shippingLabel')}
                        title="Print Shipping Label"
                        kind="primary"
                        disabled={!sale.shippingAddressId}
                        icon="IoMdPrint"
                        iconSize="2rem"
                        customWidth="100%"
                        customPadding="0.5rem 1rem 0.5rem 3rem"
                        floatingIcon={{ left: '0.75rem' }}
                      /> */}
                      <Button
                        onClickHandler={() => handleSenEmailsClick(useGuestIds)}
                        disabled={!useGuestIds.length > 0}
                        title="Email Receipt"
                        kind="primary"
                        icon="IoIosMail"
                        iconSize="2rem"
                        customWidth="100%"
                        customPadding="0.5rem 1rem 0.5rem 3rem"
                        floatingIcon={{ left: '0.75rem' }}
                      />
                      <Button onClickHandler={() => handleCloseModal()} title="Complete" kind="secondary" sizeH="short" sizeW="100%" />
                    </ButtonWrapper>
                  </>
                )
              }}
            </Query>
          </SaleWrapper>
        ) : (
          <SpinLoader withWrapper="250px" size="80px" color="primary" />
        )}
      </PaymentsWrapper>
    )
  }
  return (
    <PrintModal
      title={`Sale ${sale && sale.number && sale.number.toString().padStart(10, '0')}`}
      subTitle={'Select an action below'}
      saleNumber={sale.number}
      upperBtnTitle={'Has shipped'}
      upperBtnLoading={hasShippedLoading}
      upperBtnCheckbox
      guests={useGuests}
      checkBoxValue={hasShipped}
      shippedAt={shippedAt}
      upperBtnHandler={(value, shippedAt) => toggleHasShipped(value, shippedAt)}>
      {renderQuestions(useGuestIds)}
    </PrintModal>
  )
})
