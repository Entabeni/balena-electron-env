import React, { useState } from 'react'

import { ProductModal, Span, Button, Table, TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'
const AcessRows = React.memo(({ accessRecords, multi, selectAccessRecord, accessRecordsSelected, onScanClick }) => {
  const handleAccessRecordsSelected = (rowId, checked) => {
    if (rowId === 0) {
      const accessRecordsToSelect = {}
      accessRecords.forEach(accessRecord => {
        accessRecordsToSelect[accessRecord.id] = checked
      })
      selectAccessRecord(accessRecordsToSelect)
    } else {
      selectAccessRecord(prevAccessRecordsSelected => Object.assign({}, prevAccessRecordsSelected, { [rowId]: checked }))
    }
  }
  return accessRecords.map(({ id, guest }) => (
    <TableRow key={id}>
      {multi && (
        <TableCellData className="select-cell">
          <RoundedCheckboxInput
            className="table-checkbox"
            key={id}
            id={id}
            field={id}
            onClickHandler={(id, value) => handleAccessRecordsSelected(id, value)}
            checked={accessRecordsSelected[id] || false}
          />
        </TableCellData>
      )}
      <TableCellData leftAligned>{guest.firstName}</TableCellData>
      <TableCellData leftAligned>{guest.lastName}</TableCellData>
      <TableCellData leftAligned>{guest.email}</TableCellData>
      {!multi && (
        <TableCellData className="action-cell">
          <Button
            margin="0 auto"
            kind="greenOutline"
            sizeH="short"
            customWidth="auto"
            icon="IoMdPersonAdd"
            iconSize="1em"
            onClickHandler={() => onScanClick(id)}
          />
        </TableCellData>
      )}
    </TableRow>
  ))
})
const SelectAccessRecordModal = ({ saleNumber, accessRecords, onScanClick, onPrintClick, multi, onCancelClick }) => {
  const [accessRecordsSelected, selectAccessRecord] = useState({})

  const renderTitle = () => {
    if (!saleNumber) {
      return 'Access Records'
    } else {
      return (
        <React.Fragment>
          Access Records for Sale{' '}
          <Span lineHeight="2.25rem" padding="0.25rem 1rem">
            {saleNumber.toString().padStart(10, '0')}
          </Span>
        </React.Fragment>
      )
    }
  }

  // Table SetUp
  const rowsToShow = 8
  const tableCols = [
    { leftAligned: true, text: 'First Name' },
    { leftAligned: true, text: 'Last Name' },
    { leftAligned: true, text: 'Email' },
    { celltype: 'action-cell', text: 'Rescan' }
  ]
  let cellCustomWidths = { '3': 0.6 }

  // Adjusting the table columns & layout according to multi select option
  if (multi) {
    tableCols.unshift({ celltype: 'select-cell', text: 'Select' })
    tableCols.pop()
    cellCustomWidths = { '0': 0.6, '3': 2 }
  }

  return (
    <ProductModal
      title={renderTitle()}
      subTitle={onPrintClick ? 'Select access records to print' : 'Select an access record to scan'}
      primaryBtnTitle={onPrintClick ? 'Print' : null}
      onPrimaryBtnHandler={onPrintClick ? () => onPrintClick(accessRecordsSelected) : null}
      primaryBtnMargin="0 0 0 4rem"
      primaryBtnDisabled={Object.keys(accessRecordsSelected).filter(accessRecord => accessRecordsSelected[accessRecord]).length === 0}
      onCancelHandler={onCancelClick}
      lightLayout
      withScrollableTable>
      <Table
        lightTheme
        noResultsMessage="There are not access records to show"
        headerData={tableCols}
        headerStyles={{ borderTop: true }}
        cellCustomWidths={cellCustomWidths}
        verticalScroll={rowsToShow}>
        <AcessRows
          accessRecords={accessRecords}
          multi={multi}
          selectAccessRecord={selectAccessRecord}
          accessRecordsSelected={accessRecordsSelected}
          onScanClick={onScanClick}
        />
      </Table>
    </ProductModal>
  )
}

export default SelectAccessRecordModal
