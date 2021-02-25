import React from 'react'
import styled, { css } from 'styled-components'

// Component
import { Modal } from '../Modal'
import { Button, H2, Par, Icon } from 'es-components'

const ProductModalContainer = styled.div`
  min-height: 100%;
  position: relative;
  ${props =>
    !props.noPaddingForContainer &&
    `padding-top: 80px;
      padding-bottom: 60px;
    `}
`

const ModalHeader = styled.header`
  ${props =>
    !props.styles &&
    `position: absolute;
      top: 0;
      left: 0;
      right: 0;     
      align-items: flex-end;
      height: 80px;`}
  display: flex;
  justify-content: space-between;
  padding: ${props => (props.styles && props.styles.padding) || '1em'};
`

const ModalSection = styled.section`
  ${props =>
    !props.styles
      ? css`
          position: absolute;
          top: 80px;
          bottom: 60px;
          left: 0;
          right: 0;
        `
      : css`
          ${props.styles.margin && `margin: ${props.styles.margin};`}
          ${props.styles.maxHeight && `max-height: ${props.styles.maxHeight};`}
          padding: ${props.styles.padding || '1em'};
        `}
  ${props => (props.overflowY && `overflow-y: ${props.overflowY};`) || (!props.withScrollableTable && 'overflow-y: scroll;')}
`

const ModalFooter = styled.footer`
  ${props =>
    !props.styles &&
    `position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;`}
  width: 100%;
  padding: ${props => (props.styles && props.styles.padding) || '0 1em'};
  display: flex;
  justify-content: ${props => (props.styles && props.styles.flexJustify) || props.justify || 'flex-end'};
  align-items: ${props => (props.styles && props.styles.flexAlign) || 'flex-start'};
`

const CloseIconWrappper = styled.div`
  color: ${props => props.theme.greyShade};
  cursor: pointer;
  position: absolute;
  right: ${props => (props.styles && props.styles.right) || '0'};
  top: ${props => (props.styles && props.styles.top) || '0'};

  &:hover {
    color: ${props => props.theme.greyDarkShade};
  }
`

export default function ProductModal({
  title,
  subTitle,
  children,
  addBorder,
  primaryBtnTitle,
  primaryBtnDisabled,
  primaryBtnLoading,
  primaryBtnMargin,
  onPrimaryBtnHandler,
  secondaryBtnTitle,
  secondaryBtnShow,
  onSecondaryBtnHandler,
  cancelBtnTitle,
  onCancelHandler,
  footerJustify,
  closeIcon,
  lightLayout,
  withScrollableTable,
  overflowY,
  noTitle,
  closeIconStyles,
  contentSectionCustomStyles,
  secondaryButtonStyles,
  ...props
}) {
  let modalBaseSetUp = { ...props }

  if (lightLayout) {
    modalBaseSetUp = {
      dropShadow: '0 0 20px 0 rgba(0, 0, 0, 0.75)',
      height: 'auto',
      maxHeight: '800px',
      padding: '3rem 4rem',
      width: '70%',
      ...modalBaseSetUp
    }
  }

  let contentSectionStyles = !lightLayout ? null : { padding: '1rem 0 0' }
  if (lightLayout && contentSectionCustomStyles) {
    contentSectionStyles = { ...contentSectionStyles, ...contentSectionCustomStyles }
  } else if (!lightLayout && contentSectionCustomStyles) {
    contentSectionStyles = { ...contentSectionCustomStyles }
  }

  const footerStyles = !lightLayout
    ? null
    : {
        flexAlign: 'center',
        flexJustify: 'center',
        padding: '3rem 0 0'
      }
  const headerStyles = !lightLayout ? null : { padding: '0' }
  const noPaddingForContainer = !lightLayout ? null : true
  const mainBtnsStyles = !lightLayout
    ? null
    : {
        customHeight: '60px',
        customWidth: '210px',
        fontSize: '1rem',
        fontWeight: '700',
        upperCase: true
      }

  return (
    <Modal {...modalBaseSetUp}>
      <ProductModalContainer noPaddingForContainer={noPaddingForContainer}>
        {closeIcon && onCancelHandler && (
          <CloseIconWrappper id="closeModalButton" styles={closeIconStyles} title="Cancel and close modal" onClick={onCancelHandler}>
            <Icon name="MdClear" size="30" />
          </CloseIconWrappper>
        )}
        {!noTitle && (
          <ModalHeader styles={headerStyles}>
            <div>
              <H2 id="productModalTitle" color="greyDark" size="2rem">
                {title}
              </H2>
              <Par color="greyDark" margin="0" size="1.5rem">
                {subTitle}
              </Par>
            </div>
            {secondaryBtnShow && secondaryBtnTitle && onSecondaryBtnHandler && (
              <Button
                fontSize={secondaryButtonStyles && secondaryButtonStyles.fontSize ? secondaryButtonStyles.fontSize : null}
                fontWeight={secondaryButtonStyles && secondaryButtonStyles.fontWeight ? secondaryButtonStyles.fontWeight : null}
                title={secondaryBtnTitle}
                kind={secondaryButtonStyles && secondaryButtonStyles.kind ? secondaryButtonStyles.kind : 'tertiary'}
                onClickHandler={onSecondaryBtnHandler}
              />
            )}
          </ModalHeader>
        )}
        <ModalSection addBorder overflowY={overflowY} styles={contentSectionStyles} withScrollableTable={withScrollableTable}>
          {children}
        </ModalSection>
        {((!closeIcon && onCancelHandler) || onPrimaryBtnHandler) && (
          <ModalFooter justify={footerJustify} styles={footerStyles}>
            {onCancelHandler && !closeIcon && (
              <Button {...mainBtnsStyles} title={cancelBtnTitle || 'Cancel'} kind="greyOutline" onClickHandler={onCancelHandler} />
            )}
            {onPrimaryBtnHandler && (
              <Button
                {...mainBtnsStyles}
                margin={primaryBtnMargin || '0 0 0 1em'}
                title={primaryBtnTitle}
                kind="primary"
                loading={primaryBtnLoading}
                disabled={primaryBtnDisabled}
                onClickHandler={onPrimaryBtnHandler}
              />
            )}
          </ModalFooter>
        )}
      </ProductModalContainer>
    </Modal>
  )
}
