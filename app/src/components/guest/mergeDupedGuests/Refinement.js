import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Span, TextInput, Table, TableRow, TableCellData, Button, RoundedCheckboxInput, RoundedAvatar, MaskedTextInput } from 'es-components'

import { validateDOB, getDateFormat, validateEmail, displayDateFormat } from 'es-libs'

const ComparingStepWrapper = styled.div`
  align-items: normal;
  display: grid;
  grid-gap: 1rem;
  grid-template: auto 60px / 0.5fr 1.5fr;
  height: 38rem;
  justify-content: space-between;
  min-height: 38rem;
  min-width: 100%;
  overflow: hidden;
  position: relative;

  & > div:not(.buttons-wrapper) {
    overflow-x: hidden;
    overflow-y: auto;
  }
`

const MainEntryWrapper = styled.div`
  background-color: ${props => props.theme.greyLight} !important;
`

const DupedEntriesWrapper = styled.div`
  background-color: transparent;

  .data-entry {
    margin-bottom: 0.3rem;
  }

  .data-entry-checkbox {
    margin-bottom: 0.5rem;
    min-height: 28px;
    overflow-x: hidden;

    & > label + label {
      overflow: hidden;
      padding-top: 0.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`

const RoundedAvatarWrapper = styled.div`
  align-items: center;
`

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 0;
  text-align: center;
`

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 1.5rem 1rem;
`

const CategoryData = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:last-child {
    margin-bottom: 0;
  }

  &.customer-number {
    flex-direction: row;
    margin-top: 1rem;
    padding: 0 1.5rem;

    input {
      text-align: center;
    }
  }

  input {
    border: 1px solid ${props => props.theme.grey};
    box-shadow: none !important;
    box-sizing: border-box;
    font-weight: 400;
    height: 55px;
    outline: 0 !important;
    padding: 0 1rem;
    width: 100%;
    z-index: 1;

    &:disabled {
      background-color: #dedede;
    }

    &:hover:not(:disabled) {
      transition: all 0.4s;
      border-color: ${props => props.theme.greyDarkShade};
    }

    &:focus:not(:disabled) {
      border-color: ${props => props.theme.greyDarkShade};
    }
  }
`

// Table SetUp
const rowsToShow = 8
const tableCols = ['', 'Select the info to merge', '']
const cellCustomWidths = { '0': 0.5, '2': 0.85 }

export const DupedGuestsRefinement = ({
  searchResultsToRefine,
  guestsToMerge,
  dataToMerge,
  proceedToFinalReview,
  onCheckboxClick: handleCheckboxClick,
  onContinue: handleContinue,
  onTextFieldChange: handleTextFieldChange,
  onGoBack: handleGoBack,
  onDeselectAll: handleDeselectAll
}) => {
  const customerNumberFieldRef = useRef(null)
  // Refining options
  const renderTableRows = data => {
    return data.map(guestId => {
      const { customerNumber, firstName, lastName, dateOfBirth, email, profilePictureUrl } = searchResultsToRefine[guestId]
      return (
        <TableRow key={`tr-${customerNumber}`} className="double-lined-row">
          <TableCellData className="avatar-cell">
            <RoundedAvatar imageURL={profilePictureUrl} size={'64px'} />
            <Span className="customer-number data-entry">{customerNumber}</Span>
          </TableCellData>
          <TableCellData leftAligned cellType="select-cell">
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-firstname`}
              label={firstName}
              checked={dataToMerge.firstName.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, ['firstName', firstName, customerNumber])}
            />
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-lastname`}
              label={lastName}
              checked={dataToMerge.lastName.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, ['lastName', lastName, customerNumber])}
            />
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-email`}
              label={email}
              checked={dataToMerge.email.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, ['email', email, customerNumber])}
            />
          </TableCellData>
          <TableCellData leftAligned cellType="select-cell">
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-dob`}
              label={dateOfBirth ? displayDateFormat(dateOfBirth) : null}
              checked={dataToMerge.dateOfBirth.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) =>
                handleCheckboxClick(fieldValue, ['dateOfBirth', dateOfBirth ? displayDateFormat(dateOfBirth) : null, customerNumber])
              }
            />
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-picture`}
              label="Use Picture"
              checked={dataToMerge.profilePictureUrl.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, ['profilePictureUrl', profilePictureUrl, customerNumber])}
            />
            <RoundedCheckboxInput
              className="data-entry-checkbox"
              id={`${customerNumber}-customerNumber`}
              label="Use Guest ID"
              checked={dataToMerge.customerNumber.linkedGuest === customerNumber}
              onClickHandler={(fieldId, fieldValue) => handleCheckboxClick(fieldValue, ['customerNumber', customerNumber, customerNumber])}
            />
          </TableCellData>
        </TableRow>
      )
    })
  }

  useEffect(() => {
    if (!dataToMerge.customerNumber.value && !dataToMerge.customerNumber.linkedGuest) {
      customerNumberFieldRef.current.value = null
    }
  }, [dataToMerge])

  const renderRefinementGuestFlow = () => {
    return (
      <ComparingStepWrapper>
        <MainEntryWrapper>
          <AvatarWrapper>
            <RoundedAvatarWrapper>
              <RoundedAvatar imageURL={dataToMerge.profilePictureUrl.value} size="8rem" />
            </RoundedAvatarWrapper>
            <CategoryData className="customer-number">
              <input
                ref={customerNumberFieldRef}
                type="text"
                disabled={true}
                name="customerNumber"
                placeholder={dataToMerge.customerNumber.label}
                value={dataToMerge.customerNumber.value}
              />
            </CategoryData>
          </AvatarWrapper>
          <DataWrapper>
            {Object.entries(dataToMerge).map(([category, { label, value, blocked }]) => {
              if (category === 'dateOfBirth') {
                return (
                  <CategoryData key={category}>
                    <MaskedTextInput
                      label={`Date of Birth (${getDateFormat()})`}
                      disabled={blocked}
                      name={category}
                      value={value}
                      validate={validateDOB}
                      onChange={handleTextFieldChange}
                      validateOnChange
                    />
                  </CategoryData>
                )
              } else if (category === 'email') {
                return (
                  <CategoryData key={category}>
                    <TextInput
                      type="text"
                      id={category}
                      disabled={blocked}
                      field={category}
                      label={label}
                      value={value}
                      onChange={handleTextFieldChange}
                      validate={validateEmail}
                      validateOnChange
                    />
                  </CategoryData>
                )
              } else {
                return category !== 'profilePictureUrl' && category !== 'customerNumber' && category !== 'objectID' ? (
                  <CategoryData key={category}>
                    <TextInput id={category} type="text" disabled={blocked} name={category} value={value} label={label} onChange={handleTextFieldChange} />
                  </CategoryData>
                ) : null
              }
            })}
          </DataWrapper>
        </MainEntryWrapper>
        <DupedEntriesWrapper>
          <Table
            lightTheme
            noResultsMessage="There are not duped entries to show"
            headerData={tableCols}
            headerStyles={{ borderTop: true }}
            cellCustomWidths={cellCustomWidths}
            verticalScroll={rowsToShow}>
            {renderTableRows(guestsToMerge)}
          </Table>
        </DupedEntriesWrapper>
        <div className="buttons-wrapper">
          <Button title="Go back" kind="grey" onClickHandler={handleGoBack} />
          <Button title="Deselect all" kind="secondary" onClickHandler={handleDeselectAll} />
          <Button disabled={!proceedToFinalReview} title="Continue to review" kind="primary" onClickHandler={handleContinue} />
        </div>
      </ComparingStepWrapper>
    )
  }
  return renderRefinementGuestFlow()
}
