import React from 'react'
import styled from 'styled-components'

//Components
import { media } from 'es-themes'
import { BasicForm, ButtonWrapper, Button, IconButton, H3, Par } from 'es-components'

const ModalHeader = styled.header`
  flex-shrink: 0;
  width: 100%;
  padding: 0 ${props => props.theme.spacingMed} ${props => props.theme.spacingMed};
  border-bottom: ${props => props.theme.StdBorder};

  ${media.tablet`
    padding: ${props => props.theme.spacingSml};
  `}
`

const ModalContent = styled.section`
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding: ${props => props.theme.spacingMed};

  ${media.tablet`
    padding: ${props => props.theme.spacingSml};
  `}
`

const ModalFooter = styled.footer`
  width: 100%;
  flex-shrink: 0;
  padding: ${props => props.theme.spacingMed} 0 0;
  border-top: ${props => props.theme.StdBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  overflow: hidden;

  ${media.tablet`
    padding: ${props => props.theme.spacingSml} 0 0;
  `}

  ${media.phone`
    padding: 0;
    justify-content: center;
    flex-direction: column;
  `}
`

const FormContainer = styled.article`
  width: auto;
  height: 100%;
  border: 1px solid ${props => props.theme.grey};

  .waiverForm {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: ${props => props.theme.spacingLrg};
    background-color: ${props => props.theme.white};
    /* top: 50%;
    left: 50%;
    position: fixed; */
    display: flex;
    flex-direction: column;
  }
`

const FooterRightContainer = styled.footer`
  padding: 0;

  ${media.phone`
    padding: 1em 0;
  `}
`

const WaiverModal = ({
  title,
  children,
  sectionCount,
  totalCount,
  waiverState,
  disabled,
  waiverBtnTitle,
  loading,
  onClickModalHandler,
  onLoading,
  clearButtonHandler,
  clearButton,
  goBackHandler,
  isSignatureStep
}) => {
  return (
    <FormContainer>
      <BasicForm className="waiverForm" id="waiver-form">
        <>
          <ModalHeader>
            <H3>{title}</H3>
          </ModalHeader>
          <ModalContent isSignatureStep={isSignatureStep}>{children}</ModalContent>
          <ModalFooter>
            <FooterRightContainer>
              {sectionCount <= totalCount && (
                <Par>
                  Section {sectionCount}/{totalCount}
                </Par>
              )}
            </FooterRightContainer>

            <ButtonWrapper justify="space-between">
              {clearButton && <Button title="Clear" sizeW="narrow" kind="secondary" medium type="button" onClickHandler={clearButtonHandler} />}
              {!!goBackHandler && <Button title="Back" sizeW="narrow" kind="greyOutline" medium outline type="button" onClickHandler={goBackHandler} />}
              <Button
                title={waiverBtnTitle}
                disabled={disabled}
                loading={loading}
                kind="green"
                sizeW="narrow"
                type="button"
                medium
                onClickHandler={onClickModalHandler}
              />
            </ButtonWrapper>
          </ModalFooter>
        </>
      </BasicForm>
    </FormContainer>
  )
}

export default WaiverModal
