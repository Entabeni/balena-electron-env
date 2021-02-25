import React from 'react'
import styled, { css } from 'styled-components'

// Components
import { H3, Button } from 'es-components'

const Header = styled.header`
  ${props =>
    !props.inModal
      ? css`
          background-color: ${props.theme.greyLight};
          margin: -0.5rem 0 0;
          padding: 0.5rem 0.5rem 0 0.5rem;
          width: calc(60vw - 50px);
        `
      : css`
          background-color: ${props.theme.white};
          margin: 0;
          padding: 0;
          width: calc(100% - 8rem);
        `}
  overflow: hidden;
  position: fixed;
  z-index: 2;

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5em;
  }

  h3 {
    margin-right: 1rem;
  }
`

const sharedFieldStyle = css`
  display: flex;
  align-items: center;
  outline: 0;
  z-index: 1;
  width: 100%;
  box-shadow: none;
  box-sizing: border-box;
  background-color: transparent;
  font-weight: 400;
  border-style: solid;
  border-width: 0.08rem;
  border-radius: ${props => props.theme.borderRadius};
  transition: border 0.2s, font 0.2s;
  position: relative;
`

const FieldInput = styled.input`
  width: 100%;
  height: 55px;
  padding: ${props => (props.value ? '8px 50px 0 15px' : '0 50px 0 15px')};

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border-right: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`

const TextFieldContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  min-height: 50px;
  margin-bottom: ${props => props.theme.spacingSml};
  position: relative;
`

const FieldLabel = styled.label`
  top: 0;
  left: 15px;
  right: 0;
  bottom: ${props => (props.activeInput ? '25px' : 0)};
  z-index: 0;
  font-weight: 300;
  font-size: ${props => (props.activeInput ? '0.6rem' : '1rem')};
  position: absolute;
  display: flex;
  align-items: center;
`

export default function MainPanelHeader(props) {
  return (
    <>
      <Header inModal={props.inModal}>
        <div className="header-inner">
          <H3 id="mainHeader">{props.title}</H3>
          {props.setSearchTerm && (
            <>
              <Button
                onClickHandler={props.onRefreshProducts}
                key={'refreshProducts'}
                title={'Refresh Products'}
                kind={'primary'}
                sizeW="normal"
                margin="-1rem 1rem 0 -1rem"
                customHeight="3.4375rem"
                rounded
              />
              <TextFieldContainer className="fieldContainer">
                <FieldLabel htmlFor="search" activeInput={props.searchTerm}>
                  Search Products
                </FieldLabel>
                <FieldInput id="search" value={props.searchTerm} onChange={e => props.setSearchTerm(e.target.value)} autoComplete="off" />
              </TextFieldContainer>
            </>
          )}
        </div>
      </Header>
    </>
  )
}
