import React from 'react'

// Component

import { AddUpsellItems, ProductModal } from 'es-components'

export class AddUpsellItemModal extends React.Component {
  state = {
    upsellItems: []
  }

  onAddUpsellItem = (product, quantity) => {
    const { upsellItems } = this.state
    if (product && quantity) {
      upsellItems.push({ productId: product.id, quantity: quantity })
    } else {
      upsellItems.push(...product)
    }

    this.setState({ upsellItems })
  }

  handleCompleteClick = () => {
    const { productSelected, quantitySelected, onProductAdded } = this.props
    const { upsellItems } = this.state
    const orderLineItems = [{ productId: productSelected.id, quantity: quantitySelected, upsellOrderLineItems: upsellItems || null }]

    onProductAdded(orderLineItems)
  }

  render() {
    const { onCancelHandler, productSelected } = this.props

    return (
      <ProductModal
        title={productSelected.name}
        subTitle="Select any additional products to add to the order."
        cancelBtnTitle="Cancel"
        onCancelHandler={onCancelHandler}
        onPrimaryBtnHandler={this.handleCompleteClick}
        primaryBtnTitle="Complete">
        <AddUpsellItems productSelected={productSelected} selectedUpsellItems={this.state.upsellItems} onAddUpsellItem={this.onAddUpsellItem} />
      </ProductModal>
    )
  }
}
