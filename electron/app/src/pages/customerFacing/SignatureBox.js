import React, { useState, useRef, useCallback } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import styled from 'styled-components'

const Signature = styled.div`
  margin-top: 1em;

  .sig-canvas {
    border: 1px solid black;
  }
`
export const SignatureBox = ({ onSave, onHide, widthRatio, canvasProps, setSignatureResult, signatureResult, sigPad }) => {
  const [name, setName] = useState('')
  const sigCanvas = useRef({})

  const setSignatureOnChange = () => {
    const dataURL = sigCanvas.current.toDataURL()
    setSignatureResult(dataURL)
  }

  const saveInput = () => {
    onSave({ dataURL: signatureResult, name: name })
  }

  const measuredRef = useCallback(
    node => {
      const resizeCanvas = (signaturePad, canvas) => {
        canvas.width = '1102'
        canvas.height = '180'
        signaturePad.clear()
      }

      if (node !== null) {
        sigCanvas.current = node.getCanvas()
        sigPad.current = node.getSignaturePad()
        resizeCanvas(node.getSignaturePad(), node.getCanvas())
      }
    },
    [widthRatio]
  )

  const isSignatureValid = !!signatureResult
  const isFormValid = isSignatureValid

  return (
    <Signature>
      <SignatureCanvas ref={measuredRef} onEnd={setSignatureOnChange} canvasProps={{ width: 500, height: 350, className: 'sig-canvas' }} />
    </Signature>
  )
}
