import React from 'react'
import styled, { css } from 'styled-components'
import { Form } from 'informed'

// Components
import { Button, ErrorMsg } from 'es-components'

export const BasicForm = styled(Form)`
  min-height: ${props => (props.minHeight ? props.minHeight : '300px')};
  width:  ${props => (props.width ? props.width : '100%')};
  padding: ${props => props.padding || '1em'};
  height: ${props => (props.height ? props.height : 'auto')};
  ${props => props.overflowY && `overflow-y: ${props.overflowY};`}

  ${props =>
    props.dark &&
    css`
      border: 1px solid ${props => props.theme.greyDarkShade};
      background-color: ${props => props.theme.greyDarkShade};

      .fieldContainer {
        background-color: ${props => props.theme.greyBlackShade};
      }

      label {
        color: ${props => props.theme.greyTint};
      }

      input {
        color: ${props => props.theme.white};
        border-color: ${props => props.theme.greyBlackShade};
      }

      input[type='radio'],
      input[type='checkbox'] {
        border-color: ${props => props.theme.greyDarkShade};
        background-color: ${props => props.theme.greyBlackShade};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }

        &:checked {
          border-color: ${props => props.theme.greyDark};
          background-color: ${props => props.theme.greyBlackShade};
        }
      }

      input[type='radio'] {
        &:checked:after {
          background: ${props => props.theme.white};
          border: 2px solid ${props => props.theme.greyDark};
        }
      }

      input[type='checkbox'] {
        &:checked:after,
        &:checked:before {
          background: ${props => props.theme.white};
        }
      }

      .react-select__control {
        color: ${props => props.theme.white};
        border: 1px solid ${props => props.theme.greyDarkShade};
        background-color: ${props => props.theme.greyBlackShade};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }
      }

      .react-select__placeholder {
        font-weight: 300;
        color: ${props => props.theme.greyTint};
      }

      .react-select__single-value,
      .react-select__multi-value__label {
        font-weight: 400;
        color: ${props => props.theme.white};
      }

      .react-select__indicators {
        .react-select__indicator-separator {
          background-color: ${props => props.theme.greyDark};
        }
        svg {
          color: ${props => props.theme.greyDark};
        }
      }
    `}

  ${props =>
    props.tint &&
    css`
      border: 1px solid ${props => props.theme.grey};
      background-color: ${props => props.theme.greyLight};

      .fieldContainer {
        background: ${props => props.theme.greyLightTint};
      }

      label {
        color: ${props => props.theme.greyBlackShade};
      }

      input {
        border-color: ${props => props.theme.grey};
        color: ${props => props.theme.greyBlackShade};
      }

      input[type='radio'],
      input[type='checkbox'] {
        border-color: ${props => props.theme.grey};
        background-color: ${props => props.theme.greyLightTint};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }

        &:checked {
          border-color: ${props => props.theme.greyBlackShade};
          background-color: ${props => props.theme.white};
        }
      }

      input[type='radio'] {
        &:checked:after {
          background: ${props => props.theme.greyBlackShade};
          border: 2px solid ${props => props.theme.greyDark};
        }
      }

      input[type='checkbox'] {
        &:checked:after,
        &:checked:before {
          background: ${props => props.theme.greyBlackShade};
        }
      }

      .react-select__control {
        color: ${props => props.theme.greyBlackShade};
        border: 1px solid ${props => props.theme.grey};
        background-color: ${props => props.theme.greyLightTint};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }
      }

      .react-select__placeholder {
        font-weight: 300;
        color: ${props => props.theme.greyBlackShade};
      }

      .react-select__single-value,
      .react-select__multi-value__label {
        font-weight: 400;
        color: ${props => props.theme.greyBlackShade};
      }

      .react-select__indicators {
        .react-select__indicator-separator {
          background-color: ${props => props.theme.grey};
        }
        svg {
          color: ${props => props.theme.greyDark};
        }
      }
    `}

  ${props =>
    props.light &&
    css`
      border: 1px solid ${props => props.theme.grey};
      background-color: ${props => props.theme.white};

      .fieldContainer {
        background: ${props => props.theme.greyLight};
      }

      label {
        color: ${props => props.theme.greyBlackShade};
      }

      input {
        border-color: ${props => props.theme.grey};
        color: ${props => props.theme.greyBlackShade};
      }

      input[type='radio'],
      input[type='checkbox'] {
        border-color: ${props => props.theme.grey};
        background-color: ${props => props.theme.greyLight};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }

        &:checked {
          border-color: ${props => props.theme.greyBlackShade};
          background-color: ${props => props.theme.greyLight};
        }
      }

      input[type='radio'] {
        &:checked:after {
          background: ${props => props.theme.greyBlackShade};
          border: 2px solid ${props => props.theme.greyDark};
        }
      }

      input[type='checkbox'] {
        &:checked:after,
        &:checked:before {
          background: ${props => props.theme.greyBlackShade};
        }
      }

      .react-select__control {
        color: ${props => props.theme.greyBlackShade};
        border: 1px solid ${props => props.theme.grey};
        background-color: ${props => props.theme.greyLight};

        &:hover {
          border-color: ${props => props.theme.greyDark};
        }
      }

      .react-select__placeholder {
        font-weight: 300;
        color: ${props => props.theme.greyBlackShade};
      }

      .react-select__single-value,
      .react-select__multi-value__label {
        font-weight: 400;
        color: ${props => props.theme.greyBlackShade};
      }

      .react-select__indicators {
        .react-select__indicator-separator {
          background-color: ${props => props.theme.grey};
        }
        svg {
          color: ${props => props.theme.greyDark};
        }
      }
    `}
`

const FormGrid = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: ${props => `repeat(${props.formcols}, 1fr)`};
  grid-column-gap: 1em;
`

const ButtonWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: ${props => (props.centeredButtons ? 'center' : 'flex-end')};
  margin-top: 0.5em;

  & > button {
    margin-left: 1em;
  }
  ${props =>
    props.centeredButtons
      ? css`
          & > button:first-child {
            margin-left: 0;
          }
        `
      : null}
`

export default class StandardForm extends React.Component {
  onCancelClick = () => {
    const { onCancelClick } = this.props
    if (onCancelClick) {
      onCancelClick()
    }
  }

  render() {
    const {
      children,
      formcols,
      onSubmitHandler,
      onCancelClick,
      onExtraClick,
      onExtraTitle,
      error,
      height,
      light,
      loading,
      cancelButtonKind,
      primaryButtonKind,
      buttonsCustomStyles,
      hideSubmitButton,
      centeredButtons,
      minHeight,
      padding,
      width,
      ...props
    } = this.props

    return (
      <BasicForm minHeight={minHeight} height={height} light={light} padding={padding} width={width} onSubmit={values => onSubmitHandler(values)} {...props}>
        {error && <ErrorMsg errorMsg={error} />}
        <FormGrid formcols={formcols || 1}>{children}</FormGrid>
        <ButtonWrapper centeredButtons>
          {onCancelClick && (
            <Button title="Cancel" onClickHandler={onCancelClick} kind={cancelButtonKind || 'greyOutline'} disabled={loading} {...buttonsCustomStyles} />
          )}
          {onExtraTitle && onExtraClick && <Button title={onExtraTitle} onClickHandler={onExtraClick} kind="tertiaryOutline" {...buttonsCustomStyles} />}
          {!hideSubmitButton && <Button title="Submit" btnType="submit" kind={primaryButtonKind || 'secondary'} loading={loading} {...buttonsCustomStyles} />}
        </ButtonWrapper>
      </BasicForm>
    )
  }
}
