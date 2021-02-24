import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import { withToastManager } from 'react-toast-notifications'
import { gql } from 'apollo-boost'

import { ProductModal, SpinLoader, AssignLayout, AssignLayoutLeft, AssignLayoutRight, ProductEduCard, AssignItemCard } from 'es-components'
import { auth, saveDateFormat, displayDateFormat, validateAgeVar, cloneObject } from 'es-libs'

import { SelectGuest, CreateGuest, CaptureGuestPhoto, CaptureGuestDOB, CaptureGuestRentalDetails } from './addGuests'
import { CreateEvent, EventWizard } from './addEvents'
import { AddAnswers } from './addAnswers'
import { AddUpsellItems } from './addUpsellItems'
import { SelectAccessDate } from './accessDates'

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

const UPDATE_GUEST_RENTAL_DETAILS = gql`
  mutation UpdateGuest($userId: String!, $level: String, $stance: String, $discipline: String, $weight: Float, $height: Float, $shoeSize: Float) {
    pos {
      updateGuest(id: $userId, level: $level, stance: $stance, discipline: $discipline, weight: $weight, height: $height, shoeSize: $shoeSize) {
        id
      }
    }
  }
`

class AssignItemModal extends Component {
  state = {
    currentStep: null,
    currentIndex: null,
    addUpsellItems: false,
    upsellItems: [],
    createdEvent: null,
    capturingGuestPhoto: false,
    capturingGuestDateOfBirth: false,
    capturingGuestRentalDetails: false,
    capturedGuestPhotoData: null,
    checkIn: false,
    steps: []
  }

  componentDidMount() {
    const { selectedGuest, quantitySelected, checkIn, productSelected } = this.props

    if (selectedGuest) {
      const guestCount =
        productSelected.ageVariants && productSelected.ageVariants.length > quantitySelected ? productSelected.ageVariants.length : quantitySelected
      if (productSelected.ageVariants) {
        for (let quant = 0; quant < guestCount; quant++) {
          const currentAgeVariant =
            (productSelected.ageVariants && productSelected.ageVariants.length) > quantitySelected
              ? productSelected.ageVariants[quant]
              : productSelected.ageVariants[productSelected.ageVariants.length - 1]

          this.setState({ checkIn, currentStep: 'addGuests', currentIndex: quant }, () =>
            this.selectGuestFromProps(currentAgeVariant, selectedGuest, true, quant)
          )
        }
      } else {
        this.setState({ checkIn, currentStep: 'addGuests', currentIndex: quantitySelected }, () =>
          this.handleGuestSelected(selectedGuest, true, quantitySelected - 1)
        )
      }
    }

    if (productSelected) {
      const steps = cloneObject(productSelected.steps)
      if (productSelected.productType === 'covidRental' && steps.indexOf('addAccessDate') === -1) {
        steps.push('addAccessDate')
      }

      this.setState({ steps })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.productSelected !== this.props.productSelected && nextProps.productSelected != null) {
      const steps = cloneObject(nextProps.productSelected.steps)
      if (nextProps.productSelected.productType === 'covidRental' && steps.indexOf('addAccessDate') === -1) {
        steps.push('addAccessDate')
      }

      this.setState({ steps })
    }
  }

  selectGuestFromProps = (currentAgeVariant, selectedGuest, setOnDidMount, quant) => {
    const { account } = this.props
    const validationResult = validateAgeVar(
      currentAgeVariant,
      account.ageCalculationMethod,
      account.endOfWinterSeasonMonth,
      account.ageCalculationDate
    )(displayDateFormat(selectedGuest.dateOfBirth))
    if (!validationResult) {
      this.handleGuestSelected(selectedGuest, setOnDidMount, quant)
    }
  }

