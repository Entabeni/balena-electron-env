import React from 'react'
import styled from 'styled-components'

// Components
import { Icon } from 'es-components'
import { debounce } from 'es-libs'

const InputGroup = styled.div`
  width: 249px;
  height: auto;
  position: relative;
`

const ClearBtn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  border: none;
  outline: none;
  background: transparent;
  color: ${props => props.theme.grey};
  right: ${props => (props.relocateTo && `calc(${props.relocateTo} - 0.35rem)`) || '2px'};
  top: ${props => (props.relocateTo && `calc(${props.relocateTo} - 0.35rem)`) || '2px'};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.greyBlackShade};
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: ${props => props.height || '40px'};
  ${props => props.lineHeight && `line-height: ${props.lineHeight};`}
  padding: ${props => props.padding || '0.5rem'};
  background: ${props => (props.bgColor && (props.theme[props.bgColor] || props.bgColor)) || props.theme.greyLightTint};
  border: 1px solid ${props => props.theme.grey};
  color: ${props => props.theme.greyBlackShade};
  outline: none;
`

export const SearchTextInput = ({ onChangeHandler, searchTitle, isClearSearch, setClearSearchFilter, hideClearSearchButton, ...props }) => {
  let searchInputRef = React.useRef()
  let [searchInputValue, setSearchInputValue] = React.useState('')
  let [searchCleared, setSearchCleared] = React.useState(true)

  const onKeyPressHandler = key => {
    if (key.charCode === 13) {
      return false
    }
  }

  function inputChangeHandler() {
    setSearchCleared(true)
    setSearchInputValue(searchInputRef.current.value)
    if (onChangeHandler) {
      debounce(() => {
        if (searchInputRef.current) {
          onChangeHandler(searchInputRef.current.value)
        }
      }, 750)()
    }
  }
  const clearSearchFilter = () => {
    setSearchInputValue('')
    if (onChangeHandler) {
      onChangeHandler('')
    }
  }

  if (isClearSearch && searchCleared) {
    setSearchCleared(false)
    setClearSearchFilter()
    clearSearchFilter()
  }

  let showClearBtn = searchInputValue !== '' ? true : false

  return (
    <InputGroup>
      <SearchInput
        id="searchInput"
        ref={searchInputRef}
        onKeyPress={onKeyPressHandler}
        type="text"
        value={searchInputValue}
        placeholder={searchTitle}
        onChange={inputChangeHandler}
        {...props}
      />
      {!hideClearSearchButton && showClearBtn && (
        <ClearBtn relocateTo={props.padding} onClick={clearSearchFilter}>
          <Icon name="IoMdCloseCircleOutline" size="1.6em" />
        </ClearBtn>
      )}
    </InputGroup>
  )
}
