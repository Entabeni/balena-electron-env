import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import { UPDATE_COMPLETED_WAIVER_MUTATION } from '../../components/waiver/CompletedWaiverCard'
import { SignatureBox } from './SignatureBox'
import { WaiverPart } from '../../components/waiver/WaiverParts'
import { COMPLETE_CUSTOMER_WAIVER } from './schema'
import { WaiverModal, Par } from 'es-components'
export const GuestName = styled.h2`
  margin-top: -50px;
  margin-left: 30px;
  position: absolute;
`
export const PageWrap = styled.div`
  height: 100%;
  padding: 130px 40px 110px 40px;
  width: 100%;
  & > div {
    width: 100%;
  }
`

export default function WaiverScreen({ waiver, client, orderId, toastManager, setCurrentScreen, activeSection, setActiveSection, updateScreen }) {
  const [signatureResult, setSignatureResult] = useState('')
  const completedWaiverHandler = async signatureImageUrl => {
    const awsImage = await fetch(waiver.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': signatureResult ? signatureResult.type : 'image/jpeg' },
      body: signatureResult
    })
    client
      .mutate({ mutation: COMPLETE_CUSTOMER_WAIVER, variables: { id: waiver.id, signatureImageUrl: waiver.signedUrl.split('?')[0] } })
      .then(res => {
        toastManager.add('Waiver Updated', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
        updateScreen('logo')
      })
      .catch(err => {
        toastManager.add('An error occurred', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
        updateScreen('logo')
      })
  }

  // if (error || data === null) return <Redirect to="/" />

  const { title, id: waiverID, intro, showEmailPos, __typename, ...parts } = waiver.waiver
  const sigPad = useRef({})
  const clearInput = () => {
    sigPad.current.clear()
    setSignatureResult('')
  }
  const waiverSections = Object.values(parts)
    .filter(part => part)
    .map(part => <WaiverPart data={part} />)
  const guestName = waiver.guestName
  const totalCount = Object.values(parts).filter(part => part).length
  const signingString = waiver.signingString
  const signWaiverStatus = activeSection === waiverSections.length
  const handleModalForward = () => {
    if (activeSection === totalCount) {
      completedWaiverHandler()
    } else if (activeSection === totalCount - 1) {
      setWaiverState('signForm')
      setActiveSection(activeSection + 1)
    } else if (activeSection < totalCount - 1) {
      setActiveSection(activeSection + 1)
    }
  }
  const goBack = () => {
    if (activeSection >= 1) {
      setActiveSection(activeSection - 1)
    }
  }
  const [waiverState, setWaiverState] = useState('start')
  return (
    <PageWrap>
      <GuestName>{guestName}</GuestName>
      <Mutation mutation={UPDATE_COMPLETED_WAIVER_MUTATION}>
        {(updateCompletedWaiver, { loading }) => {
          return (
            <WaiverModal
              title={signWaiverStatus ? 'Signature Capture' : `Waiver Section ${activeSection + 1}`}
              totalCount={totalCount}
              sectionCount={activeSection + 1}
              isSignatureStep={signWaiverStatus}
              waiverState={waiverState}
              goBackHandler={goBack}
              loading={loading}
              disabled={signWaiverStatus && signatureResult === ''}
              onClickModalHandler={handleModalForward}
              clearButton={signWaiverStatus}
              waiverBtnTitle={signWaiverStatus ? 'Submit' : 'I Agree'}
              clearButtonHandler={clearInput}
              onLoading={false}>
              {waiverSections[activeSection]}
              {signWaiverStatus && signingString && (
                <>
                  <Par dangerouslySetInnerHTML={{ __html: signingString }} />
                  <SignatureBox
                    clearInput={clearInput}
                    signatureResult={signatureResult}
                    setSignatureResult={setSignatureResult}
                    widthRatio={1}
                    sigPad={sigPad}
                    onSave={() => {}}
                    onHide={() => {}}
                    displayNameInput></SignatureBox>
                </>
              )}
            </WaiverModal>
          )
        }}
      </Mutation>
    </PageWrap>
  )
}
