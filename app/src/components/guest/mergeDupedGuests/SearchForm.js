import React from 'react'
import styled from 'styled-components'

import { Par, RoundedCheckboxInput, ModalSearchTextInput } from 'es-components'
import { debounce } from 'debounce'

const SearchFormGrid = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0 1rem;

  p {
    margin-right: 1.5rem;
  }

  p,
  label {
    font-size: 1.15rem !important;
  }
`

const inputGroupStylingProps = {
  borderRadius: '0',
  marginBottom: '0',
  padding: '0.5rem 1rem',
  width: '300px'
}

const searchInputStylingProps = {
  color: 'greyDark',
  fontSize: '1.15rem',
  width: 'calc(100% - 2.25rem)'
}

export const DupedGuestsSearchForm = ({
  searchTerm,
  includeFirstNameInSearch,
  includeLastNameInSearch,
  includeEmailInSearch,
  handleClearSearch,
  onChange: handleSearchChange,
  onParamsChange: handleSearchParamsChange
}) => {
  return (
    <SearchFormGrid>
      <Par>Search for</Par>
      <RoundedCheckboxInput
        className="filter-search-checkbox"
        id="first-name-filter"
        label="First Name"
        checked={includeFirstNameInSearch}
        onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('firstName', isChecked)}
      />
      <RoundedCheckboxInput
        className="filter-search-checkbox"
        id="last-name-filter"
        label="Last Name"
        checked={includeLastNameInSearch}
        onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('lastName', isChecked)}
      />
      <RoundedCheckboxInput
        className="filter-search-checkbox"
        id="email-filter"
        label="Email"
        checked={includeEmailInSearch}
        onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('email', isChecked)}
      />
      <ModalSearchTextInput
        onChangeSearchInput={debounce(handleSearchChange, 1500)}
        searchTitle="Type in your search..."
        showClearBtn
        onClear={handleClearSearch}
        bgColor="white"
        height="3.625rem"
        lineHeight="2.625rem"
        inputGroupStyling={inputGroupStylingProps}
        styling={searchInputStylingProps}
        iconSize="2.25rem"
        value={searchTerm}
      />
    </SearchFormGrid>
  )
}
