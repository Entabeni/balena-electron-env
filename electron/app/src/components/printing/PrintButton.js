import React from 'react'
import { PrintRenderProp } from './PrintRenderProp'

export const PrintButton = ({ saleId, accessRecordId, handleAccessRecordUpdated, children }) => {
  return (
    <PrintRenderProp saleId={saleId} handleAccessRecordUpdated={handleAccessRecordUpdated} accessRecordId={accessRecordId}>
      {({ createPrintJob, scanning }) => children({ createPrintJob, scanning })}
    </PrintRenderProp>
  )
}
