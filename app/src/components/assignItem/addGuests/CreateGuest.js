import React from 'react'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'

// Components
import {
  StandardForm,
  TextInput,
  MaskedTextInput,
  SelectInput,
  SpinLoader,
  ListItemWrapper,
  ListItem,
  ListGrid,
  Par,
  Button,
  H3,
  CaptureGuestDOB,
  CaptureGuestRentalDetails
} from 'es-components'

//Validations
import {
  validateRequired,
  validateAll,
  validateEmail,
  validateSamePassword,
  validatePositiveNumber,
  validateAgeVar,
  validateDOB,
  getAge,
  parseDate,
  saveDateFormat,
  displayDateFormat,
  algoliaMultiRequestForIndex,
  filterDateFormat,
  getDateFormat,
  disciplineOptions,
  levelOptions,
  stanceOptions,
  feetInchesToCm,
  lbsToKg,
  kgToLbs,
  getFloat,
  cmToFeetInches
} from 'es-libs'

import styled from 'styled-components'

const CREATE_GUEST_USER = gql`
  mutation CreateGuest(
    $email: String
    $password: String
    $passwordConfirmation: String
    $firstName: String!
    $lastName: String!
    $phone: String
    $dateOfBirth: String
    $sex: String
    $level: String
    $stance: String
    $discipline: String
    $weight: Float
    $height: Float
    $shoeSize: Float
  ) {
    pos {
      createGuest(
        email: $email
        password: $password
        passwordConfirmation: $passwordConfirmation
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        dateOfBirth: $dateOfBirth
        sex: $sex
        level: $level
        stance: $stance
        discipline: $discipline
        weight: $weight
        height: $height
        shoeSize: $shoeSize
      ) {
        id
        objectID
        created
        email
        phone
        sex
        dateOfBirth
        lastName
        fullName
        firstName
        level
        stance
        discipline
        weight
        height
        shoeSize
      }
    }
  }
`

const ButtonsBlock = styled.div`
  margin-top: 10px;
  width: 100%;
  padding: '0 1em';
  display: flex;
  justify-content: 'flex-end';
  align-items: 'flex-end';
`

export class CreateGuest extends React.Component {
  constructor(props) {
    super(props)
    this.imageRef = React.createRef()
    this.state = {
      errorMsg: '',
      existingUsers: null,
      usersChecking: false,
      createGuest: undefined,
      formValues: undefined,
      capturingGuestDateOfBirth: false,
      selectedGuest: null,
      capturingRentalDetails: this.props.showRentalForm
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.capturedGuestPhotoData && this.props.capturedGuestPhotoData !== prevProps.capturedGuestPhotoData) {
      let fr = new FileReader()
      fr.onload = () => {
        this.imageRef.current.src = fr.result
      }
      fr.readAsDataURL(this.props.capturedGuestPhotoData)
    }
  }

  checkUserExisting = (values, createGuest) => {
    const { firstName, lastName, dateOfBirth, email, phone, sex } = values
    const { checkExistingUsers } = this.props
    const attributesToRetrieve = 'firstName,objectID,lastName,fullName,email,dateOfBirth,phone,customerNumber,profilePictureUrl,avatar'
    const queries = []

    if (email != null && email !== '') {
      queries.push(
        {
          indexName: 'guests',
          params: {
            filters: `email:${email}`,
            hitsPerPage: 100,
            attributesToRetrieve
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            filters: `email:${email}`,
            hitsPerPage: 100,
            attributesToRetrieve
          }
        }
      )
    }

    if (phone != null && phone !== '') {
      queries.push(
        {
          indexName: 'guests',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            query: phone
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            query: phone,
            hitsPerPage: 100,
            attributesToRetrieve
          }
        }
      )
    }

