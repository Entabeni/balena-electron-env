import React, { useState, useEffect } from 'react'
import { withToastManager } from 'react-toast-notifications'
import styled from 'styled-components'
import { SpinLoader, BasicForm, Button, H4, Icon, H2, Par } from 'es-components'
import { updateCustomerFacingScreen } from 'es-libs'
// Graph QL
import { gql } from 'apollo-boost'

import { withApollo, Mutation } from 'react-apollo'
import { COMPLETED_WAVIER_MAILER } from '../../pages/auth/schema'

import { WaiverPart } from './WaiverParts'
import { StyledWaiverCard, CardHeader, CardHeaderButton, CardFooterButton, StyledIcon, CardFooterIndicator, CardContent, CardFooter } from './WaiverCardStyles'
import { GET_COMPLETED_WAIVER_BY_ID } from '../../pages/dashboard/schema'
// Components
const { ipcRenderer } = window.require('electron')
// Mutation
export const UPDATE_COMPLETED_WAIVER_MUTATION = gql`
  mutation UpdateCompletedWaiver($waiverId: String!) {
    pos {
      updateCompletedWaiver(id: $waiverId, status: "completed", signingLocation: "manuallySigned") {
        id
        guestId
      }
    }
  }
`
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

const ModalCurtain = styled.div`
  /* position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 99;
  transition: all 0.2s ease-in-out; */
`
const ModalContainer = styled.article`
  width: auto;
  height: 100%;

  .waiverForm {
    width: 70%;
    height: ${props => (props.autoHeight ? 'auto ' : '70vh')};
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: ${props => props.theme.spacingLrg};
    background-color: ${props => props.theme.white};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 100;
    box-shadow: 0.1em 0.2em 2em rgba(0, 0, 0, 0.4);
    transition: all 0.2s ease-in-out;
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

const WaiverCardInner = ({ id, status, client, toastManager, handleCompletedWaiver, data, match, orderId, printTerminalData }) => {
  useEffect(() => {
    const newScreen = printTerminalData && printTerminalData.screenSteps
    if (newScreen === 'logo') {
      client.query({ query: GET_COMPLETED_WAIVER_BY_ID, variables: { id } }).then(({ data }) => {
        const { singleCompletedWaiver } = data.pos
        const waiverCompleted = singleCompletedWaiver.status === 'completed'
        if (waiverCompleted) {
          setWaiverState('completed')
          handleCompletedWaiver()
        }
      })
    }
  }, [printTerminalData])
  const [waiverState, setWaiverState] = useState('start')
  const [waiverPreview, setWaiverPreview] = useState(false)

  const { title, intro, showEmailPos, __typename, ...parts } = data
  const setTotalCount = parts => {
    let partCount = 0
    for (var part in parts) {
      if (part && part !== '') {
        partCount += 1
      }
    }
    return partCount
  }

  const totalCount = setTotalCount(parts)
  const waiverSections = Object.values(parts).map(part => <WaiverPart data={part} />) || []
  const closeModal = () => {
    setWaiverState('start')
    const url_string = window.location.href
    const url = new URL(url_string)
    console.log('🚀 ~ file: CompletedWaiverCard.js ~ line 119 ~ closeModal ~ url', url)
    const splitString = url.href.split('/')
    const orderId = splitString[splitString.length - 1]
    console.log("🚀 ~ file: CompletedWaiverCard.js ~ line 124 ~ closeModal ~ url.pathname.split('/')", url.pathname.split('/'))
    console.log('🚀 ~ file: CompletedWaiverCard.js ~ line 125 ~ closeModal ~ url.pathname.length', url.pathname.length)
    console.log('🚀 ~ file: CompletedWaiverCard.js ~ line 123 ~ closeModal ~ orderId', orderId)
    let updateVars = { client, toastManager }
    if (orderId === 'guests') {
      updateVars.screen = 'logo'
    } else {
      updateVars.screen = 'presentOrder'
      updateVars.orderId = orderId
    }
    updateCustomerFacingScreen({ screen: orderId === 'guests' ? 'logo' : 'presentOrder', client, toastManager, orderId })
  }
  const renderWaiverContent = (intro, waiverState) => {
    if (waiverState === 'guestSigning') {
      return (
        <ModalCurtain>
          <ModalContainer true>
            <BasicForm className="waiverForm" id="waiver-form">
              <>
                <ModalHeader>
                  <H2>Waiting for Guest</H2>
                </ModalHeader>
                <ModalContent>
                  <SpinLoader color="primary" size="180px" />
                </ModalContent>
                <ModalFooter>
                  <Button title="Return to POS Screen" kind="primary" sizeW="wide" type="button" medium onClickHandler={() => closeModal()} />
                </ModalFooter>
              </>
            </BasicForm>
          </ModalContainer>
        </ModalCurtain>
      )
    }
    return <Par dangerouslySetInnerHTML={{ __html: intro }} />
  }
  const waiverContent = waiverPreview ? waiverSections : renderWaiverContent(intro, waiverState)

  useEffect(() => {
    if (status === 'completed') {
      setWaiverState('completed')
    }
  }, [status])

  const handlePreviewClick = e => {
    e.preventDefault()
    setWaiverPreview(!waiverPreview)
  }

  const handleStartWaiver = waiverId => {
    updateCustomerFacingScreen({ screen: 'waiver', waiverId, client, toastManager }).then(() => {
      setWaiverState('guestSigning')
      setWaiverPreview(false)
    })
  }

  const handleEmailWaiver = completedWaiverID => {
    client
      .query({ query: COMPLETED_WAVIER_MAILER, variables: { id: completedWaiverID } })
      .then(res => {
        if (res.data.pos.completedWaiverMailer.id) {
          setWaiverState('completed')
          toastManager.add('Waiver emailed', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
          handleCompletedWaiver()
        } else {
          toastManager.add('Error occured, please try again.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
        }
      })
      .catch(() => {
        toastManager.add('Error occured, please try again.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      })
  }

  const handleCompleteWaiver = () => {
    setWaiverState('completed')
    toastManager.add('Waiver completed.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
  }

  const handleOnSubmit = (id, updateCompletedWaiver) => {
    updateCompletedWaiver({ variables: { waiverId: id } })
      .then(({ data }) => {
        handleCompleteWaiver()
        handleCompletedWaiver()
      })
      .catch(error => {
        const newError = error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : ''
        console.error(newError, error)
      })
  }

  const renderFooterBtn = (completedWaiverID, showEmailPos) => {
    switch (waiverState) {
      case 'start':
        return (
          <Mutation mutation={UPDATE_COMPLETED_WAIVER_MUTATION}>
            {(updateCompletedWaiver, { loading }) => {
              return (
                <>
                  <CardFooterButton color="tertiary" hoverColor="tertiaryShade" onClick={() => handleOnSubmit(completedWaiverID, updateCompletedWaiver)}>
                    Manually Signed
                    <StyledIcon color="tertiary">
                      <Icon name="MdAssignmentTurnedIn" size="20px" />
                    </StyledIcon>
                  </CardFooterButton>
                  {showEmailPos && (
                    <CardFooterButton color="secondary" hoverColor="tertiaryShade" onClick={() => handleEmailWaiver(completedWaiverID)}>
                      Email Waiver
                      <StyledIcon color="secondary">
                        <Icon name="IoIosMail" size="20px" />
                      </StyledIcon>
                    </CardFooterButton>
                  )}
                  <CardFooterButton color="primary" hoverColor="tertiaryShade" onClick={() => handleStartWaiver(completedWaiverID)}>
                    Start Process
                    <StyledIcon color="primary">
                      <Icon name="MdEdit" size="20px" />
                    </StyledIcon>
                  </CardFooterButton>
                </>
              )
            }}
          </Mutation>
        )
      case 'inProgress':
        return null

      default:
        return (
          <CardFooterIndicator color="greenShade">
            Completed
            <StyledIcon color="greenShade">
              <Icon name="MdBeenhere" size="20px" />
            </StyledIcon>
          </CardFooterIndicator>
        )
    }
  }

  return (
    <StyledWaiverCard>
      <CardHeader>
        <H4 size="1.3rem">{title}</H4>
        <CardHeaderButton color="greyDark" onClick={handlePreviewClick}>
          Preview
        </CardHeaderButton>
      </CardHeader>

      <CardContent activeWaiver={false}>{waiverContent}</CardContent>

      <CardFooter>
        <Par>{`Total Sections: ${totalCount}`}</Par>
        {renderFooterBtn(id, showEmailPos)}
      </CardFooter>
    </StyledWaiverCard>
  )
}
const WaiverCard = ({ id, status, client, toastManager, handleCompletedWaiver, data, match, orderId }) => {
  const [useData, setData] = useState(null)
  ipcRenderer.on('message-from-cashier-facing', (event, data) => {
    console.log('test', data) // Prints 'whoooooooh!'
    setData(data)
  })

  return (
    <WaiverCardInner
      id={id}
      printTerminalData={useData}
      status={status}
      client={client}
      toastManager={toastManager}
      handleCompletedWaiver={handleCompletedWaiver}
      data={data}
      match={match}
      orderId={orderId}></WaiverCardInner>
  )
}

export default withToastManager(withApollo(WaiverCard))
