import React from 'react'
import styled from 'styled-components'

// Components
import { AssignItemButton } from './AssignItemButton'

const AssignItemBtnsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 2px;
  grid-template-columns: repeat(4, 1fr);
`

function renderProductBtn(index, data, onClickHandler) {
  switch (data.assign) {
    case 'addGuests':
      return (
        <AssignItemButton
          key={`${data.id}_btn`}
          icon="IoMdPeople"
          iconSize="2rem"
          setInfoState={data.productState}
          onClickHandler={() => onClickHandler(data.assign, index)}
        />
      )
    case 'addAccessDate':
      return (
        <AssignItemButton
          key={`${data.id}_btn`}
          icon="FaRegCalendarAlt"
          iconSize="1.4rem"
          setInfoState={data.productState}
          onClickHandler={() => onClickHandler(data.assign, index)}
        />
      )
    case 'addEvents':
      return (
        <AssignItemButton
          key={`${data.id}_btn`}
          icon="FaSkiingNordic"
          iconSize="1.7rem"
          setInfoState={data.productState}
          onClickHandler={() => onClickHandler(data.assign, index)}
        />
      )
    case 'addAnswers':
      return (
        <AssignItemButton
          key={`${data.id}_btn`}
          icon="FaFileSignature"
          iconSize="1.5rem"
          setInfoState={data.productState}
          onClickHandler={() => onClickHandler(data.assign, index)}
        />
      )
    default:
      break
  }
}

export const AssignItemBtnContainer = ({ index, productInfo, onClickHandler }) => {
  return <AssignItemBtnsWrapper id="stepsButtons">{productInfo.map(info => renderProductBtn(index, info, onClickHandler))}</AssignItemBtnsWrapper>
}
