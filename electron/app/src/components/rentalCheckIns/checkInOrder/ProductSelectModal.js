import React from 'react'
import { Query } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'

import { ProductModal, DashboardWrapperSingle, SpinLoader, AssignItemModal, AssignResortEventModal, CaptureGuestDOB, AddUpsellItemModal } from 'es-components'
import { ProductsPage } from 'es-pages'

import { ADD_ORDER_LINE_ITEMS_MUTATION, CREATE_ORDER_MUTATION, GET_DASHBOARD_QUERY, GET_PRODUCT_BY_ID } from '../../../pages/dashboard/schema'

import { saveDateFormat, displayDateFormat } from 'es-libs'
import { gql } from 'apollo-boost/lib/index'

const UPDATE_GUEST_USER = gql`
  mutation UpdateGuest($userId: String!, $profilePictureUrl: String, $dateOfBirth: String) {
    pos {
      updateGuest(id: $userId, profilePictureUrl: $profilePictureUrl, dateOfBirth: $dateOfBirth) {
        id
        profilePictureUrl
        dateOfBirth
      }
    }
  }
`

class ProductSelectModal extends React.Component {
  state = {
    resortEventProductSelected: null,
    resortEventDateSelected: null,
    currentOrderId: null,
    productSelected: [],
    currentCheckIn: null,
    quantitySelected: null,
    orderLineItems: [],
    updatingOrder: false,
    guestDateOfBirth: undefined
  }

  componentDidMount() {
    const { checkIns, toCurrentOrder, currentOrderId } = this.props
    if (checkIns.length) {
      if (checkIns[0].guest) {
        this.setState({ currentCheckIn: checkIns[0], guestDateOfBirth: checkIns[0].guest.dateOfBirth })
      } else {
        this.setState({ currentCheckIn: checkIns[0] })
      }
    }

    if (!toCurrentOrder || !currentOrderId) {
      this.createOrder()
    } else {
      this.setState({ currentOrderId })
    }
  }

  createOrder() {
    const { client } = this.props
    client
      .mutate({
        mutation: CREATE_ORDER_MUTATION
      })
      .then(res => {
        const currentOrderId = res.data.pos.createOrder.id
        this.setState({
          currentOrderId
        })
      })
  }

  onCancelClick = () => {
    const { onCancelClick } = this.props

    if (onCancelClick) {
      onCancelClick()
    }
  }

  handleProductAdded = products => {
    let { productSelected, currentCheckIn, orderLineItems, quantitySelected } = this.state
    const { checkIns } = this.props
    const checkInIndex = Object.keys(productSelected).length
    const currentProduct = productSelected[currentCheckIn.id]
    if (currentProduct) {
      products.forEach(product => {
        product['checkInIds'] = [currentCheckIn.id]
        product['productId'] = currentProduct.id
        product['quantity'] = +quantitySelected
        orderLineItems.push(product)
      })

      let guestDateOfBirth = null
      if (checkIns[checkInIndex] && checkIns[checkInIndex].guest) {
        guestDateOfBirth = checkIns[checkInIndex].guest.dateOfBirth
      }

      this.setState({ orderLineItems, currentCheckIn: checkIns[checkInIndex], guestDateOfBirth })
    }
  }

  handleResortEventProductSelected = (dateSelected, quantitySelected) => {
    let { productSelected, resortEventProductSelected, currentCheckIn } = this.state
    productSelected[currentCheckIn.id] = resortEventProductSelected

    this.setState({
      resortEventProductSelected: null,
      productSelected,
      resortEventDateSelected: dateSelected,
      quantitySelected
    })
  }

