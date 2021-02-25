import React from 'react'
import styled from 'styled-components'

// Component
import { Modal } from '../Modal'
import { Button, H2, Par } from 'es-components'

const CapturePhotoModalContainer = styled.div`
  min-height: 100%;
  position: relative;
`

const ModalHeader = styled.header`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  margin: ${props => (props.isCustomerFacing ? '-2rem auto 0' : '0 auto;')};
  padding: 0;
  width: ${props => (props.isCustomerFacing ? '55rem' : '40rem')};
`

const TitleWrapper = styled.div`
  padding: ${props => (props.isCustomerFacing ? ' 0 0 0.25rem;' : ' 2.5rem 0 0.5rem;')};
  width: 100%;
`

const ModalSection = styled.section`
  overflow-y: ${props => (props.isCustomerFacing ? 'none' : 'scroll')};
`

const ModalFooter = styled.footer`
  height: 60px;
  width: 100%;
  padding: 0 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const modalStyles = {
  border: 'none',
  dropShadow: '0 0 20px 0 rgba(0, 0, 0, 0.75)',
  height: 'auto',
  minHeight: '45.625rem',
  maxHeight: '45.625rem',
  width: '58.125rem'
}

export default function CapturePhotoModal({
  title,
  subTitle,
  children,
  addBorder,
  primaryBtnTitle,
  isCustomerFacing,
  cancelButtonTitle,
  primaryBtnDisabled,
  onPrimaryBtnHandler,
  secondaryBtnTitle,
  secondaryBtnShow,
  onSecondaryBtnHandler,
  onCancelHandler,
  disableFooter
}) {
  const modalStyles = isCustomerFacing
    ? {
        border: 'none',
        dropShadow: '0 0 0',
        height: 'auto',
        minHeight: '45.625rem',
        maxHeight: '45.625rem',
        width: '58.125rem',
        top: '42%',
        backgourndOpacity: '0'
      }
    : {
        border: 'none',
        dropShadow: '0 0 20px 0 rgba(0, 0, 0, 0.75)',
        height: 'auto',
        minHeight: '45.625rem',
        maxHeight: '45.625rem',
        width: '58.125rem'
      }
  return (
    <Modal {...modalStyles} zIndex="1002">
      <CapturePhotoModalContainer>
        <ModalHeader isCustomerFacing={isCustomerFacing}>
          <TitleWrapper isCustomerFacing={isCustomerFacing}>
            <H2 color="greyDark" size={isCustomerFacing ? '3rem' : '2rem'} marginBottom="0.25rem">
              {title}
            </H2>
            <Par color="greyDark" size={isCustomerFacing ? '1.3rem' : '1rem'} margin="0">
              {subTitle}
            </Par>
          </TitleWrapper>
          {secondaryBtnShow && secondaryBtnTitle && onSecondaryBtnHandler && (
            <Button title={secondaryBtnTitle} kind="tertiary" onClickHandler={onSecondaryBtnHandler} />
          )}
        </ModalHeader>
        <ModalSection isCustomerFacing={isCustomerFacing} addBorder>
          {children}
        </ModalSection>
        {!disableFooter && (
          <ModalFooter>
            {onCancelHandler && (
              <Button
                title={cancelButtonTitle ? cancelButtonTitle : 'Cancel'}
                kind="primary"
                customHeight={isCustomerFacing ? '4rem' : '3.625rem'}
                customPadding={isCustomerFacing ? '1.5rem' : '1rem'}
                fontSize={isCustomerFacing ? '2rem' : '1.25rem'}
                fontWeight="700"
                onClickHandler={onCancelHandler}
              />
            )}
            {onPrimaryBtnHandler && (
              <Button
                margin="0 0 0 1em"
                title={primaryBtnTitle}
                kind="red"
                customHeight={isCustomerFacing ? '4rem' : '3.625rem'}
                customPadding={isCustomerFacing ? '1.5rem' : '1rem'}
                fontSize={isCustomerFacing ? '2rem' : '1.25rem'}
                fontWeight="700"
                disabled={primaryBtnDisabled}
                onClickHandler={onPrimaryBtnHandler}
              />
            )}
          </ModalFooter>
        )}
      </CapturePhotoModalContainer>
    </Modal>
  )
}
