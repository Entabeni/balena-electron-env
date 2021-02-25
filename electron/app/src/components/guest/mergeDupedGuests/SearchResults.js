import React from 'react'
import styled from 'styled-components'

import { displayDateFormat } from 'es-libs'
import { Span, LazyTable, TableRow, TableCellData, Button, RoundedCheckboxInput, RoundedAvatar } from 'es-components'

const GuestInfoCell = styled(TableCellData)`
  span {
    color: ${props => props.theme.greyDarkShade};
    font-size: 1rem;
    line-height: 1.25;

    &:first-child {
      margin-top: -0.25rem;
    }

    & + span {
      margin-top: 0.35rem;
    }
  }
`

// Table SetUp
const rowsToShow = 6.75
const tableCols = ['', { leftAligned: true, text: 'Guest Info' }, 'Select duplications']
const cellCustomWidths = { '0': 0.4, '2': 0.65 }

// Helper method to show searching matches on strings
const highlightMatch = (str, matchingTerm) => {
  if (str === null) return 'N/A'
  const regex = new RegExp(matchingTerm, 'ig')
  return str.replace(regex, match => `<b>${match}</b>`)
}

export const DupedGuestsSearchResults = ({
  baseQueryConfig,
  searchTerm,
  searchParams,
  searchResultsToRefine,
  guestsToMerge,
  onCheckboxClick: handleCheckboxClick,
  onContinue: handleContinue,
  onUnselect: handleUnselect
}) => {
  const filterResultsBySearchParams = data => {
    return data.filter(guest => {
      if (searchParams.firstName && searchParams.lastName) {
        const fullName = `${guest.firstName.toLowerCase()} ${guest.lastName.toLowerCase()}`
        if (fullName.indexOf(searchTerm.toLowerCase()) !== -1) {
          return true
        }
      } else {
        let lastNameSearchString = searchTerm.replace(' ', '').toLowerCase()
        let firstNameSearchString = searchTerm.replace(' ', '').toLowerCase()

        const nameArr = searchTerm.split(' ')
        if (nameArr.length === 2 && nameArr[1] !== '') {
          lastNameSearchString = nameArr[1].toLowerCase()
          firstNameSearchString = nameArr[0].toLowerCase()
        }

        if (searchParams.firstName && guest.firstName && guest.firstName.toLowerCase().indexOf(firstNameSearchString) !== -1) {
          return true
        }
        if (searchParams.lastName && guest.lastName && guest.lastName.toLowerCase().indexOf(lastNameSearchString) !== -1) {
          return true
        }
      }

      if (searchParams.email && guest.email && guest.email.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        return true
      }

      return false
    })
  }

  // Possible duped guests entries
  const renderTableRows = data => {
    return filterResultsBySearchParams(data).map(guest => {
      const { customerNumber, firstName, lastName, dateOfBirth, email, profilePictureUrl } = guest

      let lastNameSearchString = searchTerm.replace(' ', '').toLowerCase()
      let firstNameSearchString = searchTerm.replace(' ', '').toLowerCase()

      const nameArr = searchTerm.split(' ')
      if (nameArr.length === 2 && nameArr[1] !== '') {
        lastNameSearchString = nameArr[1].toLowerCase()
        firstNameSearchString = nameArr[0].toLowerCase()
      }

      return (
        <TableRow key={`tr-${customerNumber}`} className="double-lined-row">
          <TableCellData className="avatar-cell">
            <RoundedAvatar imageURL={profilePictureUrl} size={'64px'} />
            <Span className="customer-number data-entry">{customerNumber}</Span>
          </TableCellData>
          <GuestInfoCell leftAligned>
            {searchParams.firstName && !searchParams.lastName && (
              <Span dangerouslySetInnerHTML={{ __html: `${highlightMatch(`${firstName}`, firstNameSearchString)} ${lastName}` }} />
            )}
            {!searchParams.firstName && searchParams.lastName && (
              <Span dangerouslySetInnerHTML={{ __html: `${firstName} ${highlightMatch(`${lastName}`, lastNameSearchString)}` }} />
            )}
            {searchParams.firstName && searchParams.lastName && (
              <Span dangerouslySetInnerHTML={{ __html: highlightMatch(`${firstName} ${lastName}`, searchTerm) }} />
            )}
            {!searchParams.firstName && !searchParams.lastName && <Span>{`${firstName} ${lastName}`}</Span>}
            <Span>{dateOfBirth != null ? displayDateFormat(dateOfBirth) : ''}</Span>
            {searchParams.email ? <Span dangerouslySetInnerHTML={{ __html: highlightMatch(email, searchTerm) }} /> : <Span>{email}</Span>}
          </GuestInfoCell>
          <TableCellData cellType="action-cell">
            <RoundedCheckboxInput
              className="data-entry-checkbox no-label"
              id={`${customerNumber}-isDuped`}
              checked={searchResultsToRefine[customerNumber]}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, guest)}
            />
          </TableCellData>
        </TableRow>
      )
    })
  }
  // Table with buttons
  const renderDupedGuestsSearchResults = () => {
    return (
      <React.Fragment>
        <LazyTable
          id="deDupedGuestTable"
          lightTheme
          queryConfig={searchTerm === '' ? {} : { ...baseQueryConfig, variables: { searchTerm } }}
          headerData={tableCols}
          headerStyles={{ borderTop: true }}
          cellCustomWidths={cellCustomWidths}
          verticalScroll={rowsToShow}
          onSuccess={data => renderTableRows(data)}
        />
        <div className="buttons-wrapper">
          <Button disabled={guestsToMerge.length < 1} title="Unselect All" kind="secondary" onClickHandler={handleUnselect} />
          <Button disabled={guestsToMerge.length < 2} title="Continue" kind="primary" onClickHandler={handleContinue} />
        </div>
      </React.Fragment>
    )
  }
  return renderDupedGuestsSearchResults()
}
