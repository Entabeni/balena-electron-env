import React from 'react'

// Styling
import styled from 'styled-components'
import { flexCenterItem } from '../utils'

// Components
import { Icon } from 'es-components'

const InputGroup = styled.div`
  background-color: ${props => (props.bgColor ? props.theme[props.bgColor] || props.bgColor : props.theme.greyLightTint)};
  border: 1px solid ${props => props.theme[props.color] || props.theme.grey};
  border-radius: ${props => props.borderRadius || '10px'};
  height: ${props => props.height || 'auto'};
  margin-bottom: ${props => props.marginBottom || '0'};
  padding: ${props => props.padding || '0.5rem'};
  position: relative;
  width: ${props => props.width || '249px'};
  ${flexCenterItem}
  flex-wrap: nowrap;
  justify-content: space-between;
`

const ClearBtn = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.grey};
  cursor: pointer;
  height: 40px;
  margin-right: 0.5rem;
  outline: none;
  width: 40px;

  &:hover {
    color: ${props => props.theme.greyBlackShade};
  }
`

const SearchInput = styled.input`
  background-color: ${props => (props.bgColor ? props.theme[props.bgColor] || props.bgColor : props.theme.greyLightTint)};
  border: none;
  border-radius: 0;
  color: ${props => props.theme.greyBlackShade};
  font-size: ${props => props.fontSize || '1rem'};
  min-height: ${props => props.height || '40px'};
  outline: none;
  width: ${props => props.width || '100%'};
`

const SearchIconWrapper = styled.div`
  color: ${props => props.theme.greyBlackShade};
  position: relative;
`

export const ModalSearchTextInput = props => {
  let searchInputRef = React.useRef()
  let [searchInputValue, setSearchInputValue] = React.useState('')
  if (!searchInputValue) {
    searchInputValue = props.value
  }

  const inputChangeHandler = val => {
    if (props.onChangeSearchInput) {
      props.onChangeSearchInput(val.target.value)
    }
    setSearchInputValue(val.target.value)
  }

  const onKeyPressHandler = key => {
    if (key.charCode === 13 && props.onEnterClick) {
      props.onEnterClick()
    }
  }

  function clearSearchFilter() {
    setSearchInputValue('')
    if (props.onClear) {
      props.onClear('')
    }
  }

  let showClearBtn = searchInputValue !== ''

  return (
    <InputGroup bgColor={props.bgColor} {...props.inputGroupStyling}>
      <SearchInput
        id={'searchInput'}
        bgColor={props.bgColor}
        {...props.styling}
        onChange={inputChangeHandler}
        onKeyPress={onKeyPressHandler}
        placeholder={props.searchTitle}
        ref={searchInputRef}
        type="text"
        value={searchInputValue}
      />
      {showClearBtn && props.onClear && (
        <ClearBtn onClick={clearSearchFilter}>
          <Icon name="IoMdCloseCircleOutline" size="1.6rem" />
        </ClearBtn>
      )}
      <SearchIconWrapper>
        <Icon name="IoIosSearch" size={props.iconSize || '1.6rem'} />
      </SearchIconWrapper>
    </InputGroup>
  )
}
