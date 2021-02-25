import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import styled, { css } from 'styled-components'

import {
  ProductModal,
  AssignLayout,
  AssignLayoutLeft,
  AssignLayoutRight,
  ListItemWrapper,
  ListGrid,
  ListItem,
  SpinLoader,
  DiscountItem,
  CheckboxInput,
  DiscountOrderLine,
  Button,
  SearchTextInput
} from 'es-components'
import { formatCurrency } from 'es-libs'

const OrdersTableSection = styled.div`
  width: 100%;
  min-width: 600px;
`

const OrderItemElement = styled.div``

const MainWrapper = styled.div``

const Tabs = styled.section`
  display: flex;
  justify-content: stretch;
  align-content: stretch;
  align-items: stretch;
  height: 40px;
`

const Tab = styled.span`
  color: ${props => props.theme.white};
  font-weight: bold;
  font-size: 0.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: ${props => (props.active ? props.theme.primary : props.theme.greyTint)};
  border-right: 1px solid ${props => props.theme.white};
  cursor: pointer;
`

const sharedFieldStyle = css`
  display: flex;
  align-items: center;
  outline: 0;
  z-index: 1;
  width: 100%;
  box-shadow: none;
  box-sizing: border-box;
  background-color: transparent;
  font-weight: 400;
  border-style: solid;
  border-width: 0.08rem;
  border-radius: ${props => props.theme.borderRadius};
  transition: border 0.2s, font 0.2s;
  position: relative;
`

const FieldInput = styled.input`
  width: 100%;
  height: 45px;
  padding: ${props => (props.value ? '8px 50px 0 15px' : '0 50px 0 15px')};

  ${sharedFieldStyle}

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`

const TextFieldContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  min-height: 40px;
  position: relative;
`

const FieldLabel = styled.label`
  top: 0;
  left: 15px;
  right: 0;
  bottom: ${props => (props.activeInput ? '25px' : 0)};
  z-index: 0;
  font-weight: 300;
  font-size: ${props => (props.activeInput ? '0.6rem' : '1rem')};
  position: absolute;
  display: flex;
  align-items: center;
`

const FieldErrorMsg = styled.small`
  display: block;
  position: absolute;
  right: 0;
  bottom: -12px;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 400;
  background-color: ${props => props.theme.red};
  padding: 3px 10px;
  color: ${props => props.theme.white};
  z-index: 2;
`

const GET_All_DISCOUNTS = gql`
  query AllDiscounts {
    pos {
      allDiscounts {
        id
        objectID
        name
        discountType
        discountValue
        description
        enabled
      }
    }
  }