  getProductState(index, step) {
    if (
      (step === 'addGuests' && this.state.currentStep === 'createGuest' && index === this.state.currentIndex) ||
      (step === 'addEvents' && this.state.currentStep === 'createEvent' && index === this.state.currentIndex)
    ) {
      return 'active'
    }

    if (step === this.state.currentStep && index === this.state.currentIndex) {
      return 'active'
    }

    if (index in this.state && this.state[index]) {
      if (step === 'addGuests' && this.state[index].guest !== undefined) {
        return 'completed'
      }
      if (step === 'addEvents' && this.state[index].eventLineItems !== undefined) {
        return 'completed'
      }
      if (step === 'addAccessDate' && this.state[index].accessDate !== undefined) {
        return 'completed'
      }
      if (step === 'addAnswers' && this.state[index].answers !== undefined) {
        return 'completed'
      }
    }

    return null
  }

  getStepText(index, step) {
    if (step === 'addGuests') {
      if (index in this.state && this.state[index] && this.state[index].guest !== undefined) {
        return `${this.state[index].guest.firstName} ${this.state[index].guest.lastName}`
      }
      return 'Select or create a guest'
    }
    if (step === 'addEvents') {
      if (index in this.state && this.state[index] && this.state[index].eventLineItems !== undefined) {
        return this.state[index].eventLineItems
          .map(eventLineItem => {
            return displayDateFormat(eventLineItem.eventDay)
          })
          .join(', ')
      }
      return 'Assign or create event groups'
    }
    if (step === 'addAccessDate') {
      if (index in this.state && this.state[index] && step === 'addAccessDate') {
        if (this.state[index].accessDate !== undefined) {
          return this.state[index].accessDate
        }
      }
      return 'Select an access date'
    }
    if (step === 'addAnswers') {
      if (index in this.state && this.state[index] && step === 'addAnswers') {
        if (this.state[index].addAnswers !== undefined) {
          return 'Questions answered'
        }
      }
      return 'Answer questions'
    }

    return null
  }

  getProductInfo(index) {
    return this.state.steps.map((step, innerIndex) => {
      return {
        id: innerIndex,
        assign: step,
        text: this.getStepText(index, step),
        productState: this.getProductState(index, step)
      }
    })
  }

  getContinueButtonDisabled() {
    const { productSelected, quantitySelected } = this.props
    let disabled = false

    if (productSelected.ageVariants && (productSelected.ageVariants.length > 1 || this.state.checkIn)) {
      for (let index = 0; index < productSelected.ageVariants.length; index++) {
        if (index in this.state && this.state[index]) {
          for (let indexInner = 0; indexInner < this.state.steps.length; indexInner++) {
            if (this.state.steps[indexInner] === 'addGuests' && this.state[index].guest === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addEvents' && this.state[index].eventLineItems === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addAccessDate' && this.state[index].accessDate === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addAnswers' && this.state[index].answers === undefined) {
              disabled = true
            }
          }
        } else {
          disabled = true
        }
      }
    } else {
      for (let index = 0; index < quantitySelected; index++) {
        if (index in this.state && this.state[index]) {
          for (let indexInner = 0; indexInner < this.state.steps.length; indexInner++) {
            if (this.state.steps[indexInner] === 'addGuests' && this.state[index].guest === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addEvents' && this.state[index].eventLineItems === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addAccessDate' && this.state[index].accessDate === undefined) {
              disabled = true
            }
            if (this.state.steps[indexInner] === 'addAnswers' && this.state[index].answers === undefined) {
              disabled = true
            }
          }
        } else {
          disabled = true
        }
      }
    }
    return disabled
  }

