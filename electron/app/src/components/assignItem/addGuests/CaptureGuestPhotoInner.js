import React, { Component } from 'react'
import styled from 'styled-components'
import PictureEditor from '@entabeni-systems/react-picture-editor'

import { H1, H3, Button, Icon, SpinLoader } from 'es-components'
import { withToastManager } from 'react-toast-notifications'
import { withApollo } from 'react-apollo'
const { systemPreferences } = window.require('electron').remote
console.log('🚀 ~ file: CaptureGuestPhotoInner.js ~ line 9 ~ systemPreferences', systemPreferences)
// systemPreferences.askForMediaAccess('camera').then(test => {
//   console.log('🚀 ~ file: CaptureGuestPhotoInner.js ~ line 11 ~ systemPreferences.askForMediaAccess ~ test', test)
// })
const VideoContainer = styled.div`
  align-items: center;
  background-color: ${props => (props.photoCaptured ? props.theme.greyLight : props.theme.white)};
  color: ${props => props.theme.greyTint};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: ${props => (props.isCustomerFacing ? '0' : '2rem auto 2rem')};
  max-height: ${props => (props.isCustomerFacing ? '100%' : '30rem')};
  max-width: ${props => (props.isCustomerFacing ? '45rem' : '40rem')};
  min-height: ${props => (props.isCustomerFacing ? '100%' : '30rem')};
  min-width: ${props => (props.isCustomerFacing ? '45rem' : '40rem')};

  & > div {
    min-height: ${props => (props.isCustomerFacing ? '100%' : '30rem')} !important;

    & > .shown {
      bottom: ${props => (props.isCustomerFacing ? '-4.5rem' : '0')};
    }
  }

  video {
    width: ${props => (props.isCustomerFacing ? '100%' : '50%')};
    height: ${props => (props.isCustomerFacing ? '100%' : '50%')};
    display: ${props => (props.photoCaptured ? 'none' : 'block')};
  }

  canvas.hidden-canvas {
    display: none;
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: ${props => (props.isCustomerFacing ? 'flex-end' : 'space-between')};
  height: ${props => props.isCustomerFacing && '100%'};
  margin: 0 auto;
  max-width: ${props => (props.isCustomerFacing ? '60rem' : '40rem')};
  flex-direction: ${props => (props.isCustomerFacing ? 'column' : 'row')};
  min-width: ${props => (props.isCustomerFacing ? 'auto' : '40rem')};
  width: ${props => (props.isCustomerFacing ? '100%' : 'auto')};
  padding: ${props => (props.isCustomerFacing ? '115px 15px 0' : '0')};
`

const GuestName = styled.div`
  position: absolute;
  top: 0;
`

export class CaptureGuestPhoto extends Component {
  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
    this.canvasRef = React.createRef()
    this.pictureEditorRef = React.createRef()

