import React from 'react'
import styled from 'styled-components'
import debounce from 'debounce'
import { H2, Par, RoundedCheckboxInput, SearchTextInput } from 'es-components'

const PreviousSalesHeader = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 1.5rem;
  width: 100%;

  & > div {
    width: auto;
  }
`

const TitleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SearchWrapper = styled.div`
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
export const SalesDashHeader = React.memo(({ handleSearchParamsChange, useActiveSearch, onSearchChangeHandler }) => {
  return (
    <PreviousSalesHeader>
      <TitleWrapper>
        <H2 color="greyDark" size="2rem" marginBottom="0.25rem">
          Previous Sales
        </H2>
        <Par color="greyDark" size="1rem" margin="0">
          Scroll down the sales list and click to review any receipt or event
        </Par>
      </TitleWrapper>
      <SearchWrapper>
        <SearchParamsWrapper>
          <Par>Search for</Par>
          <RoundedCheckboxInput
            className="filter-search-checkbox"
            id="purchaser-filter"
            label="Purchaser"
            checked={useActiveSearch.purchaser}
            onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('purchaser', isChecked)}
          />
          <RoundedCheckboxInput
            className="filter-search-checkbox"
            id="order-number-filter"
            label="Sale Number"
            checked={useActiveSearch.number}
            onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('number', isChecked)}
          />
          <RoundedCheckboxInput
            className="filter-search-checkbox"
            id="total-filter"
            label="Total"
            checked={useActiveSearch.total}
            onClickHandler={(fieldId, isChecked) => handleSearchParamsChange('total', isChecked)}
          />
        </SearchParamsWrapper>
        <SearchTextInput
          onChangeHandler={debounce(onSearchChangeHandler, 1000)}
          searchTitle="Filter Sales..."
          bgColor="white"
          height="3.625rem"
          lineHeight="2.625rem"
          padding="1rem"
        />
      </SearchWrapper>
    </PreviousSalesHeader>
  )
})