  uploadFile = async (file, guestId) => {
    const { client, toastManager } = this.props
    const urlData = await fetch(`${auth.getBaseUrl()}/signUrl?userId=${guestId}&uploadType=avatar`, {
      method: 'GET',
      mode: 'cors',
      headers: { Authorization: auth.getToken(), 'Content-Type': 'application/json', 'X-Key-Inflection': 'camel' }
    })
    urlData.json().then(async json => {
      const awsImage = await fetch(json.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })
      const savedImage = await client.mutate({
        mutation: UPDATE_GUEST_USER,
        variables: { userId: guestId, profilePictureUrl: awsImage.url.split('?')[0] }
      })
      if (savedImage) {
        toastManager.add('Image uploaded successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      }
    })
  }

  updateDOB = async (dateOfBirth, guestId) => {
    const { client, toastManager } = this.props
    const savedGuest = await client.mutate({
      mutation: UPDATE_GUEST_USER,
      variables: { userId: guestId, dateOfBirth: saveDateFormat(dateOfBirth) }
    })
    if (savedGuest) {
      toastManager.add('Date of birth updated successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
    }
  }

  updateRentalDetails = async (rentalDetails, guestId) => {
    const { client, toastManager } = this.props
    const { level, stance, discipline, weight, height, shoeSize } = rentalDetails
    const savedGuest = await client.mutate({
      mutation: UPDATE_GUEST_RENTAL_DETAILS,
      variables: {
        userId: guestId,
        level: discipline === 'skiing' ? level : null,
        stance: discipline === 'snowboard' ? stance : null,
        discipline,
        weight,
        height,
        shoeSize
      }
    })
    if (savedGuest) {
      toastManager.add('Rental details updated successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      const newState = { capturingGuestRentalDetails: false }
      if (!this.state.capturingGuestPhoto) {
        this.setNextStepAndIndex()
      }
      this.setState(newState)
    }
  }

  handleAssignItemButtonClick = (step, index) => {
    this.setState({
      currentStep: step,
      currentIndex: index
    })
  }

  handleGuestSelected = (guest, setOnDidMount, index) => {
    let { currentIndex } = this.state
    if (setOnDidMount) {
      currentIndex = index
    }
    const { productSelected } = this.props
    const currentIndexCopy = Object.assign({}, this.state[currentIndex])

    currentIndexCopy.guest = guest
    if (productSelected.ageVariants && productSelected.ageVariants.length && !guest.dateOfBirth) {
      const newState = {
        capturingGuestDateOfBirth: true,
        [currentIndex]: currentIndexCopy
      }
      if (productSelected.needPicture) {
        newState.capturingGuestPhoto = true
      }
      if (productSelected.productType === 'covidRental') {
        newState.capturingGuestRentalDetails = true
      }
      this.setState(newState)
    } else if (productSelected.needPicture) {
      const newState = {
        capturingGuestPhoto: true,
        [currentIndex]: currentIndexCopy
      }
      if (productSelected.productType === 'covidRental') {
        newState.capturingGuestRentalDetails = true
      }
      this.setState(newState)
    } else if (productSelected.productType === 'covidRental') {
      this.setState({
        capturingGuestRentalDetails: true,
        [currentIndex]: currentIndexCopy
      })
    } else {
      if (setOnDidMount) {
        this.setState({
          [currentIndex]: currentIndexCopy
        })
      } else {
        this.setState({
          [currentIndex]: currentIndexCopy
        })
      }
      this.setNextStepAndIndex()
    }
  }

  handleCaptureGuestPhoto = () => {
    this.setState({ capturingGuestPhoto: true })
  }

  handleCaptureGuestPhotoComplete = data => {
    this.setState({ capturingGuestPhoto: false, capturedGuestPhotoData: data })
  }

  setNextStepAndIndex = () => {
    const { currentStep, currentIndex, steps } = this.state
    const currentStepIndex = steps.indexOf(currentStep)
    if (currentStepIndex === -1 && currentStep === 'createGuest') {
      this.setState({ currentStep: steps[1], currentIndex })
    }
    if (currentStepIndex !== -1) {
      const nextStepIndex = currentStepIndex + 1
      if (steps[nextStepIndex]) {
        this.setState({ currentStep: steps[nextStepIndex], currentIndex })
      } else {
        this.setState({ currentStep: null, currentIndex: null })
      }
    }
  }

  handleCaptureGuestPhotoCompleteSelect = data => {
    const guest = this.state[this.state.currentIndex].guest
    if (guest) {
      const guestId = guest.id || guest.objectID
      if (guestId) {
        const newState = { capturingGuestPhoto: false }
        this.setNextStepAndIndex()
        this.setState(newState, () => {
          if (data) {
            this.uploadFile(data, guestId)
          }
        })
      }
    }
  }

  handleSkipGuestPhotoCompleteSelect = () => {
    this.setNextStepAndIndex()
    this.setState({ capturingGuestPhoto: false })
  }

  handleCaptureGuestRentalDetailsUpdate = rentalDetails => {
    const guest = this.state[this.state.currentIndex].guest
    if (guest) {
      const guestId = guest.id || guest.objectID

      if (rentalDetails && guestId) {
        this.updateRentalDetails(rentalDetails, guestId)
      }
    }
  }

  handleCloseRentalDetailsModal = () => {
    this.setState({ capturingGuestDateOfBirth: false, capturingGuestPhoto: false, capturingGuestRentalDetails: false })
  }

  handleCloseDOBModal = () => {
    this.setState({ capturingGuestDateOfBirth: false, capturingGuestPhoto: false, capturingGuestRentalDetails: false })
  }

  handleCaptureGuestDateOfBirthSelect = dateOfBirth => {
    const guest = this.state[this.state.currentIndex].guest

    if (guest) {
      const guestId = guest.id || guest.objectID
      const newState = { capturingGuestDateOfBirth: false }
      if (!this.state.capturingGuestPhoto) {
        newState.currentStep = null
        newState.currentIndex = null
      }
      this.setState(newState, () => {
        if (dateOfBirth) {
          this.updateDOB(dateOfBirth, guestId)
        }
      })
    }
  }

  handleEventsSelected = events => {
    const currentIndexCopy = Object.assign({}, this.state[this.state.currentIndex])
    currentIndexCopy.eventLineItems = Object.keys(events).map(key => {
      const event = events[key]
      event.productItemId = key
      return event
    })
    this.setState({
      [this.state.currentIndex]: currentIndexCopy
    })
    this.setNextStepAndIndex()
  }

  handleContinueClick = () => {
    const { onProductAdded, productSelected, quantitySelected } = this.props
    const { addUpsellItems, upsellItems } = this.state
    const upsellItemsOptions = productSelected.upsellProducts
    if (upsellItemsOptions && upsellItemsOptions.length && !addUpsellItems) {
      this.setState({ addUpsellItems: true })
    } else {
      const orderLineItems = []
      if (productSelected.ageVariants && productSelected.ageVariants.length > 1) {
        let orderLineItem = {
          quantity: 1,
          productId: productSelected.id,
          guestLineItems: [],
          forDate: this.state[0].accessDate ? saveDateFormat(this.state[0].accessDate) : null,
          upsellOrderLineItems: upsellItems || null,
          eventLineItems: []
        }
        for (let i = 0; i < productSelected.ageVariants.length; i++) {
          if (this.state[i].eventLineItems) {
            orderLineItem.eventLineItems.push(this.state[i].eventLineItems[0])
          }
          orderLineItem.guestLineItems.push({
            ageVariantId: productSelected.ageVariants[i].id,
            guestId: this.state[i].guest.objectID || this.state[i].guest.id,
            answers: this.state[i].answers || null
          })
        }
        orderLineItems.push(orderLineItem)
      } else {
        for (let i = 0; i < quantitySelected; i++) {
          orderLineItems.push({
            quantity: 1,
            productId: productSelected.id,
            guestLineItems: [{ guestId: this.state[i].guest.objectID || this.state[i].guest.id }],
            eventLineItems: this.state[i].eventLineItems,
            forDate: this.state[i].accessDate ? saveDateFormat(this.state[i].accessDate) : null,
            answers: this.state[i].answers || null,
            upsellOrderLineItems: upsellItems || null
          })
        }
      }
      onProductAdded(orderLineItems)
    }
  }

  handleGuestCreated = guest => {
    const { productSelected } = this.props
    const currentIndexCopy = Object.assign({}, this.state[this.state.currentIndex])
    currentIndexCopy.guest = guest
    this.setState({
      [this.state.currentIndex]: currentIndexCopy,
      capturingGuestPhoto: productSelected.needPicture
    })
    if (!productSelected.needPicture) {
      this.setNextStepAndIndex()
    }
  }

  handleEventCreated = event => {
    this.setState({ currentStep: 'addEvents', createdEvent: event })
  }

  handleAssignAccessDate = accessDate => {
    const currentIndexCopy = Object.assign({}, this.state[this.state.currentIndex])
    currentIndexCopy.accessDate = accessDate
    this.setState({
      [this.state.currentIndex]: currentIndexCopy
    })
    this.setNextStepAndIndex()
  }

  handleGuestCreatingCancelButton = () => {
    this.setState({ currentStep: 'addGuests' })
  }

  handleCancelCapturingGuestPhoto = () => {
    this.setState({ capturingGuestPhoto: false })
  }

  handleEventCreatingCancelButton = () => {
    this.setState({ currentStep: 'addEvents' })
  }

  handleAddAnswersCancelButton = () => {
    this.setState({ currentStep: null, currentIndex: null })
  }

  handleAddAnswers = values => {
    const { currentIndex } = this.state
    const { productSelected } = this.props

    const guest = this.state[currentIndex].guest
    if (guest && (guest.objectID || guest.id)) {
      const questions = productSelected.questions
      const answers = []

      Object.keys(values).forEach(key => {
        questions.forEach(question => {
          if (key === question.id) {
            answers.push({
              userId: guest.objectID || guest.id,
              questionId: question.id,
              questionnaireId: productSelected.questionnaireId,
              answerJsonb: { data: JSON.stringify(JSON.stringify(values[key])) }
            })
          }
        })
      })

      const currentIndexCopy = Object.assign({}, this.state[this.state.currentIndex])
      currentIndexCopy.answers = answers

      this.setState({
        [this.state.currentIndex]: currentIndexCopy
      })
      this.setNextStepAndIndex()
    }
  }

  renderState() {
    const {
      currentStep,
      currentIndex,
      createdEvent,
      capturingGuestDateOfBirth,
      capturingGuestPhoto,
      capturedGuestPhotoData,
      capturingGuestRentalDetails
    } = this.state
    const { productSelected, orderId, account, client, quantitySelected } = this.props
    // Guests
    if (currentStep === 'addGuests') {
      const listSectionCustomStyles = {
        maxHeight: 'calc(90vh - 225px - 5em)',
        overflowY: 'scroll'
      }
      return (
        <>
          <SelectGuest
            fullHeight
            client={client}
            onSelect={this.handleGuestSelected}
            ageVariant={
              productSelected.ageVariants && productSelected.ageVariants.length
                ? quantitySelected > 1
                  ? productSelected.ageVariants[0]
                  : productSelected.ageVariants[currentIndex]
                : null
            }
            account={account}
            listSectionCustomStyles={listSectionCustomStyles}
          />
          {capturingGuestPhoto && (
            <CaptureGuestPhoto
              fullHeight
              orderId={orderId}
              guestId={this.state[currentIndex].guest.objectID}
              previousProfilePictureUrl={this.state[currentIndex].guest.profilePictureUrl}
              onCompleteClick={this.handleCaptureGuestPhotoCompleteSelect}
              cancelButtonTitle="Skip"
              onCancelClick={this.handleSkipGuestPhotoCompleteSelect}
            />
          )}
          {capturingGuestRentalDetails && (
            <CaptureGuestRentalDetails
              fullHeight
              selectedGuest={this.state[currentIndex].guest}
              account={account}
              onCancelClick={this.handleCloseRentalDetailsModal}
              onCompleteClick={this.handleCaptureGuestRentalDetailsUpdate}
            />
          )}
          {capturingGuestDateOfBirth && (
            <CaptureGuestDOB
              fullHeight
              account={account}
              ageVariant={
                productSelected.ageVariants && productSelected.ageVariants.length
                  ? quantitySelected > 1
                    ? productSelected.ageVariants[0]
                    : productSelected.ageVariants[currentIndex]
                  : null
              }
              onCompleteClick={this.handleCaptureGuestDateOfBirthSelect}
              onCancelClick={this.handleCloseDOBModal}
            />
          )}
        </>
      )
    }
    if (currentStep === 'createGuest') {
      const listSectionCustomStyles = {
        maxHeight: 'calc(90vh - 225px - 5em)',
        overflowY: 'scroll'
      }

      return (
        <>
          <CreateGuest
            fullHeight
            checkExistingUsers
            onGuestCreated={this.handleGuestCreated}
            onCancelBtnClick={this.handleGuestCreatingCancelButton}
            onCaptureGuestPhoto={this.handleCaptureGuestPhoto}
            onUpdateDOB={this.updateDOB}
            updateRentalDetails={this.updateRentalDetails}
            capturedGuestPhotoData={capturedGuestPhotoData}
            showRentalForm={productSelected.productType === 'covidRental'}
            needPicture={productSelected.needPicture}
            account={account}
            listSectionCustomStyles={listSectionCustomStyles}
            isAddProduct
            ageVariant={
              productSelected.ageVariants && productSelected.ageVariants.length
                ? quantitySelected > 1
                  ? productSelected.ageVariants[0]
                  : productSelected.ageVariants[currentIndex]
                : null
            }
          />
          {capturingGuestPhoto && (
            <CaptureGuestPhoto
              fullHeight
              previousProfilePictureUrl={this.state[currentIndex].guest.profilePictureUrl}
              onCompleteClick={this.handleCaptureGuestPhotoCompleteSelect}
              cancelButtonTitle="Skip"
              guestId={this.state[currentIndex].guest.objectID}
              onCancelClick={this.handleSkipGuestPhotoCompleteSelect}
            />
          )}
        </>
      )
    }

    // Events
    if (currentStep === 'addEvents') {
      return (
        <EventWizard
          createdEvent={createdEvent}
          onSelect={this.handleEventsSelected}
          eventRules={productSelected.eventRules}
          productItemEvents={productSelected.productItems.filter(productItemEvent => productItemEvent.required)}
        />
      )
    }
    if (currentStep === 'createEvent') {
      // rebuild form and handlers
      return (
        <CreateEvent
          onEventCreated={this.handleEventCreated}
          onCancelBtnClick={this.handleEventCreatingCancelButton}
          productItemEvents={productSelected.productItems.filter(productItemEvent => productItemEvent.required)}
        />
      )
    }

    // Access Date
    if (currentStep === 'addAccessDate') {
      return <SelectAccessDate onAssignClick={this.handleAssignAccessDate} />
    }

    // Answers
    if (currentStep === 'addAnswers') {
      const currentProd = this.state[currentIndex]
      if (currentProd && currentProd.guest && (currentProd.guest.objectID || currentProd.guest.id)) {
        return <AddAnswers questions={productSelected.questions} onCancelBtnClick={this.handleAddAnswersCancelButton} onAnswersAdd={this.handleAddAnswers} />
      } else {
        return <p>You need to select guest first</p>
      }
    }

    return <ProductEduCard />
  }

  getSecondaryBtnTitle = () => {
    const { currentStep } = this.state
    switch (currentStep) {
      case 'addGuests':
        return 'Create Guest'
      case 'addEvents':
        return 'Create Event'
      default:
        return null
    }
  }

  handleGuestCreateButtonClick = () => {
    this.setState({ currentStep: 'createGuest' })
  }

  handleEventCreateButtonClick = () => {
    this.setState({ currentStep: 'createEvent' })
  }

  getSecondaryBtnHandler = () => {
    const { currentStep } = this.state
    switch (currentStep) {
      case 'addGuests':
        return this.handleGuestCreateButtonClick
      case 'addEvents':
        return this.handleEventCreateButtonClick
      default:
        return null
    }
  }

  onAddUpsellItem = (product, quantity) => {
    const { upsellItems } = this.state
    const newUpsellItems = upsellItems.filter(upsellItem => upsellItem.productId !== product.id)
    if (newUpsellItems.length < upsellItems.length) {
      this.setState({ upsellItems: newUpsellItems })
    } else {
      if (product && quantity) {
        upsellItems.push({ productId: product.id, quantity: quantity })
      } else {
        upsellItems.push(...product)
      }

      this.setState({ upsellItems })
    }
  }

  showCreateEventBtn = () => {
    const { productSelected } = this.props
    let show = false
    productSelected.productItems.forEach(event => {
      if (event.canCreate) {
        show = true
      }
    })
    return show
  }

  renderAssignProductBody = () => {
    const { productSelected, quantitySelected } = this.props
    return (
      <AssignLayout addBorder>
        <AssignLayoutLeft bgColor="greyLight" rightBorder overflowY="auto">
          {productSelected.ageVariants && productSelected.ageVariants.length > 1
            ? productSelected.ageVariants.map((ageVariant, index) => (
                <AssignItemCard
                  key={index}
                  index={index}
                  ageVariant={ageVariant}
                  productInfo={this.getProductInfo(index)}
                  onAssignItemButtonClick={this.handleAssignItemButtonClick}
                />
              ))
            : Array(quantitySelected)
                .fill()
                .map((_, index) => {
                  return (
                    <AssignItemCard
                      key={index}
                      index={index}
                      productInfo={this.getProductInfo(index)}
                      onAssignItemButtonClick={this.handleAssignItemButtonClick}
                    />
                  )
                })}
        </AssignLayoutLeft>
        <AssignLayoutRight overflowY="scroll">{this.renderState()}</AssignLayoutRight>
      </AssignLayout>
    )
  }

  renderSelectUpsellItemBody = () => {
    const { productSelected } = this.props
    const { upsellItems } = this.state
    let selectedGuest

    if (this.state[0] && this.state[0].guest) {
      selectedGuest = this.state[0].guest
    }

    return (
      <AddUpsellItems
        selectedGuest={selectedGuest}
        productSelected={productSelected}
        selectedUpsellItems={upsellItems}
        onAddUpsellItem={this.onAddUpsellItem}
      />
    )
  }

  getPrimaryBtnTitle = () => {
    const { upsellItems, addUpsellItems } = this.state
    let name = addUpsellItems ? 'Skip & Add' : 'Continue'
    if (upsellItems != null && upsellItems.length > 0) {
      name = 'Add Products'
    }
    return name
  }

  render() {
    const { currentStep, addUpsellItems } = this.state
    const { productSelected, onCancelClick, loadingProductModal, account } = this.props
    const continueBtnDisabled = loadingProductModal ? null : this.getContinueButtonDisabled()
    const secondaryBtnTitle = !loadingProductModal && this.getSecondaryBtnTitle()
    const secondaryBtnHandler = !loadingProductModal && this.getSecondaryBtnHandler()
    const showSecondaryBtn = currentStep === 'addGuests' || (currentStep === `addEvents` && !loadingProductModal && this.showCreateEventBtn())
    const primaryBtnTitle = !loadingProductModal && this.getPrimaryBtnTitle()
    let upsellItemsText = ''
    if (!loadingProductModal) {
      upsellItemsText = addUpsellItems ? 'Select any additional products to add to the order.' : 'Complete the allocations for each guest'
    }
    return (
      <ProductModal
        title={loadingProductModal ? '' : productSelected.name}
        subTitle={upsellItemsText}
        primaryBtnTitle={primaryBtnTitle}
        primaryBtnDisabled={continueBtnDisabled}
        onPrimaryBtnHandler={this.handleContinueClick}
        secondaryBtnTitle={secondaryBtnTitle}
        secondaryBtnShow={showSecondaryBtn}
        onSecondaryBtnHandler={secondaryBtnHandler}
        onCancelHandler={onCancelClick}
        overflowY={!addUpsellItems ? 'hidden' : false}>
        {loadingProductModal && <SpinLoader withWrapper size="80px" color="primary" />}
        {!loadingProductModal && addUpsellItems && this.renderSelectUpsellItemBody()}
        {!loadingProductModal && !addUpsellItems && this.renderAssignProductBody()}
      </ProductModal>
    )
  }
}

export default withToastManager(withApollo(AssignItemModal))
