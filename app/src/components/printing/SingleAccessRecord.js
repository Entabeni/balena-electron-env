import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, H2, RoundedAvatar } from 'es-components'
import { withToastManager } from 'react-toast-notifications'
import { PrintStatusModal } from './PrintStatusModal'

import { UPDATE_ACCESS_RECORD } from '../../pages/dashboard/schema'
import { CREATE_ACCESS_RECORD_PRINT_JOB_MUTATION } from '../../pages/dashboard/schema'
const { ipcRenderer } = window.require('electron')

const PrintJob = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 345px;
  position: relative;
  box-shadow: 2px 2px 2px rgba(100, 100, 100, 10%);
  min-width: 300px;
  align-items: stretch;
  padding: 10px 15px 20px;
  background-color: ${props => (props.scanColor ? props.theme[props.scanColor] : props.theme.white)};
  flex-direction: column;
  border-radius: 5px;
  flex: 1;
`

const PrintJobContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 380px;
  padding: 12px 0 15px;
  justify-content: space-between;
  align-items: center;
`

const PrintJobButtons = styled.div`
  display: grid;
  grid-gap: 15px;
  justify-items: center;
  align-content: center;
`

export const SingleAccessRecord = React.memo(
  withToastManager(({ toastManager, accessRecord, currentPrintJob, client, saleId, updateLocalPrintJob, handleScanAccessRecord }) => {
    const [scanColor, setScanColor] = useState(null)
    const [printing, setPrinting] = useState(false)
    const [scanning, setScanning] = useState(false)
    const createPrintJob = () => {
      setPrinting(true)
      setScanColor(null)
      toastManager.add('Print Job Created', { appearance: 'success', autoDismiss: true })
      client
        .mutate({
          mutation: CREATE_ACCESS_RECORD_PRINT_JOB_MUTATION,
          variables: {
            saleId,
            accessRecordId: accessRecord.id,
            printTerminalId: window.localStorage.getItem('printTerminalId')
          }
        })
        .then(res => {
          if (res.data.pos.createAccessRecordPrintJob) {
            const printData = JSON.parse(res.data.pos.createAccessRecordPrintJob.printData)
            ipcRenderer.send('print-button', printData.pdfUrl)
          }
        })
        .catch(err => {
          setPrinting(false)
          toastManager.add('An Error Occured', { appearance: 'error', autoDismiss: true })
        })
    }

    const handleScanClicked = () => {
      setScanning(true)
      ipcRenderer.send('scan-button')
      ipcRenderer.once('scan-reply', (event, arg) => {
        if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
          setScanning(false)

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
            .mutate({ mutation: UPDATE_ACCESS_RECORD, variables: { id: accessRecord.id, cardRfid: arg } })
            .then(({ data }) => {
              setScanning(false)
              setPrinting(false)
              if (data.pos.updateAccessRecord.id) {
                setScanColor('lightGreen')
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
              setScanning(false)
              setPrinting(false)
              toastManager.add('Access Record Update Failed', {
                appearance: 'error',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            })
        }
      })
    }

    let buttons
    buttons = (
      <>
        <Button
          icon="IoMdPrint"
          iconSize="2rem"
          floatingIcon={!printing && { left: '0.75rem' }}
          key="print"
          kind="primary"
          loading={printing}
          title={'Print New Card'}
          rounded
          customWidth="100%"
          customPadding={printing ? '1rem 1rem 1rem 1rem' : '1rem 1rem 1rem 3rem'}
          onClickHandler={() => createPrintJob()}
        />
        <Button
          customWidth="100%"
          customPadding={scanning ? '1rem 1rem 1rem 1rem' : '1rem 1rem 1rem 3rem'}
          floatingIcon={!scanning && { left: '0.75rem' }}
          iconSize="2rem"
          icon="IoMdBarcode"
          rounded
          key="scan"
          loading={scanning}
          kind="primary"
          title={scanning ? 'Scanning' : 'Scan Card'}
          onClickHandler={() => handleScanClicked()}
        />
      </>
    )

    return (
      <PrintJob key={accessRecord.id} scanColor={scanColor}>
        {printing && (
          <PrintStatusModal
            handleScanCard={() => {
              handleScanClicked()
            }}
            scanning={scanning}
            handleCloseModal={() => setPrinting(false)}></PrintStatusModal>
        )}
        <PrintJobContent>
          <H2 id="cardhex" color={scanColor ? 'white' : 'greyDark'} size="1.7em">
            {accessRecord.guest.firstName} {accessRecord.guest.lastName}
          </H2>
          <RoundedAvatar square imageURL={accessRecord.guest.profilePictureUrlExtraLarge} width="100%" size={'306px'} />
        </PrintJobContent>
        <PrintJobButtons>{buttons}</PrintJobButtons>
      </PrintJob>
    )
  })
)
