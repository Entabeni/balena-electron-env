import React, { useState } from 'react'
import styled from 'styled-components'
import { parseDateToFormat } from 'es-libs'
import { Mutation } from 'react-apollo'
import dayjs from 'dayjs'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'

import { BasicForm, Table, TableRow, TableCellData, Button, DayPickerCalendar } from 'es-components'
import { UPDATE_ACCESS_RECORD } from './../../pages/dashboard/schema'
const { ipcRenderer } = window.require('electron')

const EventFormWrap = styled.div`
  position: absolute;
`
const EventForm = styled(BasicForm)`
  z-index: 10;
  padding: 0;
  position: absolute;
  width: auto;
  min-height: auto;
  padding: auto;
  box-shadow: 0px 5px 12px 0 rgba(0, 0, 0, 0.1);
`

const rowsToShow = 8
const tableCols = [
  { leftAligned: true, text: 'First Name' },
  { leftAligned: true, text: 'Last Name' },
  { leftAligned: true, text: 'Scanned Days' },
  { leftAligned: true, text: 'For Date', id: 'forDate', sortable: true, defaultDirection: 'up' },
  { leftAligned: true, text: 'Product Name' },
  { celltype: 'action-cell', text: '' }
]
let cellCustomWidths = { '0': 0.8, '1': 0.8, '2': 0.8, '3': 0.6, '4': 1.5 }

export const GuestAccessRecords = withToastManager(
  withApollo(({ client, toastManager, guest, useAccessRecords, account, selectedAccessRecord, printing, onPrintClick }) => {
    const [useCurrentForDate, setCurrentForDate] = useState(null)
    const [scanning, setScanning] = useState(false)

    const [accessRecords, setAccessRecords] = useState(useAccessRecords.sort((a, b) => b.forDateUnix - a.forDateUnix))
    const [useEditingAccessRecord, setEditingAccessRecord] = useState(null)
    const onEditClick = id => {
      setEditingAccessRecord(id === useEditingAccessRecord ? null : id)
    }
    const handleScanClicked = id => {
      setScanning(id)
      ipcRenderer.send('scan-button')
      ipcRenderer.once('scan-reply', (event, arg) => {
        if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
          setScanning(true)

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
            .mutate({ mutation: UPDATE_ACCESS_RECORD, variables: { id: id, cardRfid: arg } })
            .then(({ data }) => {
              setScanning(false)
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
              setScanning(false)
              toastManager.add('Access Record Update Failed', {
                appearance: 'error',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            })
        }
      })
    }

    const onChangeSorting = (column, direction) => {
      let newOrderAccessRecords = JSON.parse(JSON.stringify(accessRecords))
      if (column === 'forDate') {
        if (direction === 'down') {
          newOrderAccessRecords = newOrderAccessRecords.sort((a, b) => a.forDateUnix - b.forDateUnix)
        } else if (direction === 'up') {
          newOrderAccessRecords = newOrderAccessRecords.sort((a, b) => b.forDateUnix - a.forDateUnix)
        }
      }

      setAccessRecords(newOrderAccessRecords)
    }

    return (
      <>
        <Table
          lightTheme
          noResultsMessage="There are not access records to show"
          headerData={tableCols}
          onChangeSorting={onChangeSorting}
          headerStyles={{ borderTop: true }}
          cellCustomWidths={cellCustomWidths}
          verticalScroll={rowsToShow}>
          {accessRecords.map(accessRecord => {
            accessRecord.id = accessRecord.objectID
            accessRecord.productName = JSON.parse(accessRecord.productJson).name
            accessRecord.guest = JSON.parse(accessRecord.guestJson)

            const { guest, id, saleId, forDate, productName, scannedDays } = accessRecord
            console.log('🚀 ~ file: GuestAccessRecords.js ~ line 109 ~ withApollo ~ id', id)
            const isEditingAccessRecord = id === useEditingAccessRecord
            return (
              <Mutation key={id} mutation={UPDATE_ACCESS_RECORD}>
                {(updateAccessRecord, { data: upadateAccessRecordData, loading: updateAccessRecordLoading }) => {
                  let updatedForDate = forDate
                  if (upadateAccessRecordData && upadateAccessRecordData.pos.updateAccessRecord.forDate) {
                    updatedForDate = upadateAccessRecordData.pos.updateAccessRecord.forDate
                  }
                  return (
                    <TableRow>
                      <TableCellData leftAligned>{guest.firstName}</TableCellData>
                      <TableCellData leftAligned>{guest.lastName}</TableCellData>
                      <TableCellData>{scannedDays}</TableCellData>
                      {isEditingAccessRecord ? (
                        <TableCellData leftAligned>
                          <EventFormWrap>
                            <EventForm>
                              <DayPickerCalendar
                                width="100%"
                                id="forDate"
                                field="forDate"
                                autoComplete="off"
                                daySelected={forDate}
                                days={[]}
                                onDateSelected={day => {
                                  setCurrentForDate(day)
                                }}
                              />
                            </EventForm>
                          </EventFormWrap>
                        </TableCellData>
                      ) : (
                        <TableCellData leftAligned>{updatedForDate ? parseDateToFormat(updatedForDate, account, false) : ''}</TableCellData>
                      )}
                      <TableCellData leftAligned>{productName}</TableCellData>
                      <TableCellData className="action-cell">
                        <Button
                          kind={isEditingAccessRecord ? 'red' : 'primary'}
                          hoverBgColor="red"
                          loading={updateAccessRecordLoading}
                          btnType={isEditingAccessRecord && 'submit'}
                          icon={isEditingAccessRecord ? 'IoMdCheckmarkCircleOutline' : 'FaEdit'}
                          iconSize="1.25rem"
                          onClickHandler={e => {
                            if (!isEditingAccessRecord) {
                              onEditClick(id)
                            } else {
                              updateAccessRecord({ variables: { id, forDate: dayjs(useCurrentForDate).format('YYYY-MM-DD') } })
                              onEditClick(id)
                            }
                          }}
                        />
                        <Button
                          loading={scanning === id}
                          kind="primary"
                          hoverBgColor="red"
                          icon="IoMdBarcode"
                          iconSize="1.25rem"
                          onClickHandler={() => handleScanClicked(id)}
                        />
                        <Button
                          loading={selectedAccessRecord === id && printing}
                          kind="primary"
                          hoverBgColor="red"
                          disabled={!saleId}
                          icon="MdPrint"
                          iconSize="1.25rem"
                          onClickHandler={() => onPrintClick(accessRecord, saleId)}
                        />
                      </TableCellData>
                    </TableRow>
                  )
                }}
              </Mutation>
            )
          })}
        </Table>
      </>
    )
  })
)
