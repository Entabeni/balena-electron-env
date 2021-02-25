import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { CapturePhotoModal, Button, SpinLoader, BasicForm, H2 } from 'es-components'
import { updateCustomerFacingScreen } from 'es-libs'
import { withToastManager } from 'react-toast-notifications'
import { withApollo, Subscription } from 'react-apollo'
import { CaptureGuestPhotoInner } from './CaptureGuestPhotoInner'
import { Modal } from '../../modal/Modal'

// import PromoCodeInput from '../PromoCodeInput'
const { ipcRenderer } = window.require('electron')
const ModalHeader = styled.header`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 ${props => props.theme.spacingMed} ${props => props.theme.spacingMed};
`
const ModalContent = styled.section`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.article`
  width: auto;
  height: 100%;

  .photoForm {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
`

const ModalFooter = styled.footer`
  width: 100%;
  padding: ${props => props.theme.spacingMed} 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`
const CaptureGuestPhotoWrapInner = ({
  cancelButtonTitle,
  client,
  guestId,
  onCancelClick,
  onCompleteClick,
  orderId,
  printTerminalData,
  previousProfilePictureUrl,
  toastManager
}) => {
  const [waitingForCustomerFacing, setWaitingForCustomerFacing] = useState(false)
  const [isComplete, setComplete] = useState(true)
  useEffect(() => {
    const newScreen = printTerminalData && printTerminalData.screenSteps
    if ((newScreen === 'logo' || newScreen === 'presentOrder') && !isComplete) {
      setComplete(true)
      onCompleteClick()
    }
    setComplete(false)
  }, [printTerminalData])
  const handleCustomerFacing = () => {
    setWaitingForCustomerFacing(true)
    updateCustomerFacingScreen({ screen: 'photoCapture', client, toastManager, guestId })
  }
  const handleCancelCustomerFacingPhoto = () => {
    setComplete(true)
    setWaitingForCustomerFacing(false)
    updateCustomerFacingScreen({
      screen: orderId ? 'presentOrder' : 'logo',
      client: client,
      toastManager: toastManager,
      orderId: orderId
    })
  }
  return waitingForCustomerFacing ? (
    <Modal width="60%" height="60%">
      <ModalContainer true>
        <BasicForm className="photoForm">
          <>
            <ModalHeader>
              <H2>Waiting for Guest</H2>
            </ModalHeader>
            <ModalContent>
              <SpinLoader color="primary" size="180px" />
            </ModalContent>
            <ModalFooter>
              <Button title="Return to POS Screen" kind="primary" sizeW="wide" type="button" medium onClickHandler={() => handleCancelCustomerFacingPhoto()} />
            </ModalFooter>
          </>
        </BasicForm>
      </ModalContainer>
    </Modal>
  ) : (
    <CapturePhotoModal title="Photo Capture" subTitle="Please hold a neutral expression and click the Capture button" disableFooter>
      <CaptureGuestPhotoInner
        previousProfilePictureUrl={previousProfilePictureUrl}
        cancelButtonTitle={cancelButtonTitle}
        onCancelClick={onCancelClick}
        onCompleteClick={onCompleteClick}
        handleCustomerFacing={handleCustomerFacing}
      />
    </CapturePhotoModal>
  )
}

const CaptureGuestPhotoWrap = ({ cancelButtonTitle, client, guestId, onCancelClick, onCompleteClick, orderId, previousProfilePictureUrl, toastManager }) => {
  const [useData, setData] = useState(null)
  ipcRenderer.on('message-from-customer-facing', (event, data) => {
    setData(data)
  })
  return (
    <CaptureGuestPhotoWrapInner
      printTerminalData={useData}
      cancelButtonTitle={cancelButtonTitle}
      client={client}
      guestId={guestId}
      onCancelClick={onCancelClick}
      onCompleteClick={onCompleteClick}
      orderId={orderId}
      previousProfilePictureUrl={previousProfilePictureUrl}
      toastManager={toastManager}
    />
  )
}

export const CaptureGuestPhoto = withToastManager(withApollo(CaptureGuestPhotoWrap))
