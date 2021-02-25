import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'

import { parseDateToFormat, validateRequired } from 'es-libs'
import { Table, TableRow, TableCellData, StandardForm, TextArea, H4 } from 'es-components'

const notesTableCols = [
  { leftAligned: true, text: 'Note' },
  { leftAligned: true, text: 'Created' },
  { leftAligned: true, text: 'Created By' }
]
const rowsToShow = 8

const NoteForm = styled.div`
  z-index: 10;
  padding: 0;
  margin-top: 30px;
  width: auto;
  min-height: auto;
  padding: auto;
`

const CREATE_NOTE = gql`
  mutation UpdateGuest($guestId: String!, $notes: [PosNoteInput]) {
    pos {
      updateGuest(id: $guestId, notes: $notes) {
        id
        noteIds
      }
    }
  }
`
const notesCellCustomWidths = { '0': 2, '1': 0.5, '2': 0.5 }

const editFormButtonsCustomStyles = {
  customHeight: '3.625rem',
  customPadding: '1rem',
  fontSize: '1.25rem',
  fontWeight: '700'
}
export const GuestNotes = withApollo(
  ({ setErrorMsg, useCreateNoteOpen, guest, setCreateNoteOpen, client, account, loggedAccount, notes, onNewNote: handleReloadNotes }) => {
    const [useSelectedNote, setSelectedNote] = useState(null)
    const [useGuestId, setGuestId] = useState(null)
    const [useNoteLoading, setNoteLoading] = useState(false)

    const renderNotes = () => {
      return (
        <Table lightTheme cellCustomWidths={notesCellCustomWidths} headerData={notesTableCols} verticalScroll={rowsToShow}>
          {notes.map(({ objectID, created, message, userFullName }) => (
            <TableRow key={objectID}>
              <TableCellData leftAligned>{message}</TableCellData>
              <TableCellData leftAligned>{parseDateToFormat(created, account)}</TableCellData>
              <TableCellData leftAligned>{userFullName}</TableCellData>
            </TableRow>
          ))}
        </Table>
      )
    }

    const handleNoteCancelClick = () => {
      setCreateNoteOpen(false)
    }

    const handleNoteCreate = (guestId, { message }, createNote) => {
      const userId = window.localStorage.getItem('currentUserId')
      setGuestId(guestId)
      setSelectedNote([{ message, userId }])
      setNoteLoading(true)
    }

    useEffect(() => {
      if (useNoteLoading) {
        client
          .mutate({
            mutation: CREATE_NOTE,
            variables: { guestId: useGuestId, notes: useSelectedNote }
          })
          .then(() => {
            setTimeout(() => {
              setNoteLoading(false)
              setErrorMsg('')
              setCreateNoteOpen(false)
              if (handleReloadNotes && typeof handleReloadNotes === 'function') {
                handleReloadNotes()
              }
            }, 3000)
          })
      }
    }, [useNoteLoading])

    const renderCreateNoteForm = () => {
      return (
        <NoteForm>
          <H4 size="1.6rem" margin="1rem 0;">
            Add a Note*
          </H4>
          <StandardForm
            centeredButtons
            cancelButtonKind="primaryOutline"
            primaryButtonKind="red"
            buttonsCustomStyles={editFormButtonsCustomStyles}
            padding="0"
            loading={useNoteLoading}
            onCancelClick={handleNoteCancelClick}
            onSubmitHandler={values => handleNoteCreate(guest.id, values)}>
            <TextArea id="message" field="message" autoComplete="off" validate={validateRequired} validateOnChange />
          </StandardForm>
        </NoteForm>
      )
    }
    if (useCreateNoteOpen) {
      return renderCreateNoteForm()
    } else {
      return renderNotes()
    }
  }
)
