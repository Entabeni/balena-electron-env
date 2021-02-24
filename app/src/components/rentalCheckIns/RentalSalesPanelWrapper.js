import React from 'react'
import { Mutation, Subscription } from 'react-apollo'
import {
  CREATE_SCAN_JOB_MUTATION,
  GET_RENTAL_SALE_BY_ID_QUERY,
  GET_SALE_QUERY,
  PRINT_JOBS_SUBSCRIPTION,
  SCAN_JOBS_SUBSCRIPTION,
  UPDATE_ACCESS_RECORD
} from '../../pages/dashboard/schema'

// Components
import { LazyTable, ScanStatusModal, AccessRecordPrintModal } from 'es-components'
import { RentalSaleListElement } from './RentalSaleListElement'
import { withToastManager } from 'react-toast-notifications'
const { ipcRenderer } = window.require('electron')

// Table SetUp
const baseQueryConfig = {
  noResultsMessage: 'There are not matching results to show',
  query: GET_RENTAL_SALE_BY_ID_QUERY,
  type: 'graphql'
}
const rowsToShow = 8
const tableCols = [{ leftAligned: true, text: 'Name' }, 'Age', 'Height', 'Weight', 'Discipline', 'Type', 'Stance', 'For Date', 'Sale Number', 'Scan', 'Print']
const cellCustomWidths = { '0': 2, '1': 0.7 }

// Main component
class RentalSalesPanelWrapper extends React.Component {
  state = {
    selectedAccessRecord: null,
    scanning: false,
    printing: false,
    initPrinting: false,
    useLinkedSale: null,
    canClearScanning: false,
    scanButtonLoading: false
  }

  onPrintClick = (accessRecord, linkedSaleId) => {
    const { client } = this.props

    client.query({ query: GET_SALE_QUERY, variables: { id: linkedSaleId } }).then(result => {
      this.setState({
        selectedAccessRecord: accessRecord,
        useLinkedSale: result.data.pos.sale,
        printing: true,
        initPrinting: true,
        useUpdateAccessRecord: null
      })
    })
  }

  onScanClick = accessRecordId => {
    const { client, toastManager } = this.props
    this.setState({ scanning: true, selectedAccessRecord: accessRecordId }, () => {
      console.log('🚀 ~ file: RentalSalesPanelWrapper.js ~ line 57 ~ this.setState ~ accessRecordId', accessRecordId)
      ipcRenderer.send('scan-button')
      ipcRenderer.once('scan-reply', (event, arg) => {
        this.setState({ scanning: false })
        if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
          let text
          switch (arg) {
            case 'OPEN-ERROR':
              text = 'Error connecting to scanner'
              break
            case 'SCAN-ERROR':
              text = 'Error writing to scanner'
              break
            case 'NO-SCAN':
              text = 'Card not detected'
              break
            default:
              text = 'An error occured'
          }
          toastManager.add(text, {
            appearance: 'error',
            autoDismissTimeout: 3000,
            autoDismiss: true
          })
        } else {
          client
            .mutate({ mutation: UPDATE_ACCESS_RECORD, variables: { id: accessRecordId, cardRfid: arg } })
            .then(({ data }) => {
              this.setState({ scanning: false })

              if (data.pos.updateAccessRecord.id) {
                toastManager.add('Access Record Updated', {
                  appearance: 'success',
                  autoDismissTimeout: 3000,
                  autoDismiss: true
                })
              } else {
                toastManager.add('Access Record Update Failed', {
                  appearance: 'error',
                  autoDismissTimeout: 3000,
                  autoDismiss: true
                })
              }
            })
            .catch(err => {
              this.setState({ scanning: false })
              toastManager.add('Access Record Update Failed', {
                appearance: 'error',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            })
        }
      })
    })
  }

  renderGuestCheckIns = data => {
    if (data.pos && data.pos.rentalSale && data.pos.rentalSale.todaysRentalSaleLineItems[0]) {
      const { todaysRentalSaleLineItems } = data.pos.rentalSale
      const guestLineItems = []
      if (todaysRentalSaleLineItems.length) {
        todaysRentalSaleLineItems.forEach(todaysRentalSaleLineItem => {
          guestLineItems.push(...todaysRentalSaleLineItem.guestLineItems)
          if (todaysRentalSaleLineItem.upsellSaleLineItems && todaysRentalSaleLineItem.upsellSaleLineItems.length > 0) {
            todaysRentalSaleLineItem.upsellSaleLineItems.forEach(upsellSaleLineItem => {
              guestLineItems.push(...upsellSaleLineItem.guestLineItems)
            })
          }
        })
      }
      const { measurement } = data.pos.account
      return guestLineItems.map((guestLineItem, i) => {
        return (
          <RentalSaleListElement
            id={i}
            key={guestLineItem.id}
            guest={guestLineItem.guest}
            saleNumber={data.pos.rentalSale.number.toString().padStart(10, '0')}
            forDate={data.pos.rentalSale.todaysRentalSaleLineItems[0].forDate}
            productInfo={guestLineItem.accessRecord ? guestLineItem.accessRecord.productJson : null}
            measurement={measurement}
            selectedAccessRecordId={this.state.selectedAccessRecord}
            scanning={this.state.scanning}
            printing={this.state.initPrinting}
            accessRecord={guestLineItem.accessRecord ? guestLineItem.accessRecord : null}
            saleId={data.pos.rentalSale.id}
            onScanClick={this.onScanClick}
            onPrintClick={this.onPrintClick}
            rentalAssets={guestLineItem.rentalAssets}
          />
        )
      })
    }
  }

  render() {
    const { printing, useLinkedSale, selectedAccessRecord } = this.state
    const { client, toastManager } = this.props

    const queryConfig = { ...baseQueryConfig, variables: { id: this.props.saleId } }
    return (
      <React.Fragment>
        <LazyTable
          lightTheme
          cellCustomWidths={cellCustomWidths}
          headerData={tableCols}
          onSuccess={data => this.renderGuestCheckIns(data)}
          queryConfig={queryConfig}
          verticalScroll={rowsToShow}
        />
        <>
          {printing && (
            <AccessRecordPrintModal
              client={client}
              handleCloseModal={() => {
                this.setState({ printing: false, useLinkedSale: null, selectedAccessRecord: null })
              }}
              sale={{
                id: useLinkedSale.id,
                shippedAt: useLinkedSale.shippedAt,
                hasShipped: useLinkedSale.hasShipped,
                shippingAddressId: useLinkedSale.shippingAddressId,
                number: useLinkedSale.number,
                accessRecords: [selectedAccessRecord]
              }}
            />
          )}
        </>
      </React.Fragment>
    )
  }
}

export default withToastManager(RentalSalesPanelWrapper)
