import React from 'react'

// Components
import styled from 'styled-components'
import { H2, Par, RoundedAvatar } from 'es-components'

const CardWrapper = styled.article`
  border-radius: ${props => props.borderRadius || '14px 0 0 0'};
  margin-bottom: ${props => props.theme[props.marginBottom] || 0};
  box-shadow: ${props => props.theme.boxShadow};
  border: ${props => props.border || props.theme.StdBorder};
  background-color: ${props => props.theme.white};
`

const CardDataWrapper = styled.div`
  display: flex;
  min-height: 50px;
  flex-direction: row;
  justify-content: space-between;
  color: ${props => props.theme.greyShade};
  padding: 0.8rem 1rem;
  border-radius: 14px 0 0 0;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.greyLight};
  }
`

const CardDataColumn = styled.div`
  box-sizing: border-box;
  color: ${props => props.theme.greyShade};
  display: flex;
  width: ${props => props.width || `350px`};
`

const TextDataWrapper = styled.div`
  display: inline-block;
  ${props => props.centered && 'text-align: center;'}

  div + & {
    margin-left: 20px;
  }
`

export class RentalSaleElement extends React.Component {
  render() {
    const { userImage, name, id, onClick, customerNumber, saleNumber, saleTotal, saleId, rowNum } = this.props
    return (
      <CardWrapper id={`rentalRow_${rowNum}`} marginBottom="spacingMed" onClick={() => onClick({ id, name, userImage, saleId })}>
        <CardDataWrapper>
          <CardDataColumn width="450px">
            <RoundedAvatar imageURL={userImage} size="72px" />
            <TextDataWrapper>
              <H2 size="2rem" height="35px" light color={name === 'Deleted' ? 'red' : 'greyDarkShade'} marginBottom="spacingMinimum">
                {name}
              </H2>
              <Par size="1.4rem" color="greyDark">
                {customerNumber}
              </Par>
            </TextDataWrapper>
          </CardDataColumn>
          <CardDataColumn width="330px">
            <TextDataWrapper centered>
              <H2 size="1.75rem" light color="greyDarkShade" marginBottom="spacingMinimum" id={`rentalRowSaleNumber_${rowNum}`} data={saleNumber}>
                Sale Number
              </H2>
              <Par size="1.4rem" color="greyDark">
                {saleNumber.toString().padStart(10, '0')}
              </Par>
            </TextDataWrapper>
          </CardDataColumn>
          <CardDataColumn width="200px">
            <TextDataWrapper centered>
              <H2 size="1.75rem" light color="greyDarkShade" marginBottom="spacingMinimum">
                {`Total: $${saleTotal}`}
              </H2>
            </TextDataWrapper>
          </CardDataColumn>
        </CardDataWrapper>
      </CardWrapper>
    )
  }
}
