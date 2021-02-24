import React from 'react'
import styled from 'styled-components'

// Component
import { Modal } from '../Modal'
import { Button, H2, Par } from 'es-components'

const ResortEventModalContainer = styled.div`
  min-height: 100%;
  position: relative;
  padding-top: 80px;
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
  height: 80px;
  padding: 1em;
`

const ModalSection = styled.section`
  position: absolute;
  top: 80px;
  bottom: 60px;
  left: 0;
  right: 0;
  overflow-y: scroll;
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

export default function ResortEventModal({
  title,
  subTitle,
  children,
  addBorder,
  primaryBtnTitle,
  primaryBtnDisabled,
  onPrimaryBtnHandler,
  secondaryBtnTitle,
  secondaryBtnShow,
  onSecondaryBtnHandler,
  onCancelHandler
}) {
  return (
    <Modal width="60%" height="60%">
      <ResortEventModalContainer>
        <ModalHeader>
          <div>
            <H2>{title}</H2>
            <Par margin="0.5em 0 0 0">{subTitle}</Par>
          </div>
          {secondaryBtnShow && secondaryBtnTitle && onSecondaryBtnHandler && (
            <Button title={secondaryBtnTitle} kind="tertiary" rounded onClickHandler={onSecondaryBtnHandler} />
          )}
        </ModalHeader>
        <ModalSection addBorder>{children}</ModalSection>
        <ModalFooter>
          {onCancelHandler && <Button title="Cancel" kind="greyOutline" rounded onClickHandler={onCancelHandler} />}
          {onPrimaryBtnHandler && (
            <Button margin="0 0 0 1em" title={primaryBtnTitle} kind="primary" rounded disabled={primaryBtnDisabled} onClickHandler={onPrimaryBtnHandler} />
          )}
        </ModalFooter>
      </ResortEventModalContainer>
    </Modal>
  )
}
