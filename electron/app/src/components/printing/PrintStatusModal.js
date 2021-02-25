import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ProductModal, Button, DarkModal } from 'es-components'
const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`
export const PrintStatusModal = ({ handleCloseModal, accessRecordId, scanning, handleScanCard }) => {
  const [timeLeft, setTimeLeft] = useState(1)

  useEffect(() => {
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [timeLeft])
  const modalSizing = {
    height: 'auto',
    maxHeight: '900px',
    maxWidth: '560px',
    zIndex: '2001',
    width: '40%'
  }
  const buttons = [
    {
      label: 'Yes',
      onClick: async () => {
        setLeaving(false)
        handleCloseModal()
      }
    },
    {
      label: 'No',
      onClick: () => {
        setLeaving(false)
      }
    }
  ]
  const [leaving, setLeaving] = useState(false)

  return (
    <ProductModal
      cancelBtnTitle={'Go Back'}
      onCancelHandler={() => setLeaving(true)}
      style={{ zIndex: 2000 }}
      lightLayout
      title="Printing"
      subTitle="Printing has started, please scan card after printing has finished">
      <ButtonWrap>
        <Button
          sizeW="extraWide"
          sizeH="extraTall"
          customPadding={scanning ? '1rem 1rem 1rem 1rem' : '1rem 1rem 1rem 3rem'}
          floatingIcon={!scanning && { left: '0.75rem' }}
          iconSize="2rem"
          icon="IoMdBarcode"
          loadingText
          rounded
          disabled={timeLeft >= 0.1}
          key="scan"
          loading={timeLeft >= 0.1 || scanning}
          kind="primary"
          title={timeLeft >= 0.1 ? `Printing` : 'Scan New Card'}
          onClickHandler={() => handleScanCard()}
        />
      </ButtonWrap>
      {leaving && (
        <DarkModal
          style={{ zIndex: 2001 }}
          buttons={buttons}
          sizing={modalSizing}
          className="custom-ui"
          message={<React.Fragment>Are you sure you want to close this print job</React.Fragment>}
          title="Close Print Job"
          titleHint="Confirm to continue"
        />
      )}
    </ProductModal>
  )
}
