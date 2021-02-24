import React, { useState } from 'react'
import { withToastManager } from 'react-toast-notifications'
import { PrintModal, Button } from 'es-components'
import styled from 'styled-components'
import { SingleAccessRecord } from './SingleAccessRecord'
import { PrintingQuestions } from './PrintingQuestions'

const SingleButton = styled.div`
  grid-column: 4;
  grid-gap: 6.6%;
  width: 100%;
  height: 60px;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  margin-top: -1rem;
`
export const ButtonWrapper = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: ${props => props.gridColumns || 'repeat(4, 20%)'};
  grid-gap: ${props => props.gridGap || '6.666666667%'};
  width: 100%;
  height: 60px;
  padding: 0;
  margin-top: 2.5rem;
`
const AccessRecordWrap = styled.div`
  display: grid;
  min-height: 450px;
  max-height: 850px;
  background-color: ${props => props.theme.greyLight};
  overflow-y: scroll;
  padding: 2em 2em;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`

const AccessWrap = React.memo(({ useAccessBlocks, sale, client }) => {
  return (
    <AccessRecordWrap>
      {useAccessBlocks &&
        useAccessBlocks.map(accessRecord => {
          return <SingleAccessRecord saleId={sale.id} client={client} key={accessRecord.id} accessRecord={accessRecord} />
        })}
    </AccessRecordWrap>
  )
})

const AccessRecordPrintModal = ({ client, history, handleCloseModal, toastManager, sale }) => {
  const [currentStep, setCurrentStep] = useState('cardPrint')
  const [useAccessBlocks, setAccessBlocks] = useState()
  if (sale && sale.accessRecords && sale.accessRecords.length && !useAccessBlocks) {
    setAccessBlocks(sale.accessRecords)
  }

  if (sale && sale.accessRecords.length === 0 && currentStep === 'cardPrint') {
    setCurrentStep('questions')
  }

  if (currentStep === 'cardPrint') {
    return (
      <PrintModal title={'Print Cards'} colWidth subTitle={'Print Cards or Scan Existing Card'} hasVerify>
        <AccessWrap useAccessBlocks={useAccessBlocks} sale={sale} client={client} />
        <ButtonWrapper>
          <SingleButton>
            <Button
              sizeH="tall"
              onClickHandler={() => setCurrentStep('questions')}
              fontSize="1rem"
              fontWeight="700"
              title="Next Step"
              kind="primary"
              sizeW="widest"
            />
          </SingleButton>
        </ButtonWrapper>
      </PrintModal>
    )
  } else {
    return <PrintingQuestions sale={sale} client={client} handleCloseModal={handleCloseModal} />
  }
}

export default withToastManager(AccessRecordPrintModal)
