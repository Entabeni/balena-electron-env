import React from 'react'
import styled from 'styled-components'

// Components
import { ProductCard } from './ProductCard'
import { Par } from '../ui'

const ListWrapper = styled.article`
  margin: 0;
  padding: 0.5em 0 0.5em ${props => (!props.inModal ? '0.5em' : '0')};
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
`

export const ProductListWrapper = React.memo(
  ({
    allProducts,
    onProductSelected,
    searchTerm,
    categoryIdSelected,
    hideQuantitySelector,
    account,
    guestsDateOfBirth,
    disableProductsByGuestsDateOfBirth,
    inModal
  }) => {
    const filteredProducts = allProducts.filter(product => {
      let searchTermMatches = true
      let productNames, productSkus
      if (searchTerm.length > 0) {
        productNames = product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1

        if (product.skus) {
          product.skus.forEach(sku => {
            if (sku.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              productSkus = true
            }
          })
        }

        searchTermMatches = productNames || productSkus
      }
      if (categoryIdSelected) {
        return product.categoryIds.includes(categoryIdSelected) && searchTermMatches
      }
      return searchTermMatches
    })
    return (
      <ListWrapper>
        {filteredProducts.length ? (
          filteredProducts.map(product => (
            <ProductCard
              disableProductsByGuestsDateOfBirth={disableProductsByGuestsDateOfBirth}
              guestsDateOfBirth={guestsDateOfBirth}
              key={product.id}
              product={product}
              onProductSelected={onProductSelected}
              hideQuantitySelector={hideQuantitySelector}
              account={account}
              bgColor={product.color}
            />
          ))
        ) : (
          <Par id="noProducts">No products</Par>
        )}
      </ListWrapper>
    )
  }
)
