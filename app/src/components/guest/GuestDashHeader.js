import React from 'react'
import styled from 'styled-components'
import { debounce } from 'debounce'
import { Button, H2, Par, RoundedCheckboxInput, SearchTextInput } from 'es-components'

const TitleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ScanAndSearchWrapper = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SearchParamsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  & > p {
    margin-right: 1rem;
  }

  & > div {
    min-height: 1.75rem;

    > label:last-child {
      margin-top: 0;
    }

    &:last-of-type > label:last-child {
      padding-right: 0.25rem;
    }
  }
`

const ButtonsAndSearchInputWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const sharedBtnStyling = {
  customHeight: '3.625rem',
  fontSize: '1.25rem',
  fontWeight: '700',
  margin: '0 1.5rem 0 0'
}

const GuestDirectoryHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 1.5rem;
  width: 100%;

  & > div {
    width: auto;
  }
`

export const GuestDashHeader = React.memo(
  ({
    isCustomerNumberIncludedInSearch,
    isFirstNameIncludedInSearch,
    handleSearchParamsChange,
    isLastNameIncludedInSearch,
    isEmailIncludedInSearch,
    handleSearchChange,
    handleCreateGuest,
    handleScanCardClicked,
    scanning,
    openMergingModal,
    accountSelected,
    setFilterString,
    setSearchText,
    setClearSearch,
    isClearSearch
  }) => {
    return (
      <GuestDirectoryHeader>
        <TitleWrapper>
          <H2 color="greyDark" size="2rem" marginBottom="0.25rem">
            Guests Directory
          </H2>
          <Par color="greyDark" size="1rem" margin="0">
            Hover any guest and click on the available actions
          </Par>
        </TitleWrapper>
        <ScanAndSearchWrapper>
          <SearchParamsWrapper>
            <Par>Search for</Par>
            <RoundedCheckboxInput
              className="filter-search-checkbox"
              id="first-name-filter"
              label="First Name"
              checked={isFirstNameIncludedInSearch}
              onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('FirstName', isChecked)}
            />
            <RoundedCheckboxInput
              className="filter-search-checkbox"
              id="last-name-filter"
              label="Last Name"
              checked={isLastNameIncludedInSearch}
              onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('LastName', isChecked)}
            />
            <RoundedCheckboxInput
              className="filter-search-checkbox"
              id="customer-number-filter"
              label="Customer Number"
              checked={isCustomerNumberIncludedInSearch}
              onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('CustomerNumber', isChecked)}
            />
            <RoundedCheckboxInput
              className="filter-search-checkbox"
              id="email-filter"
              label="Email"
              checked={isEmailIncludedInSearch}
              onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('Email', isChecked)}
            />
          </SearchParamsWrapper>
          <ButtonsAndSearchInputWrapper>
            <Button title="Merge Guests" kind="secondary" {...sharedBtnStyling} onClickHandler={openMergingModal} />
            {accountSelected && <Button title="Create Guest" kind="red" {...sharedBtnStyling} onClickHandler={handleCreateGuest} />}
            <Button
              title="Scan Card"
              kind="primary"
              id="elem"
              loading={scanning}
              onClickHandler={() => {
                handleScanCardClicked()
              }}
              {...sharedBtnStyling}
            />
            <SearchTextInput
              // isClearSearch={isClearSearch}
              // setClearSearchFilter={bool => {
              //   setFilterString(false)
              //   setSearchText('')
              //   setClearSearch(bool)
              // }}
              onChangeHandler={debounce(handleSearchChange, 1000)}
              searchTitle="Filter Guests..."
              bgColor="white"
              height="3.625rem"
              lineHeight="2.625rem"
              padding="1rem"
            />
          </ButtonsAndSearchInputWrapper>
        </ScanAndSearchWrapper>
      </GuestDirectoryHeader>
    )
  }
)
export default GuestDashHeader
