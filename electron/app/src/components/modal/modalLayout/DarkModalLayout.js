import React from 'react'
import styled, { css } from 'styled-components'
import { theme } from '../../../themes/index'

// Component
import { Modal } from '../Modal'
import { H2, Par, btnRippleEffect, TouchButton } from 'es-components'

const DarkModalContainer = styled.div`
  background-color: ${theme.greyDarkShade};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;

  ${props => {
    return props.sizing
      ? css`
          height: ${props.sizing.height};
          max-height: ${props.sizing.maxHeight};
          max-width: ${props.sizing.maxWidth};
          width: ${props.sizing.width};
        `
      : null
  }}
`

const DarkModalHeader = styled.header`
  align-items: center;
  background-color: ${theme.white};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 80px;
  padding: 2em 2em 1em;
  text-align: center;
`

const DarkModalSection = styled.section`
  color: ${theme.grey};
  padding: 2em 2em 1em;
`

const DarkModalFooter = styled.footer`
  align-items: flex-start;
  display: flex;
  justify-content: space-around;
  min-height: 60px;
  padding: 1em 2em 2em;
`
const buttonDisabledStyle = css`
  color: ${props => props.theme.greyDark};
  border-color: ${props => props.theme.greyDark};
  background-color: ${props => props.theme.greyLight};
`

const DarkModalButton = styled(TouchButton)`
  color: ${theme.white};
  font-size: 1.2rem;
  height: 60px;
  min-width: 150px;
  padding: 0 30px;
  text-transform: uppercase;
  width: auto;

  &:before {
    background-color: ${theme.entabeniOrange};
  }

  &:after {
    background-color: ${theme.entabeniOrangeShade};
  }

  &:focus:not(:active) {
    animation: ${props => btnRippleEffect(props.theme.white, props.theme.white)} 0.5s ease;
  }
  &:disabled {
    ${props => buttonDisabledStyle}

    &:after {
      background-color: ${props => props.theme.greyLight};
    }
    &:before {
      background-color: ${props => props.theme.greyLight};
    }
  }
`

const renderButtons = (buttons, clickHandlerPassedFromModal) => {
  if (Array.isArray(buttons) && buttons.length > 0) {
    return (
      <React.Fragment>
        {buttons.map((button, i) => {
          const { label, onClick } = button
          const handleOnClick = () => {
            onClick()
            if (clickHandlerPassedFromModal) clickHandlerPassedFromModal()
          }
          return (
            <DarkModalButton key={`dark-modal-btn-${i}`} onClick={handleOnClick}>
              {label}
            </DarkModalButton>
          )
        })}
      </React.Fragment>
    )
  } else if (React.isValidElement(buttons)) {
    return buttons
  } else {
    return null
  }
}

export const DarkModalLayout = ({
  children,
  buttons,
  buttonLabel,
  footer,
  header,
  primaryButtonDisabled,
  message,
  messageStyling,
  onClick: handleOnClick,
  title,
  titleHint,
  ...props
}) => {
  return (
    <DarkModalContainer {...props}>
      <DarkModalHeader>
        {header ||
          (title && (
            <React.Fragment>
              <H2 id="darkModalHeader" color="greyBlackShade" textTransform="uppercase">
                {title}
              </H2>
              {titleHint && (
                <Par color="greyBlackShade" margin="0.35em 0 0 0">
                  {titleHint}
                </Par>
              )}
            </React.Fragment>
          ))}
      </DarkModalHeader>
      <DarkModalSection>
        {children ||
          (message && (
            <Par id="darkModalMessage" color="white" {...messageStyling}>
              {message}
            </Par>
          ))}
      </DarkModalSection>
      <DarkModalFooter>
        {footer ||
          (buttons && renderButtons(buttons, handleOnClick)) ||
          (handleOnClick && (
            <DarkModalButton disabled={primaryButtonDisabled} onClick={handleOnClick}>
              {buttonLabel || 'Close'}
            </DarkModalButton>
          ))}
      </DarkModalFooter>
    </DarkModalContainer>
  )
}

export const DarkModal = ({ children, hidden, sizing, ...props }) => {
  return (
    <Modal border="none" bgColor="transparent" dropShadow={'0 0 20px 0 rgba(0, 0, 0, 0.75)'} hidden={hidden} {...sizing}>
      <DarkModalLayout {...props}>{children}</DarkModalLayout>
    </Modal>
  )
}
