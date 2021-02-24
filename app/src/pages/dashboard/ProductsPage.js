import React, { useEffect } from 'react'
import { updateCustomerFacingScreen } from 'es-libs'
// Components
import { MainPanelWrapper, ProductListWrapper } from 'es-components'

export const ProductsPage = React.memo(
  ({
    allProducts,
    onProductSelected,
    allCategories,
    hideQuantitySelector,
    order,
    account,
    setCurrentCustomerFacingScreen,
    useCurrentCustomerFacingScreen,
    onRefreshProducts,
    guestsDateOfBirth,
    disableProductsByGuestsDateOfBirth,
    inModal,
    client,
    orderId,
    toastManager
  }) => {
    useEffect(() => {
      if (order && order.orderLineItems.length > 0) {
        setCurrentCustomerFacingScreen('presentOrder')
        updateCustomerFacingScreen({ screen: 'presentOrder', client, toastManager, orderId })
      } else {
        if (useCurrentCustomerFacingScreen !== 'logo') {
          setCurrentCustomerFacingScreen('logo')
          updateCustomerFacingScreen({ screen: 'logo', client, toastManager, orderId })
        }
      }
      return () => {
        updateCustomerFacingScreen({ screen: 'logo', client, toastManager, orderId })
      }
    }, [])
    const [searchTerm, setSearchTerm] = React.useState('')
    const [categoryIdSelected, selectCategoryId] = React.useState(null)

    return (
      <MainPanelWrapper
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefreshProducts={onRefreshProducts}
        allCategories={allCategories}
        selectCategoryId={selectCategoryId}
        categoryIdSelected={categoryIdSelected}
        inModal={inModal}
        isProductsPage={allProducts && allCategories}>
        <ProductListWrapper
          allProducts={allProducts}
          searchTerm={searchTerm}
          categoryIdSelected={categoryIdSelected}
          guestsDateOfBirth={guestsDateOfBirth}
          disableProductsByGuestsDateOfBirth={disableProductsByGuestsDateOfBirth}
          onProductSelected={onProductSelected}
          hideQuantitySelector={hideQuantitySelector}
          account={account}
          inModal={inModal}
        />
      </MainPanelWrapper>
    )
  }
)