    this.state = {
      cameraReady: false,
      photoCaptured: props.previousProfilePictureUrl ? true : false,
      photoCapturedData: null,
      previousProfilePictureUrl: props.previousProfilePictureUrl,
      base64ImgFromVideo: null
    }
  }

  componentDidMount() {
    this.openCamera()
  }

  componentWillUnmount() {
    if (this.videoRef && this.videoRef.current) {
      const stream = this.videoRef.current.srcObject
      const tracks = stream && stream.getTracks()
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i]
        track.stop()
      }
      this.videoRef.current.srcObject = null
    }
  }

  openCamera() {
    if (window.navigator.mediaDevices.getUserMedia) {
      window.navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          setTimeout(() => {
            this.setState(
              {
                cameraReady: true
              },
              () => {
                if (this.videoRef && this.videoRef.current) {
                  this.videoRef.current.srcObject = stream
                }
              }
            )
          }, 1500)
        })
        .catch(function(err0r) {
          // ToDo: Improve error messages handling logic and UI/UX
          console.log('Something went wrong!', err0r)
        })
    }
  }

  processImageToBeSaved = (imgData, completed) => {
    fetch(imgData)
      .then(res => res.blob())
      .then(blob => {
        const fileName = 'avatar'
        const fileType = `${fileName}.jpg`
        blob['name'] = fileType

        let imageData = new File([blob], fileType, {
          type: blob.type
        })
        var fr = new FileReader()
        fr.onload = () => {
          if (!this.pictureEditorRef.current.isLoaded()) {
            this.setState({ base64ImgFromVideo: fr.result }, () => {
              this.pictureEditorRef.current.setIsLoaded(true)
            })
          }
        }
        fr.readAsDataURL(imageData)
        this.setState({ photoCaptured: true, photoCapturedData: imageData })
        if (completed) {
          this.props.onCompleteClick(imageData)
        }
      })
  }

  handleOnCompleteClick = () => {
    const customerFacingPrintTerminal = window.localStorage.getItem('customerFacingPrintTerminal')

    const editedImgDataURI = this.pictureEditorRef.current.getImageFromCanvas()
    this.processImageToBeSaved(editedImgDataURI, true)
  }

  handleCaptureClick = () => {
    if (this.videoRef && this.videoRef.current) {
      this.canvasRef.current.width = this.videoRef.current.videoWidth
      this.canvasRef.current.height = this.videoRef.current.videoHeight
      this.canvasRef.current.getContext('2d').drawImage(this.videoRef.current, 0, 0)

      const data = this.canvasRef.current.toDataURL('image/jpeg', 0.7)
      this.processImageToBeSaved(data)
    }
  }

  handleRetakeClick = () => {
    this.canvasRef.current.width = 0
    this.canvasRef.current.height = 0

    this.setState({
      photoCaptured: false,
      photoCapturedData: null,
      previousProfilePictureUrl: null,
      base64ImgFromVideo: null
    })
  }

  render() {
    const customerFacingPrintTerminal = window.localStorage.getItem('customerFacingPrintTerminal')

    const { onCompleteClick, onCancelClick, cancelButtonTitle, isCustomerFacing = false, guestFullName, ...props } = this.props
    const { cameraReady, photoCaptured, previousProfilePictureUrl, base64ImgFromVideo } = this.state
    let title = guestFullName ? guestFullName : 'test'
    let subTitle = 'Please hold a neutral expression and click the Capture Button'
    let imageSize = this.canvasRef.current && { height: this.canvasRef.current.height, width: this.canvasRef.current.width }
    const buttonsSharedStyles = {
      customHeight: isCustomerFacing ? '180px' : '3.625rem',
      customPadding: '1rem',
      fontSize: '1.25rem',
      fontWeight: '700',
      margin: isCustomerFacing ? '15px 0 0 0' : '0'
    }
    const hasCustomerFacing = !isCustomerFacing && customerFacingPrintTerminal
    return (
      <>
        <VideoContainer photoCaptured={photoCaptured} isCustomerFacing={isCustomerFacing}>
          {!cameraReady && !photoCaptured && <Icon name="FaImage" size="10rem" />}
          {!cameraReady && !hasCustomerFacing && !previousProfilePictureUrl && <SpinLoader withWrapper="100%" size="80px" color="primary" />}
          {this.props.loading && !hasCustomerFacing && <SpinLoader withWrapper="100%" size="80px" color="primary" />}
          {cameraReady && !hasCustomerFacing && <video autoPlay ref={this.videoRef} />}
          {photoCaptured && !this.props.loading && (
            <PictureEditor
              ref={this.pictureEditorRef}
              imgSrc={base64ImgFromVideo || previousProfilePictureUrl}
              editorSizing={{ width: isCustomerFacing ? '45rem' : '40rem', height: isCustomerFacing ? '40rem' : '30rem' }}
              imgSizing={imageSize}
            />
          )}
          <canvas className="hidden-canvas" ref={this.canvasRef} />
        </VideoContainer>
        <ButtonsWrapper isCustomerFacing={isCustomerFacing}>
          {isCustomerFacing && (
            <GuestName>
              <H1 color="greyDark" size="2.2rem">
                {title}
              </H1>
              <H3 color="greyDark" size="1.3rem">
                {subTitle}
              </H3>
            </GuestName>
          )}
          {!isCustomerFacing && <Button title={cancelButtonTitle} kind="primary" {...buttonsSharedStyles} onClickHandler={onCancelClick} />}
          {!photoCaptured && !hasCustomerFacing && (
            <Button
              kind="red"
              icon="IoIosCamera"
              title="Capture"
              iconSize="1.75rem"
              sizeW={isCustomerFacing && '100%'}
              onClickHandler={this.handleCaptureClick}
              {...buttonsSharedStyles}
            />
          )}
          {photoCaptured && !hasCustomerFacing && (
            <Button
              kind="red"
              icon="IoIosCamera"
              title="Retake"
              iconSize="1.75rem"
              sizeW={isCustomerFacing && '100%'}
              onClickHandler={this.handleRetakeClick}
              {...buttonsSharedStyles}
            />
          )}
          {customerFacingPrintTerminal && !isCustomerFacing && (
            <Button kind="lightBlue" title="Guest Screen" onClickHandler={this.props.handleCustomerFacing} {...buttonsSharedStyles} />
          )}

          <Button
            title="Complete"
            kind="green"
            {...buttonsSharedStyles}
            disabled={!photoCaptured}
            sizeW={isCustomerFacing && '100%'}
            loading={this.props.loading}
            onClickHandler={this.handleOnCompleteClick}
          />
        </ButtonsWrapper>
      </>
    )
  }
}

export const CaptureGuestPhotoInner = withToastManager(withApollo(CaptureGuestPhoto))
