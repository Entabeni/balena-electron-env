import React, { useEffect, useState, useCallback } from 'react'

import { withToastManager } from 'react-toast-notifications'
import { parseDateToFormat } from 'es-libs'

import {
  MainPanelWrapper,
  SalesDashHeader,
  SalesTable,
  TableRow,
  TableCellData,
  PreviousSaleModal,
  SelectAccessRecordModal,
  IntegratedCreditPaymentsModal,
  AccessRecordPrintModal,
  EventLineItemsModal
} from 'es-components'

import { CREATE_PRINT_JOB_MUTATION, CREATE_EMAIL_ORDER, GET_ACCOUNT_INFO, GET_SALE_DETAILS_BY_ID, GET_ORDER_DETAILS_BY_ID } from './schema'
const { ipcRenderer } = window.require('electron')

// Shared tables setup
const rowsToShow = 10

// Event line items modal table setup
const eventLineItemsTableCols = [
  { leftAligned: true, text: 'Guest' },
  { leftAligned: true, text: 'Event' },
  { leftAligned: true, text: 'Event Group' },
  'Start Time'
]
let variables = {}

const eventLineItemsCellCustomWidths = { '3': 0.9 }
const originalSearchableAttributes = ['guestName', 'number', 'total']

const SalesPage = withToastManager(({ client, currentOrderId, onCreateRefund, onPaymentAdded, toastManager }) => {
  const [useSaleSelected, setStateSaleSelected] = useState(null)
  const [saleSelectedLoading, setSaleSelectedLoading] = useState(false)
  const [usePrinting, setPrinting] = useState(false)
  const [useAddRefundModalOpen, setAddRefundModalOpen] = useState(false)
  const [useReceiptPrintLoading, setPrintingReceipt] = useState(false)
  const [useSearchText, setSearchText] = useState('')
  const [useAccessRecordsSelected, setAccessRecordsSelected] = useState([])
  const [useEventLineItemsModalOpen, setEventLineItemsModalOpen] = useState(false)
  const [useLoadingEventModal, setLoadingEventModal] = useState(false)
  const [useEventLineItemsSaleNumber, setEventLineItemsSaleNumber] = useState(null)
  const [useEventLineItems, setEventLineItems] = useState([])
  const [useAccount, setAccount] = useState(null)
  const [useActiveSearch, setActiveSearch] = useState({ purchaser: true, number: true, total: true })
  const [useAttributesToSearchFor, setAttributesToSearchFor] = useState(originalSearchableAttributes)
  useEffect(() => {
    try {
      client.query({ query: GET_ACCOUNT_INFO }).then(result => {
        if (!!result && result.data.pos.account) {
          setAccount(result.data.pos.account)
        } else {
          throw new Error('There was an error with the response from the server.')
        }
      })
    } catch (error) {
      toastManager.add('The retrieval of the account info failed.', { appearance: 'error', autoDismiss: false })
    }
  }, [])

  const handlePrintReceiptClick = () => {
    setPrintingReceipt(true)

    client
      .mutate({
        mutation: CREATE_PRINT_JOB_MUTATION,
        variables: {
          printJobType: 'receipt',
          printTerminalId: getPrintingTerminal(),
          printData: JSON.stringify({ saleId: useSaleSelected.id }),
          saleId: useSaleSelected.id
        }
      })
      .then(res => {
        if (res.data.pos.createPrintJob.id) {
          console.log('🚀 ~ file: SalesPage.js ~ line 81 ~ handlePrintReceiptClick ~ res.data.pos.createPrintJob', res.data.pos.createPrintJob)
          ipcRenderer.send('receipt-button', res.data.pos.createPrintJob.printData)

          toastManager.add('Reciept Print Job Sent', { appearance: 'success', autoDismiss: true })
          setPrintingReceipt(false)
        }
      })
      .catch(() => {
        toastManager.add('Reciept Print Job Failed', { appearance: 'error', autoDismiss: true })
        setPrintingReceipt(false)
      })
  }

  const handlePrintCardClick = productIds => {
    setAccessRecordsSelected(useSaleSelected.accessRecords)
  }

  const handleSendEmailsClick = guestIds => {
    if (useSaleSelected && useSaleSelected.id && guestIds.length) {
      client.mutate({ mutation: CREATE_EMAIL_ORDER, variables: { saleId: useSaleSelected.id, guestIds: guestIds } }).then(res => {
        if (res.data.pos.email.success) {
          toastManager.add('Email was successfully sent.', { appearance: 'success', autoDismiss: true })
        }
      })
    }
  }

  const handleRefundBtnClick = (lineItems, refundShippingOption) => {
    if (lineItems.length > 0) {
      const { purchaser } = useSaleSelected
      setSaleSelected(null)
      const purchaserId = purchaser ? purchaser.id : null

      onCreateRefund(lineItems, purchaserId, refundShippingOption)
    }
  }

  const setSaleSelected = useCallback(saleId => {
    if (saleId) {
      setSaleSelectedLoading(true)
      client
        .query({ query: GET_SALE_DETAILS_BY_ID, variables: { id: saleId } })
        .then(result => {
          const { sale } = result.data.pos
          if (sale) {
            client.query({ query: GET_ORDER_DETAILS_BY_ID, variables: { id: sale.orderId } }).then(result2 => {
              const { shippingOptionPrice } = result2.data.pos.order
              if (shippingOptionPrice) {
                sale['shippingOption'] = { price: shippingOptionPrice }
              }
              setStateSaleSelected(sale)
              setSaleSelectedLoading(false)
            })
          }
        })
        .catch(() => {
          setStateSaleSelected(null)
        })
    } else {
      setStateSaleSelected(null)
    }
  }, [])

  const addIntegratedCreditPaymentsHandler = (payments, response) => {
    // check response status
    if (onPaymentAdded) {
      onPaymentAdded(payments)
    }
    setAddRefundModalOpen(!useAddRefundModalOpen)
  }

  const getPrintingTerminal = () => {
    return window.localStorage.getItem('printTerminalId')
  }

  const onSearchChangeHandler = useCallback(
    searchText => {
      setSearchText(searchText)
    },
    [useSearchText]
  )

  const handleCancelEventLineItemsModal = () => {
    setEventLineItems([])
    setEventLineItemsModalOpen(false)
    // setEventLineItemsPurchaser(null)
    setEventLineItemsSaleNumber(null)
  }

  const handleSearchParamsChange = useCallback(
    (searchParam, isActive) => {
      const paramsMap = {
        purchaser: 'guestName',
        number: 'number',
        total: 'total'
      }
      let modifiedAlgoliaAttributes

      if (!isActive) {
        modifiedAlgoliaAttributes = useAttributesToSearchFor.filter(attr => attr !== paramsMap[searchParam])
      } else {
        modifiedAlgoliaAttributes = useAttributesToSearchFor
        modifiedAlgoliaAttributes.push(paramsMap[searchParam])
      }

      setAttributesToSearchFor(modifiedAlgoliaAttributes)
      setActiveSearch({ ...useActiveSearch, [`${searchParam}`]: isActive })
    },
    [useActiveSearch]
  )

  const showAndLoadEventLineItems = useCallback(saleId => {
    setLoadingEventModal(true)
    client
      .query({ query: GET_SALE_DETAILS_BY_ID, variables: { id: saleId } })
      .then(result => {
        const { sale } = result.data.pos
        const { eventLineItems, number } = sale
        if (sale) {
          setEventLineItemsSaleNumber(number)
          setEventLineItems(eventLineItems)
          setEventLineItemsModalOpen(true)
        }
        setLoadingEventModal(false)
      })
      .catch(() => {
        setLoadingEventModal(false)
      })
  }, [])

  const renderEventLineItems = () => {
    return useEventLineItems.map(({ event, guestName }) => {
      const { day, eventEventGroups, id, name, startTime } = event
      return (
        <TableRow key={id}>
          <TableCellData leftAligned>{guestName}</TableCellData>
          <TableCellData leftAligned>{name}</TableCellData>
          <TableCellData leftAligned>{eventEventGroups && eventEventGroups[0].eventGroup && eventEventGroups[0].eventGroup.name}</TableCellData>
          <TableCellData paddingright="1rem">{parseDateToFormat(`${day} ${startTime}`, useAccount)}</TableCellData>
        </TableRow>
      )
    })
  }

  if (useSearchText !== '') {
    variables = {
      restrictSearchableAttributes: useAttributesToSearchFor,
      searchTerm: useSearchText
    }
  }

  return (
    <MainPanelWrapper centeredLayout disableHeader>
      <SalesDashHeader handleSearchParamsChange={handleSearchParamsChange} useActiveSearch={useActiveSearch} onSearchChangeHandler={onSearchChangeHandler} />
      <SalesTable setSaleSelected={setSaleSelected} showAndLoadEventLineItems={showAndLoadEventLineItems} account={useAccount} variables={variables} />
      {useAccessRecordsSelected.length > 0 && (
        <SelectAccessRecordModal
          saleNumber={useSaleSelected.number}
          accessRecords={useAccessRecordsSelected}
          onPrintClick={useAccessRecordsSelectedIds => {
            setAccessRecordsSelected(useAccessRecordsSelected.filter(({ id }) => Object.keys(useAccessRecordsSelectedIds).includes(id)))
            setPrinting(true)
          }}
          multi
          onCancelClick={() => setAccessRecordsSelected([])}
        />
      )}
      {(saleSelectedLoading || useSaleSelected !== null) && (saleSelectedLoading || useAccessRecordsSelected.length < 1) && (
        <PreviousSaleModal
          sale={useSaleSelected}
          saleSelectedLoading={saleSelectedLoading}
          onCancelClick={() => setSaleSelected(null)}
          onRefundClick={handleRefundBtnClick}
          onPrintReceiptClick={handlePrintReceiptClick}
          receiptPrintLoading={useReceiptPrintLoading}
          onPrintCardClick={handlePrintCardClick}
          onEmailClick={handleSendEmailsClick}
        />
      )}
      {usePrinting && (
        <AccessRecordPrintModal
          client={client}
          handleCloseModal={() => {
            setPrinting(false)
            setSaleSelected(null)
            setAccessRecordsSelected([])
          }}
          sale={{
            hasShipped: useSaleSelected.hasShipped,
            shippedAt: useSaleSelected.shippedAt,
            shippingAddressId: useSaleSelected.shippingAddressId,
            number: useSaleSelected.number,
            id: useSaleSelected.id,
            accessRecords: useAccessRecordsSelected
          }}
        />
      )}
      {useAddRefundModalOpen && (
        <IntegratedCreditPaymentsModal
          orderAmount={useSaleSelected.total}
          onCancelClick={() => setAddRefundModalOpen(!useAddRefundModalOpen)}
          onAddCreditPayments={addIntegratedCreditPaymentsHandler}
        />
      )}
      {(useLoadingEventModal || useEventLineItemsModalOpen) && (
        <EventLineItemsModal
          context="sale"
          useLoadingEventModal={useLoadingEventModal}
          saleNumber={useEventLineItemsSaleNumber}
          onCancelClick={handleCancelEventLineItemsModal}
          tableCellCustomWidths={eventLineItemsCellCustomWidths}
          tableHeaderData={eventLineItemsTableCols}
          tableContent={renderEventLineItems()}
          tableVerticalScroll={rowsToShow}
          tableWithScrollableTable
        />
      )}
    </MainPanelWrapper>
  )
})
export default SalesPage
