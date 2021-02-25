import React from 'react'
import styled from 'styled-components'

// Components
import { H4 } from 'es-components'
import { AssignItemInfoContainer } from './AssignItemInfoContainer'
import { AssignItemBtnContainer } from './AssignItemBtnContainer'

const ItemCardWrapper = styled.article`
  width: 250px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto minmax(min-content, max-content) 40px;
  border: 1px solid ${props => props.theme.grey};
  margin-bottom: 0.7em;
  background-color: ${props => props.theme.white};
  box-shadow: 2px 2px 2px rgba(100, 100, 100, 10%);
  padding: 2px;
`

export const AssignItemCard = ({ index, ageVariant, productInfo, onAssignItemButtonClick }) => {
  const nextProductInfo = productInfo.find(info => info.productState === null)
  return (
    <ItemCardWrapper id={`productStepsBlock_${index}`} onClick={() => nextProductInfo != null && onAssignItemButtonClick(nextProductInfo.assign, index)}>
      <H4 padding="0.5em 0.5em 0" color="primary">
        Guest {index + 1}
        {ageVariant ? ` - ${ageVariant.title}` : ''}
      </H4>
      <AssignItemInfoContainer index={index} productInfo={productInfo} ageVariant={ageVariant} />
      <AssignItemBtnContainer index={index} productInfo={productInfo} onClickHandler={onAssignItemButtonClick} />
    </ItemCardWrapper>
  )
}
