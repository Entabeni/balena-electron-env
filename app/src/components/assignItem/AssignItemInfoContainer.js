import React from 'react'
import styled from 'styled-components'

//  Components
import { AssignItemInfo } from './AssignItemInfo'

const AssignItemInfoWrapper = styled.ul`
  list-style: none;
  padding: 0.5em 0.5em 0;
`

export const AssignItemInfoContainer = ({ productInfo, ageVariant }) => {
  return (
    <AssignItemInfoWrapper>
      {productInfo.map(info => (
        <AssignItemInfo
          key={`${info.id}_info`}
          text={info.assign === 'addGuests' && ageVariant ? `${info.text} between the ages ${ageVariant.ageFrom} to ${ageVariant.ageTo}` : info.text}
          setInfoState={info.productState}
        />
      ))}
    </AssignItemInfoWrapper>
  )
}
