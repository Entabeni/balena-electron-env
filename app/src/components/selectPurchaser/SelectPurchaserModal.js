import React, { Component } from 'react'
import styled from 'styled-components'

import { ProductModal, BasicForm, RadioInputGroup, RadioInput, Button, SelectGuest, CreateGuest, CaptureGuestDOB } from 'es-components'
import { getAge, parseDate, unique, saveDateFormat } from 'es-libs'

import { CurrentGuests } from './CurrentGuests'
import { gql } from 'apollo-boost/lib/index'

const PurchaserTabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 1em;
`

const AnonymousRadioButton = styled.div`
  position: absolute;
  top: 87%;
  right: 20px;
`

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

class SelectPurchaserModal extends Component {
  state = {
    purchaserSelected: null,
    activeTab: 'currentGuest',
    currentGuests: [],
    capturingGuestDateOfBirth: false,
    guestForAddingDOB: null
  }

  componentWillMount() {
    const { currentGuests } = this.state
    let { order, account, purchaserId } = this.props
    order.orderLineItems.forEach(orderLineItem => {
      if (orderLineItem.guestLineItems && orderLineItem.guestLineItems.length) {
        orderLineItem.guestLineItems.forEach(guestLineItem => {
          if (order.steps.findIndex(step => step === 'signWaivers') !== -1) {
            if (
              getAge(parseDate(guestLineItem.guest.dateOfBirth)) >= parseInt(account.ageOfMajority, 10) &&
              currentGuests.findIndex(currentGuest => currentGuest.id === guestLineItem.guest.id) === -1
            ) {
              currentGuests.push(guestLineItem.guest)
            }
          } else if (currentGuests.findIndex(currentGuest => currentGuest.id === guestLineItem.guest.id) === -1) {
            currentGuests.push(guestLineItem.guest)
          }
        })
      }
    })

    if (currentGuests && currentGuests.length === 1) {
      purchaserId = currentGuests[0].id
      this.setState({ currentGuests, purchaserSelected: purchaserId })
    } else {
      this.setState({ currentGuests, purchaserSelected: null })
    }
  }

  handleFormValueChange = values => {
    if (values.purchaser) {
      this.setState({
        purchaserSelected: values.purchaser
      })
    }
  }

  handleGuestCreateButtonClick = () => {
    this.setState({ activeTab: 'createGuest' })
  }

  handleGuestCreatingCancelButton = () => {
    this.setState({ activeTab: 'currentGuest' })
  }

  handleCloseDOBModal = () => {
    this.setState({ capturingGuestDateOfBirth: false, guestForAddingDOB: null })
  }

  updateDOB = async (dateOfBirth, guestId) => {
    const { client, toastManager } = this.props
    const { currentGuests, guestForAddingDOB } = this.state
    const savedGuest = await client.mutate({
      mutation: UPDATE_GUEST_USER,
      variables: { userId: guestId, dateOfBirth: saveDateFormat(dateOfBirth) }
    })
    if (savedGuest) {
      toastManager.add('Date of birth updated successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      this.setState(
        {
          capturingGuestDateOfBirth: false,
          guestForAddingDOB: null,
          currentGuests: unique(currentGuests, ['id']),
          purchaserSelected: guestForAddingDOB.id || guestForAddingDOB.objectID,
          activeTab: 'currentGuest'
        },
        () => this.selectAddedPurchaser(guestForAddingDOB.id)
      )
    }
  }

  handleCaptureGuestDateOfBirthSelect = dateOfBirth => {
    const { guestForAddingDOB } = this.state
    this.updateDOB(dateOfBirth, guestForAddingDOB.id)
  }

  handleGuestSelected = guest => {
    const { currentGuests } = this.state
    if (!guest.id && guest.objectID) {
      guest['id'] = guest.objectID
    }
    currentGuests.push(guest)

    if (guest.dateOfBirth === null) {
      this.setState({ capturingGuestDateOfBirth: true, guestForAddingDOB: guest })
    } else {
      this.setState({ currentGuests: unique(currentGuests, ['id']), purchaserSelected: guest.id || guest.objectID, activeTab: 'currentGuest' }, () =>
        this.selectAddedPurchaser(guest.id)
      )
    }
  }

  selectAddedPurchaser = id => {
    if (document.getElementById(`guest_${id}`)) {
      document.getElementById(`guest_${id}`).click()
    }
  }

  handleContinueClick = () => {
    const { onPurchaserAdded } = this.props
    const { purchaserSelected } = this.state
    onPurchaserAdded(purchaserSelected === 'anon' ? null : purchaserSelected)
  }

  onTabClick = activeTab => {
    this.setState({ activeTab }, () => {
      if (activeTab === 'currentGuest' && this.state.purchaserSelected) {
        this.selectAddedPurchaser(this.state.purchaserSelected)
      }
    })
  }

  renderTabs() {
    const { activeTab } = this.state

    if (activeTab !== 'createGuest') {
      return (
        <PurchaserTabWrapper>
          <Button
            title="Current guests"
            kind={activeTab === 'currentGuest' ? 'secondary' : 'tertiary'}
            onClickHandler={() => this.onTabClick('currentGuest')}
          />
          <Button title="Add guests" kind={activeTab === 'addGuest' ? 'secondary' : 'tertiary'} onClickHandler={() => this.onTabClick('addGuest')} />
        </PurchaserTabWrapper>
      )
    }
  }

  renderModalBody() {
    const { activeTab, currentGuests } = this.state
    const { order, account } = this.props
    if (activeTab === 'currentGuest') {
      return (
        <RadioInputGroup fieldGroup="purchaser" withoutWrapper>
          {currentGuests && <CurrentGuests currentGuests={currentGuests} />}
          {order.steps.findIndex(step => step === 'signWaivers') === -1 && (
            <AnonymousRadioButton>
              <RadioInput leftLabel margin="1em 0 0 0" id="Anonymous" label="Anynomous Purchaser" radioValue="anon" />
            </AnonymousRadioButton>
          )}
        </RadioInputGroup>
      )
    }

    if (activeTab === 'addGuest') {
      const listSectionCustomStyles = {
        maxHeight: 'calc(90vh - 275px - 5em)',
        overflowY: 'scroll'
      }
      return (
        <SelectGuest
          hideClearSearchButton
          fullHeight
          onSelect={this.handleGuestSelected}
          account={account}
          orderSteps={order.steps}
          listSectionCustomStyles={listSectionCustomStyles}
        />
      )
    }

    if (activeTab === 'createGuest') {
      const listSectionCustomStyles = {
        maxHeight: 'calc(90vh - 275px - 8.5em)',
        overflowY: 'scroll'
      }
      return (
        <CreateGuest
          addPurchaser
          listSectionCustomStyles={listSectionCustomStyles}
          onGuestCreated={this.handleGuestSelected}
          onCancelBtnClick={this.handleGuestCreatingCancelButton}
          account={account}
          useAgeOfMajority
          isAddProduct
          ageVariant={null}
        />
      )
    }
  }

  render() {
    const { onGoBack, account, primaryBtnLoading } = this.props
    const { purchaserSelected, capturingGuestDateOfBirth } = this.state
    const continueBtnDisabled = !purchaserSelected

    return (
      <ProductModal
        title="Select Purchaser"
        subTitle="Select or add a current guest as the purchaser."
        primaryBtnTitle="Continue"
        primaryBtnDisabled={continueBtnDisabled}
        primaryBtnLoading={primaryBtnLoading}
        onPrimaryBtnHandler={this.handleContinueClick}
        secondaryBtnTitle="Create Guest"
        secondaryBtnShow
        onSecondaryBtnHandler={this.handleGuestCreateButtonClick}
        onCancelHandler={onGoBack}
        cancelBtnTitle="Back"
        footerJustify="space-between"
        overflowY="hidden">
        {this.renderTabs()}
        <BasicForm height="90%" overflowY="hidden" light onValueChange={this.handleFormValueChange} initialValues={{ purchaser: purchaserSelected }}>
          {this.renderModalBody()}
        </BasicForm>
        {capturingGuestDateOfBirth && (
          <CaptureGuestDOB
            addingPurchaser
            fullHeight
            account={account}
            onCompleteClick={this.handleCaptureGuestDateOfBirthSelect}
            onCancelClick={this.handleCloseDOBModal}
          />
        )}
      </ProductModal>
    )
  }
}

export default SelectPurchaserModal
