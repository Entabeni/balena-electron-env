import React, { useEffect, useRef, useState } from 'react'
import { gql } from 'apollo-boost'
import moment from 'moment'
import { displayDateFormat, getDateFormat, saveDateFormat, parseDate } from 'es-libs'
import { DatePickerInput, Icon, LazyTable, SpinLoader, TableRow, TableCellData } from 'es-components'

const UPDATE_FOR_DATE_IN_SALE_LINE_ITEM = gql`
  mutation UpdateSaleLineItem($id: String!, $forDate: String!) {
    pos {
      updateSaleLineItem(id: $id, forDate: $forDate) {
        id
        forDate
      }
    }
  }
`

const rowsToShow = 8
const checkInsTableCols = [
  { leftAligned: true, text: 'Created' },
  { leftAligned: true, text: 'For Date' }
]
const checkInsCellCustomWidths = {}
// CheckIns modal table setup
const checkInsBaseQueryConfig = guestId => ({
  noResultsMessage: 'There are not matching check-ins to show',
  indexesForLoad: [
    {
      indexName: 'guestLineItems',
      options: {
        attributesToRetrieve: 'objectID,created,forDate,lineItemId',
        filters: `guestId:${guestId} AND lineItemType:SaleLineItem`
      }
    }
  ],
  type: 'algolia',
  cachePolicy: 'no-cache'
})

export const GuestCheckinsTable = ({ client, guestId, toastManager }) => {
  const [editingRow, setEditingRow] = useState(null)
  const [forDateValue, setForDateValue] = useState(null)
  const [showForDateLoadingSpinner, setShowForDateLoadingSpinner] = useState(false)
  const [shouldUpdateRecord, setShouldUpdateRecord] = useState(false)
  const [dateError, setDateError] = useState(null)
  const forDateInputRef = useRef()

  const toggleEditingRow = (objectID, forDate) => {
    if (editingRow !== objectID) {
      setDateError(null)
    }
    setForDateValue(editingRow === objectID ? null : displayDateFormat(forDate))
    setEditingRow(editingRow === objectID ? null : objectID)
  }

  const handleUpdateForDate = (objectID, forDate, lineItemId) => {
    setShowForDateLoadingSpinner(true)
    client
      .mutate({
        mutation: UPDATE_FOR_DATE_IN_SALE_LINE_ITEM,
        variables: {
          id: lineItemId,
          forDate: saveDateFormat(forDate)
        }
      })
      .then(({ data }) => {
        if (data.pos && data.pos.updateSaleLineItem) {
          setForDateValue(displayDateFormat(data.pos.updateSaleLineItem.forDate))
          setShouldUpdateRecord(true)
          toastManager.add('CheckIn successfully updated.', {
            appearance: 'success',
            autoDismissTimeout: 3000,
            autoDismiss: true
          })
        } else {
          throw new Error('There was an error with the response from the server.')
        }
      })
      .catch(err => {
        toastManager.add('The update of the checkIn failed.', { appearance: 'error', autoDismiss: false })
      })
  }

  const clearUI = () => {
    setDateError(null)
    setEditingRow(null)
    setForDateValue(null)
    setShowForDateLoadingSpinner(false)
    setShouldUpdateRecord(false)
  }

  const handleRecordUpdate = list => {
    const i = list.findIndex(checkIn => checkIn.objectID === editingRow)
    const newList = list
    newList[i].forDate = forDateValue
    clearUI()
    return newList
  }

  const handleSubmit = ({ objectID, forDate, lineItemId, value }) => {
    if (!moment(value, getDateFormat()).isValid()) {
      setDateError('Invalid date, please review and try again.')
      return null
    }
    setDateError(null)
    if (forDateValue !== value) {
      handleUpdateForDate(objectID, value, lineItemId)
    } else {
      toggleEditingRow(objectID, forDate)
    }
  }

  const renderCheckInsItems = checkIns => {
    return checkIns
      .sort((a, b) => parseDate(b.forDate).getTime() - parseDate(a.forDate).getTime())
      .map(({ objectID, created, forDate, lineItemId }) => (
        <TableRow key={objectID} className="hoverable-row">
          <TableCellData leftAligned>{displayDateFormat(created)}</TableCellData>
          <TableCellData
            className="clickable-cell"
            leftAligned
            onClick={() => {
              if (editingRow !== objectID) {
                toggleEditingRow(objectID, forDate)
              }
            }}>
            {editingRow !== objectID && displayDateFormat(forDate)}
            {!showForDateLoadingSpinner && editingRow === objectID && (
              <DatePickerInput
                forwardedRef={forDateInputRef}
                id="forDate"
                field="forDate"
                initialValue={forDate}
                customError={dateError}
                errorLayout="single-row"
                label={`Date (${getDateFormat()})`}
                autoComplete="off"
                border="none"
                interBlock
                selfContainer={true}
                onBlur={e => {
                  if (e.relatedTarget === null || !/DayPicker\-/g.test(e.relatedTarget.className)) {
                    handleSubmit({ objectID, forDate, lineItemId, value: forDateInputRef.current.value })
                  }
                }}
                onCalendarClick={e => handleSubmit({ objectID, forDate, lineItemId, value: forDateInputRef.current.value })}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    handleSubmit({ objectID, forDate, lineItemId, value: forDateInputRef.current.value })
                  }
                }}
              />
            )}
            {!showForDateLoadingSpinner && editingRow !== objectID && <Icon className="fading-icon" name="FaEdit" size="1rem" />}
            {showForDateLoadingSpinner && editingRow === objectID && <SpinLoader color="primary" size="2rem" />}
          </TableCellData>
        </TableRow>
      ))
  }

  useEffect(() => {
    if (editingRow !== null && forDateInputRef.current) {
      forDateInputRef.current.getInputDOMNode().focus()
      forDateInputRef.current.setCursorPosition(0)
      forDateInputRef.current.getInputDOMNode().click()
    }
  }, [editingRow])

  return (
    <LazyTable
      lightTheme
      cellCustomWidths={checkInsCellCustomWidths}
      headerData={checkInsTableCols}
      onRecordUpdate={handleRecordUpdate}
      onSuccess={data => renderCheckInsItems(data)}
      queryConfig={{ ...checkInsBaseQueryConfig(guestId) }}
      shouldUpdateRecord={shouldUpdateRecord}
      verticalScroll={rowsToShow}
    />
  )
}
