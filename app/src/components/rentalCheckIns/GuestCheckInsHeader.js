import React from 'react'
import { debounce } from 'debounce'

// Components
import styled from 'styled-components'
import { H5, Icon, ModalSearchTextInput } from 'es-components'

const GridHeaderWrapper = styled.div`
  box-sizing: border-box
  color: ${props => props.theme.greyShade};
  background-color: transparent;
  margin-bottom: ${props => props.theme[props.marginBottom] || props.marginBottom || 0};
  margin-top: ${props => props.theme[props.marginTop] || props.marginTop || 0};
  padding-left: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
`

const IconWrapper = styled.i`
  margin: 0 15px;
  svg {
    vertical-align: bottom;
  }
`

const searchInputStylingProps = { color: 'greyDark' }
const inputGroupStylingProps = { borderRadius: '0', width: '350px' }

export class GuestCheckInsHeader extends React.Component {
  onChangeSearch = value => {
    const { onSearch } = this.props
    if (onSearch) {
      onSearch(value)
    }
  }

  render() {
    const { searchTitle, value } = this.props
    return (
      <GridHeaderWrapper marginBottom="2.5rem" marginTop="spacingLrg">
        <H5 color="greyShade" padding="16px 0 0" size="1.4rem">
          Rental Check-Ins
          <IconWrapper>
            <Icon name="FaChevronRight" size="1.5rem" />
          </IconWrapper>
          Search Results
        </H5>
        <ModalSearchTextInput
          value={value}
          onClear={this.onChangeSearch}
          onChangeSearchInput={debounce(this.onChangeSearch, 1000)}
          inputGroupStyling={inputGroupStylingProps}
          styling={searchInputStylingProps}
          searchTitle={searchTitle}
        />
      </GridHeaderWrapper>
    )
  }
}
