import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const ModalWrapper = styled.article`
  position: fixed;
  top: 50%;
  left: 50%;
  width: ${props => props.width || '90%'};
  max-width: ${props => props.maxWidth || 'unset'};
  height: ${props => props.height || '90%'};
  max-height: ${props => props.maxHeight || 'unset'};
  min-height: ${props => props.minHeight || 'unset'};
  transform: translate(-50%, -50%);
  display: block;
  background-color: ${props => props.bgColor || props.theme.white};
  border: ${props => props.border || '1px solid grey'};
  box-shadow: ${props => `${props.dropShadow} !important` || '2px 2px 2px rgba(100, 100, 100, 10%)'};
  z-index: ${props => props.zIndex || '1001'};
  ${props => props.padding && `padding: ${props.padding};`}
`

const ModalSkirt = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0;
  background-color: rgba(10, 10, 10, ${props => props.backgourndOpacity || '0.5'});
  z-index: ${props => props.zIndex || '1001'};
  display: ${props => (props.hidden ? 'none' : 'block')};
`

const modalPortal = document.getElementById('modal-root')

export const Modal = props =>
  ReactDOM.createPortal(
    <ModalSkirt {...props}>
      <ModalWrapper {...props}>{props.children}</ModalWrapper>
    </ModalSkirt>,
    modalPortal
  )
