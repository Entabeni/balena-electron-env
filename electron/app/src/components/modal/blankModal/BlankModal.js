import React from 'react'
import styled from 'styled-components'

// Component
import { Modal } from '../Modal'
import { Button, H2 } from 'es-components'

const BlankModalContainer = styled.div`
  min-height: 100%;
  position: relative;
  padding-top: ${props => (props.hasTitle ? '60px' : 0)};
  padding-bottom: 60px;
`

const ModalHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 60px;
  padding: 1em;
`

const ModalSection = styled.section`
  position: absolute;
  top: ${props => (props.hasTitle ? '60px' : 0)};
  bottom: 60px;
  left: 0;
  right: 0;
  overflow-y: scroll;
  padding: 1em;
`

const ModalFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  width: 100%;
  padding: 0 1em;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

export default function BlankModal({ title, children, primaryBtnTitle, onPrimaryBtnHandler, onCancelHandler }) {
  const hasTitle = !!title
  return (
    <Modal>
      <BlankModalContainer hasTitle={hasTitle}>
        {title && (
          <ModalHeader>
            <H2>{title}</H2>
          </ModalHeader>
        )}
        <ModalSection hasTitle={hasTitle}>{children}</ModalSection>
        <ModalFooter>
          <Button title="Cancel" kind="greyOutline" rounded onClickHandler={onCancelHandler} />
          <Button margin="0 0 0 1em" title={primaryBtnTitle} kind="primary" rounded onClickHandler={onPrimaryBtnHandler} />
        </ModalFooter>
      </BlankModalContainer>
    </Modal>
  )
}