  updateDOB = async (dateOfBirth, guestId) => {
    const { client, toastManager } = this.props
    const savedGuest = await client.mutate({
      mutation: UPDATE_GUEST_USER,
      variables: { userId: guestId, dateOfBirth: saveDateFormat(dateOfBirth) }
    })
    if (savedGuest) {
      this.setState({ guestDateOfBirth: dateOfBirth }, () =>
        toastManager.add('Date of birth updated successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      )
    }
  }

  handleGuestDateOfBirthSelect = dateOfBirth => {
    const { currentCheckIn } = this.state
    if (currentCheckIn) {
      const { guest } = currentCheckIn
      if (guest && guest.id) {
        this.updateDOB(dateOfBirth, guest.id)
      }
    }
  }

  handleProductDeSelected = () => {
    let { productSelected, currentCheckIn } = this.state
    productSelected[currentCheckIn.id] = null

    this.setState({ productSelected, resortEventProductSelected: null, quantitySelected: null })
  }

  handleProductSelected = (product, quantitySelected) => {
    const { client, checkIns } = this.props
    let { productSelected, currentCheckIn, orderLineItems } = this.state

    const checkInIndex = Object.keys(productSelected).length + 1

    client.query({ query: GET_PRODUCT_BY_ID, variables: { id: product.id || product.objectID } }).then(({ data }) => {
      const selectedProductDetails = data.pos.product
      productSelected[currentCheckIn.id] = selectedProductDetails

      if (selectedProductDetails && selectedProductDetails.steps.length === 0 && selectedProductDetails.upsellProducts.length === 0) {
        orderLineItems.push({
          guestLineItems: currentCheckIn.guest ? [{ guestId: currentCheckIn.guest.id }] : [],
          productId: selectedProductDetails.id,
          quantity: quantitySelected,
          checkInIds: [currentCheckIn.id]
        })

        let guestDateOfBirth = null
        if (checkIns[checkInIndex] && checkIns[checkInIndex].guest) {
          guestDateOfBirth = checkIns[checkInIndex].guest.dateOfBirth
        }
        this.setState({
          orderLineItems,
          currentCheckIn: checkIns[checkInIndex],
          guestDateOfBirth,
          quantitySelected
        })
      } else if (selectedProductDetails && (selectedProductDetails.steps.length > 0 || selectedProductDetails.upsellProducts.length > 0)) {
        this.setState({
          quantitySelected,
          productSelected
        })
      } else if (selectedProductDetails.checkStockLevel) {
        this.setState({
          resortEventProductSelected: selectedProductDetails,
          productSelected,
          quantitySelected
        })
      }
    })
  }

  handleProductsAdded = () => {
    const { client, history, toastManager, toCurrentOrder } = this.props
    const { currentOrderId, orderLineItems, updatingOrder } = this.state
    const printTerminalId = window.localStorage.getItem('printTerminalId')

    if (!updatingOrder) {
      this.setState({ updatingOrder: true }, () => {
        client
          .mutate({
            mutation: ADD_ORDER_LINE_ITEMS_MUTATION,
            variables: { id: currentOrderId, orderLineItems }
          })
          .then(res => {
            this.setState({ productSelected: null, quantitySelected: null, currentCheckIn: null })
            if (toCurrentOrder) {
              toastManager.add(`Check-ins successfully added to current order`, {
                appearance: 'success',
                autoDismissTimeout: 3000,
                autoDismiss: true
              })
            } else {
              toastManager.add(`New order was created`, { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
            }

            history.push(`/order/${currentOrderId}`)
          })
          .catch(error => {
            this.setState({ productSelected: null, quantitySelected: null, currentCheckIn: null })
            toastManager.add(`An error occured`, { appearance: 'error', autoDismiss: true })
            history.push(`/order/${currentOrderId}`)
          })
      })
    }
  }

  renderModalData = () => {
    const { orderLineItems } = this.state
    const { checkIns } = this.props
    if (checkIns.length === orderLineItems.length) {
      this.handleProductsAdded()
      return (
        <DashboardWrapperSingle>
          <SpinLoader withWrapper size="80px" color="primary" />
        </DashboardWrapperSingle>
      )
    }
    return this.renderProductsList()
  }

  renderProductsList = () => {
    const { currentOrderId, guestDateOfBirth } = this.state
    const { onRefreshProducts, allProducts, allCategories, productsLoading } = this.props

    let filteredCategories = []
    if (!productsLoading && allCategories) {
      filteredCategories = allCategories.filter(category => {
        const categoryIdsUnique = []
        allProducts.forEach(product => {
          if (product.categoryIds && product.categoryIds.length) {
            product.categoryIds.forEach(categoryId => {
              if (!categoryIdsUnique.includes(categoryId)) {
                categoryIdsUnique.push(categoryId)
              }
            })
          }
        })
        if (categoryIdsUnique.length) {
          return categoryIdsUnique.includes(category.id)
        }
        return true
      })
    }

    return (
      <Query query={GET_DASHBOARD_QUERY} variables={{ id: currentOrderId }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <DashboardWrapperSingle>
                <SpinLoader withWrapper size="80px" color="primary" />
              </DashboardWrapperSingle>
            )
          if (error) return `Error! ${error.message}`
          const { order, account } = data.pos

          const filteredCategories = allCategories.filter(category => {
            const categoryIdsUnique = []
            allProducts.forEach(product => {
              if (product.categoryIds && product.categoryIds.length) {
                product.categoryIds.forEach(categoryId => {
                  if (!categoryIdsUnique.includes(categoryId)) {
                    categoryIdsUnique.push(categoryId)
                  }
                })
              }
            })
            if (categoryIdsUnique.length) {
              return categoryIdsUnique.includes(category.id)
            }
            return true
          })

          return productsLoading ? (
            <SpinLoader withWrapper size="80px" color="primary" />
          ) : (
            <ProductsPage
              onRefreshProducts={onRefreshProducts}
              allProducts={allProducts}
              allCategories={filteredCategories}
              account={account}
              guestsDateOfBirth={displayDateFormat(guestDateOfBirth)}
              disableProductsByGuestsDateOfBirth
              onProductSelected={this.handleProductSelected}
              inModal
            />
          )
        }}
      </Query>
    )
  }

  render() {
    const {
      currentOrderId,
      currentCheckIn,
      resortEventProductSelected,
      productSelected,
      resortEventDateSelected,
      quantitySelected,
      guestDateOfBirth,
      updatingOrder
    } = this.state
    const { accountFromRequest, toCurrentOrder, client } = this.props

    let title = 'Create Order'
    let subTitle = 'Order Creating'
    if (toCurrentOrder) {
      title = 'Adding to current order'
      subTitle = 'Adding to current order'
    }

    let currentProduct
    let guest
    let guestAssets = ''
    if (currentCheckIn && currentCheckIn.guest) {
      currentProduct = productSelected[currentCheckIn.id]
      guest = currentCheckIn.guest
      guest['age'] = currentCheckIn.age ? currentCheckIn.age : ''
      const guestName = guest.fullName
      const guestAge = currentCheckIn.age ? `(age of ${currentCheckIn.age})` : ''
      if (currentCheckIn.rentalAssets && currentCheckIn.rentalAssets.length) {
        guestAssets = '. Rental assets: '
        currentCheckIn.rentalAssets.forEach((asset, i) => {
          guestAssets += ` ${asset.assetClassName}`
          if (currentCheckIn.rentalAssets.length - 1 > i) {
            guestAssets += ','
          } else {
            guestAssets += '.'
          }
        })
      }

      title = `Create Order for ${guestName} ${guestAge}`
      subTitle = `Search, refine, scroll down and select a product${guestAssets}`
    }

    const productModalContentSectionCustomStyles = {
      margin: '1rem 0 0',
      maxHeight: 'calc(90vh - 11rem)',
      padding: '0 !important'
    }

    return (
      <>
        <ProductModal
          title={title}
          subTitle={subTitle}
          onCancelHandler={this.onCancelClick}
          closeIcon
          lightLayout
          height="90%"
          maxHeight="90%"
          contentSectionCustomStyles={productModalContentSectionCustomStyles}>
          {currentOrderId != null ? (
            this.renderModalData()
          ) : (
            <DashboardWrapperSingle>
              <SpinLoader withWrapper size="80px" color="primary" />
            </DashboardWrapperSingle>
          )}
        </ProductModal>
        {resortEventProductSelected && (
          <AssignResortEventModal
            client={client}
            productSelected={resortEventProductSelected}
            onDateQuantitySelected={this.handleResortEventProductSelected}
            onCancelClick={this.handleProductDeSelected}
          />
        )}
        {!resortEventProductSelected && currentProduct && currentProduct.steps && currentProduct.steps[0] === 'addGuests' && quantitySelected && (
          <AssignItemModal
            productSelected={currentProduct}
            resortEventDateSelected={resortEventDateSelected}
            quantitySelected={1}
            selectedGuest={guest}
            checkIn
            onCancelClick={this.handleProductDeSelected}
            account={accountFromRequest}
            onProductAdded={this.handleProductAdded}
          />
        )}
        {!resortEventProductSelected && currentProduct && currentProduct.steps.length === 0 && currentProduct.upsellProducts.length > 0 && quantitySelected && (
          <AddUpsellItemModal
            productSelected={currentProduct}
            quantitySelected={quantitySelected}
            onCancelHandler={this.handleProductDeSelected}
            onProductAdded={this.handleProductAdded}
          />
        )}
        {!updatingOrder && !guestDateOfBirth && <CaptureGuestDOB account={accountFromRequest} onCompleteClick={this.handleGuestDateOfBirthSelect} />}
      </>
    )
  }
}

export default withToastManager(ProductSelectModal)
