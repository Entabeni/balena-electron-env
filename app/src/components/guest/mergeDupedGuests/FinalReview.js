import React from 'react'
import styled from 'styled-components'

import { Span, Table, TableRow, TableCellData, Button, RoundedAvatar } from 'es-components'
import { displayDateFormat } from 'es-libs'

const ComparingStepWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 38rem;
  justify-content: space-between;
  max-height: 12rem;
  min-height: 38rem;
  min-width: 100%;
  overflow: hidden;
  position: relative;

  & > div:not(.buttons-wrapper) {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .buttons-wrapper {
    width: 100%;
  }
`

const MainEntryWrapper = styled.div`
  align-items: center;
  background-color: ${props => props.theme.greyLight} !important;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  max-height: 11rem;
  min-height: 11rem;
  width: 100%;
`

const TableWrapper = styled.div`
  max-height: calc(100% - (12rem + 60px));
  min-height: calc(100% - (12rem + 60px));
`

const AvatarWrapper = styled.div`
  max-width: 14rem;
  min-width: 14rem;
  padding: 0.5rem 2rem 0;
  text-align: center;
`

const DataWrapper = styled.div`
  flex-grow: 1;
  padding: 0;
`

const CategoryData = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 0.75rem;
  max-width: calc(100% - 11rem);
  min-width: calc(100% - 11rem);

  span:first-child {
    flex-basis: 10rem;
  }

  .data-value {
    flex-grow: 1;
    font-weight: 600;
    margin-left: 1rem;
  }
`

// Table SetUp
const rowsToShow = 4.75
const tableCols = ['', { leftAligned: true, text: 'The following guests entries will be deleted' }]
const cellCustomWidths = { '0': 0.5 }

export const DupedGuestsFinalReview = ({ dataToMerge, guestsToMerge, searchResultsToRefine, onConfirm: handleConfirm, onGoBack: handleGoBack }) => {
  const renderTableRows = data => {
    return data.map(guest => {
      if (guest === dataToMerge.customerNumber.value) return null
      const { objectID, customerNumber, firstName, lastName, dateOfBirth, email, profilePictureUrl } = searchResultsToRefine[guest]
      return (
        <TableRow key={`tr-${customerNumber}`} className="double-lined-row">
          <TableCellData className="avatar-cell">
            <RoundedAvatar imageURL={profilePictureUrl} size={'64px'} />
            <Span className="customer-number data-entry">{customerNumber}</Span>
          </TableCellData>
          <TableCellData leftAligned>
            <Span>{`${firstName} ${lastName}`}</Span>
            <Span>{dateOfBirth != null ? displayDateFormat(dateOfBirth) : ''}</Span>
            <Span>{email}</Span>
          </TableCellData>
        </TableRow>
      )
    })
  }
  return (
    <ComparingStepWrapper>
      <MainEntryWrapper>
        <AvatarWrapper>
          <RoundedAvatar imageURL={dataToMerge.profilePictureUrl.value} size="8rem" />
        </AvatarWrapper>
        <DataWrapper>
          {Object.entries(dataToMerge).map(([category, { label, value, blocked }]) => {
            return category !== 'profilePictureUrl' && category !== 'objectID' ? (
              <CategoryData key={category}>
                <Span>{`${label}:`}</Span>
                <Span className="data-value">{value}</Span>
              </CategoryData>
            ) : null
          })}
        </DataWrapper>
      </MainEntryWrapper>
      <TableWrapper>
        <Table
          lightTheme
          noResultsMessage="There are not duped entries to show"
          headerData={tableCols}
          headerStyles={{ borderTop: true }}
          cellCustomWidths={cellCustomWidths}
          verticalScroll={rowsToShow}>
          {renderTableRows(guestsToMerge)}
        </Table>
      </TableWrapper>
      <div className="buttons-wrapper">
        <Button title="Go back and adjust" kind="secondary" onClickHandler={handleGoBack} />
        <Button title="Confirm and merge" kind="primary" onClickHandler={handleConfirm} />
      </div>
    </ComparingStepWrapper>
  )
}
