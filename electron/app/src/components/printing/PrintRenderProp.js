import React from 'react'
import { withToastManager } from 'react-toast-notifications'
import { PrintStatusModal } from './PrintStatusModal'
import { CREATE_ACCESS_RECORD_PRINT_JOB_MUTATION } from '../../pages/dashboard/schema'
import { withApollo } from 'react-apollo'

export const PrintRenderProp = withApollo(
  withToastManager(({ saleId, handleAccessRecordUpdated, accessRecordId, toastManager, client, children }) => {
    const [printing, setPrinting] = React.useState(false)

    const createPrintJob = () => {
      setPrinting(true)
      client
        .mutate({
          mutation: CREATE_ACCESS_RECORD_PRINT_JOB_MUTATION,
          variables: {
            saleId,
            accessRecordId: accessRecordId,
            printTerminalId: window.localStorage.getItem('printTerminalId')
          }
        })
        .then(res => {
          if (res.data.pos.createAccessRecordPrintJob) {
            toastManager.add('Print Job Sent', { appearance: 'success', autoDismiss: true })
          }
        })
        .catch(err => {
          setPrinting(false)
          toastManager.add('An Error Occured', { appearance: 'error', autoDismiss: true })
        })
    }
    return (
      <>
        {printing && (
          <PrintStatusModal
            handleAccessRecordUpdated={() => {
              handleAccessRecordUpdated()
              setPrinting(false)
            }}
            accessRecordId={accessRecordId}
            handleCloseModal={() => setPrinting(false)}></PrintStatusModal>
        )}
        {children({ createPrintJob, printing })}
      </>
    )
  })
)
