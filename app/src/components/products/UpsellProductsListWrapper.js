import React from 'react'
import styled from 'styled-components'

// Components
import { ProductCard } from './ProductCard'

const ListWrapper = styled.article`
  margin: 0;
  padding: 0.5em;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`

const UpsellWrapperHeader = styled.header`
  border-bottom: 1px solid ${props => props.theme.grey};
  padding: 10px;
  margin-bottom: 0;
  line-height: 1;
`

const UpsellWrapper = styled.div`
  border: 1px solid ${props => props.theme.grey};
  margin: 15px;
  height: 90%;
`

export function UpsellProductsListWrapper({ allProducts, onProductSelected, selectedProducts }) {
  return (
    <UpsellWrapper>
      <UpsellWrapperHeader>
        <h3>Select Additional Products</h3>
      </UpsellWrapperHeader>
      <ListWrapper>
        {allProducts.map((product, index) => {
          const selected = selectedProducts.indexOf(product.id) !== -1
          return <ProductCard id={`upsellProductItem_${index}`} key={product.id} selected={selected} product={product} onProductSelected={onProductSelected} />
        })}
      </ListWrapper>
    </UpsellWrapper>
  )
}
