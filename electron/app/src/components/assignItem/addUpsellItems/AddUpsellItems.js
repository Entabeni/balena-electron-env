import React from 'react'

// Components
import { UpsellProductsListWrapper, AssignItemModal } from 'es-components'

export class AddUpsellItems extends React.Component {
  state = { upsellProductSelected: null, upsellQuantitySelected: null }

  onProductSelected = (product, quantity) => {
    const { onAddUpsellItem } = this.props

    if (product.steps && product.steps.length > 0) {
      this.setState({ upsellProductSelected: product, upsellQuantitySelected: quantity })
    } else {
      if (onAddUpsellItem) {
        onAddUpsellItem(product, quantity)
      }
    }
  }

  handleProductAdded = upsellItems => {
    const { onAddUpsellItem } = this.props
    if (onAddUpsellItem) {
      onAddUpsellItem(upsellItems)
      this.setState({ upsellProductSelected: null, upsellQuantitySelected: null })
    }
  }

  handleProductDeSelected = () => {
    this.setState({ upsellProductSelected: null, upsellQuantitySelected: null })
  }

  render() {
    const { productSelected, selectedUpsellItems, selectedGuest } = this.props
    const { upsellProductSelected, upsellQuantitySelected } = this.state
    const selectedItems = selectedUpsellItems.map(prod => prod.productId)

    return (
      <>
        <UpsellProductsListWrapper allProducts={productSelected.upsellProducts} selectedProducts={selectedItems} onProductSelected={this.onProductSelected} />
        {upsellProductSelected && upsellQuantitySelected && (
          <AssignItemModal
            selectedGuest={selectedGuest}
            productSelected={upsellProductSelected}
            quantitySelected={upsellQuantitySelected}
            onProductAdded={this.handleProductAdded}
            onCancelClick={this.handleProductDeSelected}
          />
        )}
      </>
    )
  }
}