    if (dateOfBirth != null && dateOfBirth !== '') {
      queries.push(
        {
          indexName: 'guests',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            filters: `dateOfBirth:${filterDateFormat(dateOfBirth)}`
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            filters: `dateOfBirth:${filterDateFormat(dateOfBirth)}`
          }
        }
      )
    }

    if (lastName != null && lastName !== '') {
      queries.push(
        {
          indexName: 'guests',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            query: lastName
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            query: lastName
          }
        }
      )
    }

    if (firstName != null && firstName !== '') {
      queries.push(
        {
          indexName: 'guests',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            query: firstName
          }
        },
        {
          indexName: 'staffUsers',
          params: {
            hitsPerPage: 100,
            attributesToRetrieve,
            query: firstName
          }
        }
      )
    }

    let level,
      stance,
      discipline,
      weight,
      height,
      shoeSize = null
    if (this.props.showRentalForm && this.props.account) {
      const { measurement } = this.props.account

      discipline = values.discipline ? values.discipline.value : null
      level = discipline && values.level && discipline === 'skiing' ? values.level.value : null
      stance = discipline && values.stance && discipline === 'snowboard' ? values.stance.value : null

      if (measurement === 'metric') {
        weight = getFloat(values.weightKg)
        height = getFloat(values.heightCm)
        shoeSize = getFloat(+values.shoeSizeMetric)
      } else if (measurement === 'imperial') {
        weight = lbsToKg(values.weightLbs)
        height = feetInchesToCm(values.heightFt, values.heightInches)
        shoeSize = getFloat(+values.shoeSizeImperial)
      }
    }

    this.setState({
      usersChecking: true,
      createGuest,
      formValues: { firstName, lastName, dateOfBirth, email, phone, sex, level, stance, discipline, weight, height, shoeSize }
    })

    algoliaMultiRequestForIndex(queries, (err, existingUsers) => {
      if (!existingUsers.length || !checkExistingUsers) {
        this.setState({ existingUsers: null, usersChecking: false })
        this.handleGuestCreation()
      } else {
        this.setState({ existingUsers, usersChecking: false })
      }
    })
  }

  isGuestDisabled = (guest, account, ageVariant, orderSteps) => {
    if (ageVariant) {
      if (
        guest.dateOfBirth &&
        validateAgeVar(
          ageVariant,
          account.ageCalculationMethod,
          account.endOfWinterSeasonMonth,
          account.ageCalculationDate
        )(displayDateFormat(guest.dateOfBirth))
      ) {
        return true
      }
    } else if (orderSteps && orderSteps.length && orderSteps.findIndex(step => step === 'signWaivers') !== -1) {
      if (getAge(parseDate(guest.dateOfBirth)) >= parseInt(account.ageOfMajority, 10)) {
        return false
      } else {
        return true
      }
    }
    return false
  }

  handleGuestCreation = () => {
    const { onGuestCreated } = this.props
    const { formValues, createGuest } = this.state

    if (formValues.sex) {
      formValues.sex = formValues.sex.value
    }
    formValues.dateOfBirth = saveDateFormat(formValues.dateOfBirth)

    createGuest({ variables: { ...formValues } })
      .then(async ({ data }) => {
        this.setState({
          errorMsg: ''
        })
        const guest = data.pos.createGuest

        if (onGuestCreated) {
          onGuestCreated(guest)
        }
      })
      .catch(error => {
        const newError = error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : ''
        this.setState({
          errorMsg: newError
        })
      })
  }

  handleOnSubmit = (values, createGuest) => {
    this.checkUserExisting(values, createGuest)
  }

  onCancelClick = () => {
    const { onCancelBtnClick } = this.props
    if (onCancelBtnClick) {
      onCancelBtnClick()
    }
  }

  handleBackButton = () => {
    this.setState({ existingUsers: null })
  }

  onSelectGuestFromList = user => {
    if (user.dateOfBirth === null) {
      this.setState({ capturingGuestDateOfBirth: true, selectedGuest: user })
    } else {
      if (!this.state.capturingRentalDetails) {
        this.props.onGuestCreated(user)
      } else {
        this.setState({ selectedGuest: user })
      }
    }
  }

  handleCloseDOBModal = () => {
    this.setState({ capturingGuestDateOfBirth: false })
  }

  handleCaptureGuestDateOfBirthSelect = dateOfBirth => {
    const { onUpdateDOB, onGuestCreated } = this.props
    if (onUpdateDOB) {
      onUpdateDOB(dateOfBirth, this.state.selectedGuest.objectID)
      this.setState({ capturingGuestDateOfBirth: false })
      if (!this.state.capturingRentalDetails && onGuestCreated) {
        onGuestCreated(this.state.selectedGuest)
      }
    }
  }

  handleCloseRentalDetailsModal = () => {
    this.setState({ selectedGuest: null })
  }

  handleCaptureGuestRentalDetailsUpdate = rentalDetails => {
    this.props.updateRentalDetails(rentalDetails, this.state.selectedGuest.objectID)
    this.setState({ capturingRentalDetails: false })
    if (!this.state.capturingGuestDateOfBirth) {
      this.props.onGuestCreated(this.state.selectedGuest)
    }
  }

  renderGuestsList() {
    const { existingUsers, capturingGuestDateOfBirth, selectedGuest, capturingRentalDetails } = this.state
    const { account, ageVariant, orderSteps, listSectionCustomStyles, fullHeight } = this.props

    return (
      <>
        <div>
          <ListGrid
            listSectionCustomStyles={listSectionCustomStyles}
            hideSearch
            fullHeight={fullHeight}
            listTitle="Maybe you want to select existing user from list"
            listHeaders={[
              { title: 'Name', align: 'left' },
              { title: 'Email', align: 'left' },
              { title: 'Date Of Birth', align: 'left' },
              { title: 'Customer Number', align: 'left' },
              { title: 'Add', align: 'center' }
            ]}
            listColWidths="2fr 2fr 1fr 1fr 80px">
            {existingUsers.map((user, index) => (
              <ListItemWrapper
                id={`guestItem_${index}`}
                style={{ cursor: 'pointer' }}
                key={user.objectID}
                difRowColor
                onClick={() => (!this.isGuestDisabled(user, account, ageVariant, orderSteps) ? this.onSelectGuestFromList(user) : null)}>
                <ListItem>
                  <Par size="1rem" color="greyDark">
                    {user.firstName} {user.lastName}
                  </Par>
                </ListItem>
                <ListItem>
                  <Par size="1rem" color="greyDark">
                    {user.email}
                  </Par>
                </ListItem>
                <ListItem>
                  <Par size="1rem" color="greyDark">
                    {user.dateOfBirth != null ? displayDateFormat(user.dateOfBirth) : ''}
                  </Par>
                </ListItem>
                <ListItem>
                  <Par size="1rem" color="greyDark">
                    {user.customerNumber}
                  </Par>
                </ListItem>
                <ListItem align="center">
                  {this.isGuestDisabled(user, account, ageVariant, orderSteps) ? (
                    <Button kind="redOutline" sizeH="short" customWidth="auto" icon="MdClear" iconSize="1em" rounded onClickHandler={() => null} />
                  ) : (
                    <Button id={`addGuestItem_${index}`} kind="greenOutline" sizeH="short" customWidth="auto" icon="IoMdPersonAdd" iconSize="1em" rounded />
                  )}
                </ListItem>
              </ListItemWrapper>
            ))}
          </ListGrid>
          <ButtonsBlock>
            <Button title="Back To Form" kind="greyOutline" onClickHandler={this.handleBackButton} />
            <Button title="Create Guest" margin="0 0 0 10px" kind="primary" onClickHandler={this.handleGuestCreation} />
          </ButtonsBlock>
        </div>
        {capturingGuestDateOfBirth && (
          <CaptureGuestDOB
            fullHeight
            account={account}
            ageVariant={ageVariant}
            onCompleteClick={this.handleCaptureGuestDateOfBirthSelect}
            onCancelClick={this.handleCloseDOBModal}
          />
        )}
        {capturingRentalDetails && selectedGuest && (
          <CaptureGuestRentalDetails
            fullHeight
            selectedGuest={selectedGuest}
            account={account}
            onCancelClick={this.handleCloseRentalDetailsModal}
            onCompleteClick={this.handleCaptureGuestRentalDetailsUpdate}
          />
        )}
      </>
    )
  }

  renderRentalDetails = () => {
    const { measurement } = this.props.account
    const discipline = this.state.selectedDiscipline

    return (
      <>
        <H3 padding={'10px'}>Rental Information</H3>
        <div />
        <SelectInput
          kind="assignGuest"
          field="discipline"
          placeholder="Select a discipline"
          onChange={val => this.setState({ selectedDiscipline: val.value })}
          options={disciplineOptions}
          validate={validateRequired}
        />
        {discipline && discipline === 'skiing' ? (
          <SelectInput kind="assignGuest" field="level" placeholder="Select a type" options={levelOptions} validate={validateRequired} />
        ) : null}
        {discipline && discipline === 'snowboard' ? (
          <SelectInput kind="assignGuest" field="stance" placeholder="Select a stance" options={stanceOptions} validate={validateRequired} />
        ) : null}
        {measurement === 'metric' && (
          <>
            <TextInput
              id="weightKg"
              type="number"
              field="weightKg"
              label="Weight (Kg)"
              icon="FaBalanceScale"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
            <TextInput
              id="heightCm"
              type="number"
              field="heightCm"
              label="Height (Cm)"
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
            <TextInput
              id="shoeSizeMetric"
              type="number"
              step="0.1"
              field="shoeSizeMetric"
              label="Shoe Size"
              icon="FaArrowsAltH"
              validate={validateRequired}
              validateOnBlur
            />
          </>
        )}
        {measurement === 'imperial' && (
          <>
            <TextInput
              id="weightLbs"
              type="number"
              field="weightLbs"
              label="Weight (Lbs)"
              icon="FaBalanceScale"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
            <TextInput
              id="heightFt"
              type="number"
              field="heightFt"
              label="Height (Feet)"
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
            <TextInput
              id="heightInches"
              type="number"
              field="heightInches"
              label="Height (Inches)"
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
            <TextInput
              id="shoeSizeImperial"
              type="number"
              step="0.1"
              field="shoeSizeImperial"
              label="Shoe Size"
              icon="FaArrowsAltH"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
            />
          </>
        )}
      </>
    )
  }

  renderForm() {
    const {
      capturedGuestPhotoData,
      onCancelBtnClick,
      ageVariant,
      account,
      showRentalForm,
      isAddProduct = false,
      addPurchaser = false,
      useAgeOfMajority = false
    } = this.props
    const { errorMsg, formValues } = this.state

    if (showRentalForm && formValues && account) {
      const { measurement } = account

      formValues['level'] = formValues && formValues.level ? levelOptions.find(opt => opt.value === formValues.level) : null
      formValues['stance'] = formValues && formValues.stance ? stanceOptions.find(opt => opt.value === formValues.stance) : null
      formValues['discipline'] = formValues && formValues.discipline ? disciplineOptions.find(opt => opt.value === formValues.discipline) : null
      if (measurement === 'metric') {
        formValues['weightKg'] = formValues ? formValues.weight : null
        formValues['heightCm'] = formValues ? formValues.height : null
        formValues['shoeSizeMetric'] = formValues ? formValues.shoeSize : null
      } else if (measurement === 'imperial') {
        formValues['weightLbs'] = formValues ? kgToLbs(+formValues.weight) : null
        formValues['heightFt'] = formValues ? cmToFeetInches(+formValues.height)[0] : null
        formValues['heightInches'] = formValues ? cmToFeetInches(+formValues.height)[1] : null
        formValues['shoeSizeImperial'] = formValues ? parseInt(formValues.shoeSize).toFixed() : null
      }
    }

    const genderDataOptions = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
    const needPictureExtra = {}
    return (
      <Mutation mutation={CREATE_GUEST_USER}>
        {(createGuest, { loading }) => {
          return (
            <StandardForm
              height="100%"
              tint="true"
              formcols={2}
              error={errorMsg}
              initialValues={formValues}
              loading={loading}
              onCancelClick={onCancelBtnClick ? this.onCancelClick : null}
              onSubmitHandler={values => this.handleOnSubmit(values, createGuest)}
              {...needPictureExtra}>
              <TextInput id="firstName" field="firstName" label="First Name" autoComplete="off" validate={validateRequired} validateOnChange />
              <TextInput id="lastName" field="lastName" label="Last Name" autoComplete="off" validate={validateRequired} validateOnChange />
              <TextInput id="email" field="email" label="Email" autoComplete="off" validate={validateEmail} validateOnChange />
              <TextInput id="phone" field="phone" label="Phone Number" autoComplete="off" />
              <MaskedTextInput
                id="dateOfBirth"
                field="dateOfBirth"
                label={`Date of Birth (${getDateFormat()})`}
                validate={
                  ageVariant
                    ? validateAll([
                        validateRequired,
                        validateAgeVar(ageVariant, account.ageCalculationMethod, account.endOfWinterSeasonMonth, account.ageCalculationDate)
                      ])
                    : useAgeOfMajority
                    ? validateAll([validateRequired, validateAgeVar({}, null, null, null, account.ageOfMajority)])
                    : validateAll([validateRequired, validateDOB])
                }
                validateOnChange
              />
              <SelectInput placeholder="Select gender" id="sex" field="sex" options={genderDataOptions} borderRadius="0" />
              {showRentalForm && this.renderRentalDetails()}

              {!(isAddProduct || addPurchaser) && (
                <>
                  <TextInput
                    id="password"
                    field="password"
                    type="password"
                    label="Password"
                    autoComplete="off"
                    validate={validateAll([validateRequired, validateSamePassword])}
                  />
                  <TextInput
                    id="passwordConfirmation"
                    field="passwordConfirmation"
                    label="Password Confirmation"
                    autoComplete="off"
                    type="password"
                    validate={validateAll([validateRequired, validateSamePassword])}
                  />
                </>
              )}
              {!addPurchaser && isAddProduct && capturedGuestPhotoData !== null && <img ref={this.imageRef} alt="Profile" width="100%" height="350px" src="" />}
            </StandardForm>
          )
        }}
      </Mutation>
    )
  }

  render() {
    const { existingUsers, usersChecking } = this.state
    const { checkExistingUsers } = this.props
    if (usersChecking) {
      return <SpinLoader withWrapper size="80px" color="primary" />
    }

    return existingUsers && checkExistingUsers ? this.renderGuestsList() : this.renderForm()
  }
}
