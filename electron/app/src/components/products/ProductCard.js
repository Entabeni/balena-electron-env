import React from 'react'
import styled, { css } from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Span, Icon } from 'es-components'
import { formatCurrency, shadeColor } from 'es-libs'
// PlaceHolder Image
import placeHolderImg from '../../images/bannerPlaceHolder.jpg'

import { validateAgeVar } from 'es-libs'

const CardContainer = styled.div`
  background-color: ${props => props.bgColor || props.theme.white};
  display: flex;
  width: 100%;
  padding: 0 45px 0 85px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 2px 2px 2px rgba(100, 100, 100, 10%);
  border: ${props => (props.selected ? 'solid 2px' : 'solid 1px')};
  border-color: ${props => (props.selected ? props.theme.green : props.theme.grey)};

  ${props =>
    props.productDisabled &&
    css`
      border-color: ${props => props.theme.disabled};
      background-color: ${props => props.theme.disabled};
    `}
`

const CardFigure = styled.figure`
  width: 80px;
  background-color: $grey-75;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 0;
  margin: 0;

  ${flexCenterItem}

  .cardImg {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
`

const CardInfo = styled.div`
  ${props =>
    props.bgColor &&
    css`
      --darkenedBgColor: ${shadeColor(-80, props.bgColor, shadeColor(40, props.bgColor))};
      --lightenedBgColor: ${shadeColor(40, props.bgColor)};
    `}
  ${props => props.bgColor && 'background-color: var(--lightenedBgColor);'};
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 80px;
  padding: 5px 10px;
  width: 100%;

  .title {
    color: ${props => props.theme.greyDark};
    font-size: 1.15rem;
    font-weight: 500;
    margin-bottom: 0.4em;
    overflow: hidden;
  }

  .line-clamp {
    ${props => props.bgColor && 'color: var(--darkenedBgColor) !important;'}
    display: -webkit-box;
    margin: 0;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => (props.bgColor && 'var(--darkenedBgColor) !important') || props.theme.greyDark};
  }
`
const QtyClicker = styled.div`
  display: flex;
  flex-direction: column;
  width: 45px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  border-left: 1px solid ${props => props.theme.grey};

  .add,
  .remove {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 45px;
    background-color: $white;
    color: ${props => props.theme.greyDark};
    font-size: 18px;

    &:hover {
      color: ${props => (props.qtySelectorDisabled ? '' : props.theme.secondary)};
    }
  }

  .counter {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40%;
    background-color: ${props => props.theme.greyLight};
  }

  ${props =>
    props.qtySelectorDisabled &&
    css`
      border-color: ${props => props.theme.disabled};
      background-color: ${props => props.theme.disabled};
    `}
`

export function ProductCard({
  product,
  onProductSelected,
  selected,
  hideQuantitySelector,
  account,
  guestsDateOfBirth,
  disableProductsByGuestsDateOfBirth,
  bgColor,
  id
}) {
  const [quantity, setQuantity] = React.useState(1)

  let productDisabled = false
  if (product.ageVariants && product.ageVariants.length === 1 && guestsDateOfBirth && disableProductsByGuestsDateOfBirth) {
    const validation = validateAgeVar(
      product.ageVariants[0],
      account.ageCalculationMethod,
      account.endOfWinterSeasonMonth,
      account.ageCalculationDate
    )(guestsDateOfBirth)
    productDisabled = validation !== undefined
  }

  let image = placeHolderImg
  if (product.imageUrl) {
    image = product.imageUrl.replace('small', 'large')
  }

  return (
    <CardContainer id={id != null ? id : undefined} selected={selected} productDisabled={productDisabled} disabled={productDisabled}>
      <CardFigure onClick={productDisabled ? null : () => onProductSelected(product, quantity, account)}>
        <img className="cardImg" src={image} alt={product.name} />
      </CardFigure>
      <CardInfo bgColor={bgColor} onClick={productDisabled ? null : () => onProductSelected(product, quantity, account)}>
        <div className="title">
          <Span className="line-clamp">{product.name}</Span>
        </div>
        <Span className="price">{formatCurrency(product.price)}</Span>
      </CardInfo>
      {!productDisabled && !hideQuantitySelector && product && !product.checkStockLevel && !(product.ageVariants && product.ageVariants.length > 1) && (
        <QtyClicker qtySelectorDisabled={selected}>
          <span
            className="add"
            onClick={() => {
              if (!selected) {
                setQuantity(prevState => prevState + 1)
              }
            }}>
            <Icon name="IoIosAdd" size="1.8rem" />
          </span>

          <div className="counter">{quantity}</div>
          <span
            className="remove"
            onClick={() => {
              if (!selected) {
                setQuantity(prevState => (prevState > 1 ? prevState - 1 : prevState))
              }
            }}>
            <Icon name="IoIosRemove" size="1.8rem" />
          </span>
        </QtyClicker>
      )}
    </CardContainer>
  )
}