`

export class DiscountModal extends Component {
  constructor(props) {
    super(props)

    let promoCodes = {}
    if (props.order) {
      props.order.orderLineItems.forEach(orderLineItem => {
        promoCodes[orderLineItem.id] = orderLineItem.promoCode
      })
    }

    this.state = {
      order: props.order,
      discount: '',
      checkedRows: [],
      discountType: 'discount',
      promoCodes,
      discountsLoading: false,
      searchDiscountString: '',
      promoCodeApplying: {},
      fullDiscountsList: [],
      promoCodeErrors: {}
    }
  }

  componentDidMount() {
    const { client } = this.props

    this.setState({ discountsLoading: true }, () => {
      client.query({ query: GET_All_DISCOUNTS }).then(({ data }) => {
        const { allDiscounts } = data.pos
        this.setState({ discountsLoading: false, fullDiscountsList: allDiscounts })
      })
    })
  }

  static getDerivedStateFromProps(props, state) {
    if (state.discountType === 'promoCode' && JSON.stringify(props.order) !== JSON.stringify(state.order)) {
      return { order: props.order }
    }
    return null
  }

  onChangeDiscountType = discountType => {
    this.setState({ discountType, discount: '', checkedRows: [] })
  }

  onChangePromoCode = (orderLineItemId, promoCode) => {
    this.setState(state => ({ promoCodes: Object.assign({}, state.promoCodes, { [orderLineItemId]: promoCode }) }))
  }

  onDiscountSelect = currentDiscount => {
    const { discount } = this.state
    if (discount === '') {
      this.setState({ discount: currentDiscount })
    } else {
      this.setState({ discount: '' })
    }
  }

  onCancelBtnHandler = () => {
    const { onApplyBtnHandler, onCancelBtnHandler, order } = this.props
    const { discountType } = this.state

    if (discountType === 'promoCode') {
      let orderItemsToDeleteDiscounts = []
      order.orderLineItems.forEach(orderItem => {
        // array of deleted discounts
        const currentDiscount = orderItem.orderDiscountLineItems[0]
        if (currentDiscount && currentDiscount._destroy) {
          const orderItemToDelete = { orderDiscountLineItems: [currentDiscount], id: orderItem.id }
          orderItemsToDeleteDiscounts.push(orderItemToDelete)
        }
      })
      if (orderItemsToDeleteDiscounts.length) {
        onApplyBtnHandler(orderItemsToDeleteDiscounts, [])
        return
      }
    }
    if (discountType === 'discount') {
      order.orderLineItems.forEach(orderItem => {
        const currentDiscount = orderItem.orderDiscountLineItems[0]
        if (currentDiscount && currentDiscount._destroy) {
          delete currentDiscount._destroy
        }
      })
    }
    if (onCancelBtnHandler) {
      onCancelBtnHandler()
    }
  }

  onPromoApplyBtnHandler = orderLineItemId => {
    const { onApplyPromoBtnHandler } = this.props
    const { promoCodes } = this.state

    this.setState(
      state => ({
        promoCodeApplying: Object.assign({}, state.promoCodeApplying, { [orderLineItemId]: true }),
        promoCodeErrors: Object.assign({}, state.promoCodeErrors, { [orderLineItemId]: false })
      }),
      () => {
        let newOrderLineItems = []
        newOrderLineItems.push({
          id: orderLineItemId,
          promoCode: promoCodes[orderLineItemId]
        })
        onApplyPromoBtnHandler(newOrderLineItems)
          .then(res => {
            this.setState(state => ({
              promoCodeApplying: Object.assign({}, state.promoCodeApplying, { [orderLineItemId]: false }),
              promoCodeErrors: Object.assign({}, state.promoCodeErrors, { [orderLineItemId]: false })
            }))
          })
          .catch(err => {
            this.setState(state => ({
              promoCodeApplying: Object.assign({}, state.promoCodeApplying, { [orderLineItemId]: false }),
              promoCodeErrors: Object.assign({}, state.promoCodeErrors, { [orderLineItemId]: true })
            }))
          })
      }
    )
  }

  onApplyBtnHandler = () => {
    const { onApplyBtnHandler } = this.props
    const { checkedRows, discount, order, discountType } = this.state

    if (discountType === 'discount' && onApplyBtnHandler) {
      let orderItemsToDeleteDiscounts = []
      let newOrderLineItems = []
      order.orderLineItems.forEach(orderItem => {
        // array of deleted discounts
        const currentDiscount = orderItem.orderDiscountLineItems[0]
        if (currentDiscount && currentDiscount._destroy) {
          const orderItemToDelete = { orderDiscountLineItems: [{ id: currentDiscount.id, _destroy: currentDiscount['_destroy'] }], id: orderItem.id }
          orderItemsToDeleteDiscounts.push(orderItemToDelete)
        }
        // array of add new discount
        if (checkedRows.indexOf(orderItem.id) !== -1 && discount) {
          const newOrderItem = { orderDiscountLineItems: [], id: orderItem.id }
          newOrderItem.orderDiscountLineItems.push({ discountId: discount.id })
          newOrderLineItems.push(newOrderItem)
        }
      })

      onApplyBtnHandler(orderItemsToDeleteDiscounts, newOrderLineItems)
    } else {
      this.onCancelBtnHandler()
    }
  }

  tableHeaderCheckHandler = (val, checkState) => {
    if (checkState) {
      const { order } = this.state
      const checkedRows = []
      order.orderLineItems.forEach(orderLineItem => {
        checkedRows.push(orderLineItem.id)
      })
      this.setState({ checkedRows })
    } else {
      this.setState({ checkedRows: [] })
    }
  }

  checkHandler = (checkedRowId, checkState) => {
    const { checkedRows } = this.state
    if (checkState) {
      checkedRows.push(checkedRowId)
      this.setState({ checkedRows })
    } else {
      this.removeOrderLineItemFromDiscount(checkedRowId)
    }
  }

  removeOrderLineItemFromDiscount = checkedRowId => {
    // remove checkbox
    const { checkedRows, order } = this.state
    checkedRows.forEach((val, index) => {
      if (val === checkedRowId) {
        checkedRows.splice(index, 1)
      }
    })

    // remove from order
    order.orderLineItems.forEach(item => {
      const currentDiscount = item.orderDiscountLineItems[0]
      if (item.id === checkedRowId && currentDiscount) {
        item.orderDiscountLineItems = [{ ...currentDiscount, _destroy: true }]
      }
    })

    this.setState({ checkedRows, order, discount: '' })
  }

  getTableHeaderLabels = () => {
    const { discount } = this.state
    let tableHeaderLabels = [
      { title: 'checkbox', align: 'left' },
      { title: 'Item', align: 'left' },
      { title: 'Qty', align: 'center' },
      { title: 'Price', align: 'center' },
      { title: 'Subtotal', align: 'center' }
    ]
    if (discount !== '') {
      tableHeaderLabels.forEach((val, index) => {
        if (val.title === 'checkbox') {
          tableHeaderLabels.splice(index, 1)
        }
      })
    }

    return tableHeaderLabels
  }

  getPromoCodeTableHeaderLabels = () => {
    let tableHeaderLabels = [
      { title: 'Item', align: 'left' },
      { title: 'Qty', align: 'center' },
      { title: 'Price', align: 'center' },
      { title: 'Subtotal', align: 'center' },
      { title: 'Promo Code', align: 'center' },
      { title: 'Apply', align: 'center' }
    ]

    return tableHeaderLabels
  }

  onSearchDiscountHandler = searchDiscountString => {
    this.setState({ searchDiscountString })
  }

  renderDiscounts = () => {
    const { discount, fullDiscountsList, discountsLoading, searchDiscountString } = this.state

    if (discountsLoading) {
      return <SpinLoader withWrapper size="80px" color="primary" />
    }

    const discountItems = fullDiscountsList.filter(discount => discount.name.toLowerCase().indexOf(searchDiscountString.toLowerCase()) !== -1)

    return (
      <>
        <SearchTextInput searchTitle="Search Discount" onChangeHandler={this.onSearchDiscountHandler} />
        {discountItems
          .filter(item => item.enabled)
          .map((itemDiscount, index) => {
            return (
              <DiscountItem
                index={index}
                key={itemDiscount.id}
                selectedDiscount={discount}
                discountItem={itemDiscount}
                onDiscountSelect={this.onDiscountSelect}
              />
            )
          })}
      </>
    )
  }

  renderOrderItemsTable = () => {
    const { order, discount, checkedRows } = this.state
    let tableHeaderLabels = this.getTableHeaderLabels()
    let orderLineItems = order.orderLineItems.filter(orderLineItem => +orderLineItem.quantity > 0)

    return (
      <OrdersTableSection>
        <ListGrid
          hideSearch
          checkHandler={this.tableHeaderCheckHandler}
          headerCheckboxChecked={checkedRows.length > 0}
          listTitle={'Order: ' + order.number}
          listHeaders={tableHeaderLabels}
          listColWidths={discount === '' ? '1fr 4fr 1fr 1fr 1fr' : '5fr 1fr 1fr 1fr'}>
          {orderLineItems &&
            orderLineItems.map((orderLineItem, index) => {
              const showDiscountRow =
                (discount !== '' && checkedRows.indexOf(orderLineItem.id) !== -1) ||
                (orderLineItem.orderDiscountLineItems.length > 0 &&
                  !orderLineItem.orderDiscountLineItems[0]._destroy &&
                  orderLineItem.orderDiscountLineItems[0].discountId !== null)
              const existingDiscount =
                orderLineItem.orderDiscountLineItems.length > 0 && !orderLineItem.orderDiscountLineItems[0]._destroy
                  ? orderLineItem.orderDiscountLineItems[0]
                  : null

              let discountSum = 0
              if (discount !== '' && checkedRows.indexOf(orderLineItem.id) !== -1) {
                discountSum =
                  discount.discountType === 'percentage' ? Math.round(orderLineItem.price * (discount.discountValue / 100) * 100) / 100 : discount.discountValue
              }

              let subTotalCalc = orderLineItem.subTotal
              if (orderLineItem.orderDiscountLineItems && orderLineItem.orderDiscountLineItems.length && orderLineItem.orderDiscountLineItems[0]._destroy) {
                subTotalCalc = orderLineItem.price
              }

              let subTotal = existingDiscount === null && discount !== '' ? subTotalCalc - discountSum : subTotalCalc
              return (
                <OrderItemElement key={orderLineItem.id}>
                  <ListItemWrapper id={`orderItemForDiscount_${index}`} difRowColor>
                    {discount === '' && (
                      <ListItem>
                        <CheckboxInput
                          onClickHandler={this.checkHandler}
                          checked={checkedRows.indexOf(orderLineItem.id) !== -1}
                          id={orderLineItem.id}
                          field={'item' + orderLineItem.id}
                        />
                      </ListItem>
                    )}
                    <ListItem>{orderLineItem.name}</ListItem>
                    <ListItem align="center">{orderLineItem.quantity}</ListItem>
                    <ListItem align="center">{formatCurrency(orderLineItem.price)}</ListItem>
                    <ListItem align="center">{formatCurrency(subTotal)}</ListItem>
                  </ListItemWrapper>
                  {showDiscountRow && (
                    <DiscountOrderLine
                      index={index}
                      onRemoveDiscount={this.removeOrderLineItemFromDiscount}
                      orderLineItem={orderLineItem}
                      checkedRows={checkedRows}
                      discountItem={discount}
                      existingDiscount={existingDiscount}
                    />
                  )}
                </OrderItemElement>
              )
            })}
        </ListGrid>
      </OrdersTableSection>
    )
  }

  renderPromoCodeOrderItemsTable = () => {
    const { order, promoCodes, promoCodeErrors, promoCodeApplying } = this.state
    let tableHeaderLabels = this.getPromoCodeTableHeaderLabels()
    let orderLineItems = order.orderLineItems.filter(orderLineItem => +orderLineItem.quantity > 0)

    return (
      <OrdersTableSection>
        <ListGrid hideSearch listTitle={'Order: ' + order.number} listHeaders={tableHeaderLabels} listColWidths={'5fr 1fr 1fr 1fr 2fr 1fr'}>
          {orderLineItems &&
            orderLineItems.map(orderLineItem => {
              const existingDiscount =
                orderLineItem.orderDiscountLineItems.length > 0 &&
                !orderLineItem.orderDiscountLineItems[0]._destroy &&
                orderLineItem.orderDiscountLineItems[0].promoCodeId !== null
                  ? orderLineItem.orderDiscountLineItems[0]
                  : null
              return (
                <OrderItemElement key={orderLineItem.id}>
                  <ListItemWrapper difRowColor>
                    <ListItem>{orderLineItem.name}</ListItem>
                    <ListItem align="center">{orderLineItem.quantity}</ListItem>
                    <ListItem align="center">{formatCurrency(orderLineItem.price)}</ListItem>
                    <ListItem align="center">{formatCurrency(orderLineItem.subTotal)}</ListItem>
                    <ListItem align="center">
                      {existingDiscount ? (
                        <div>{promoCodes[orderLineItem.id]}</div>
                      ) : (
                        <TextFieldContainer className="fieldContainer">
                          <FieldLabel htmlFor="search" activeInput={promoCodes[orderLineItem.id]}>
                            Promo Code
                          </FieldLabel>
                          <FieldInput
                            value={promoCodes[orderLineItem.id]}
                            onChange={e => this.onChangePromoCode(orderLineItem.id, e.target.value)}
                            autoComplete="off"
                            err={promoCodeErrors[orderLineItem.id]}
                          />
                          {promoCodeErrors[orderLineItem.id] ? <FieldErrorMsg>Not a valid promo code</FieldErrorMsg> : null}
                        </TextFieldContainer>
                      )}
                    </ListItem>
                    <ListItem align="center">
                      {existingDiscount ? (
                        ''
                      ) : (
                        <Button
                          kind="primary"
                          sizeW="narrow"
                          title="Apply"
                          rounded
                          loading={promoCodeApplying[orderLineItem.id]}
                          onClickHandler={() => this.onPromoApplyBtnHandler(orderLineItem.id)}
                        />
                      )}
                    </ListItem>
                  </ListItemWrapper>
                  {existingDiscount ? (
                    <DiscountOrderLine
                      onRemoveDiscount={this.removeOrderLineItemFromDiscount}
                      orderLineItem={orderLineItem}
                      checkedRows={[]}
                      discountItem={null}
                      existingDiscount={existingDiscount}
                      layout="promo"
                    />
                  ) : null}
                </OrderItemElement>
              )
            })}
        </ListGrid>
      </OrdersTableSection>
    )
  }

  renderDiscount() {
    return (
      <AssignLayout gridTemplate="2fr 1fr" noBGColor>
        <AssignLayoutLeft rightBorder>{this.renderOrderItemsTable()}</AssignLayoutLeft>
        <AssignLayoutRight>{this.renderDiscounts()}</AssignLayoutRight>
      </AssignLayout>
    )
  }

  renderPromoCode() {
    return (
      <AssignLayout gridTemplate="1fr" noBGColor>
        <AssignLayoutLeft>{this.renderPromoCodeOrderItemsTable()}</AssignLayoutLeft>
      </AssignLayout>
    )
  }

  renderDiscountType() {
    const { discountType } = this.state
    if (discountType === 'discount') {
      return this.renderDiscount()
    }
    if (discountType === 'promoCode') {
      return this.renderPromoCode()
    }
    return null
  }

  render() {
    const { discountType } = this.state
    return (
      <ProductModal
        title="Apply discounts / promo codes to items"
        subTitle="Select the items to apply"
        cancelBtnTitle={discountType === 'discount' ? 'Cancel' : 'Done'}
        onCancelHandler={this.onCancelBtnHandler}
        onPrimaryBtnHandler={discountType === 'discount' ? this.onApplyBtnHandler : null}
        primaryBtnTitle="Apply">
        <MainWrapper>
          <Tabs>
            <Tab active={discountType === 'discount'} onClick={() => this.onChangeDiscountType('discount')}>
              Discounts
            </Tab>
            <Tab active={discountType === 'promoCode'} onClick={() => this.onChangeDiscountType('promoCode')}>
              Promo Codes
            </Tab>
          </Tabs>
          {this.renderDiscountType()}
        </MainWrapper>
      </ProductModal>
    )
  }
}
