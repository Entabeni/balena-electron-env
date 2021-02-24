import React, { useState } from 'react'
import { withApollo } from 'react-apollo'
import styled from 'styled-components'

import { UPDATE_GUEST_USER, DEDUPLICATE_GUESTS } from '../../pages/dashboard/schema'
import { validateDOB, getDateFormat, validateEmail, displayDateFormat, saveDateFormat } from 'es-libs'

import { ProductModal, SpinLoader } from 'es-components'
import {
  DupedGuestsLandingStep,
  DupedGuestsSearchForm,
  DupedGuestsSearchResults,
  DupedGuestsRefinement,
  DupedGuestsFinalReview,
  DupedMergingResults
} from './mergeDupedGuests'

const MainWrapper = styled.div`
  max-height: 38rem;
  min-height: 38rem;

  table + .buttons-wrapper {
    margin-top: 1.5rem;
  }

  td b {
    border-bottom: 2px solid #000;
    padding-bottom: 3px;
  }

  .avatar-cell {
    text-align: center;

    * {
      display: inline-block;
      margin: 0 auto;
      position: relative;
    }

    .customer-number {
      color: ${props => props.theme.greyShade};
      font-size: 0.75rem;
      margin-top: 0.35rem;
    }
  }

  .data-entry-checkbox {
    &.no-label {
      height: 28px;
      margin: 0 auto;
      width: 28px;
    }
  }

  .buttons-wrapper {
    align-items: center;
    background-color: transparent;
    display: flex;
    flex-wrap: nowrap;
    grid-column: 1 / span 2;
    justify-content: space-around;

    button {
      height: 3.625rem;
      min-height: 3.625rem;
      max-height: 3.625rem;
    }
  }

  .spinloader-wrapper {
    height: 38rem;
    position: absolute !important;
    width: 100%;

    &::before {
      background-color: rgba(255, 255, 255, 0.5);
      content: '';
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 1;
    }

    figure {
      z-index: 2;
    }
  }
`

const baseQueryConfig = {
  noResultsMessage: 'There are not matching guests to show',
  indexesForLoad: [
    {
      indexName: 'guests',
      options: {
        attributesToRetrieve: 'objectID,firstName,lastName,email,dateOfBirth,customerNumber,profilePictureUrl',
        filters: ''
      }
    }
  ],
  type: 'algolia'
}

// Default data to merge model
const dataToMergePlaceholder = {
  objectID: { linkedGuest: null, label: 'Guest ID', value: null },
  customerNumber: { linkedGuest: null, label: 'Customer number', value: null, blocked: true },
  firstName: { linkedGuest: null, label: 'First name', value: null },
  lastName: { linkedGuest: null, label: 'Last name', value: null },
  profilePictureUrl: { linkedGuest: null, label: 'Picture', value: null, blocked: true },
  email: { linkedGuest: null, label: 'Email', value: null },
  dateOfBirth: { linkedGuest: null, label: 'Date of birth', value: null }
}

const MergingDupedGuestsModal = ({ client, guest, onCancelClick }) => {
  // Local state variables
  const [includeFirstNameInSearch, setIncludeFirstNameInSearch] = useState(true)
  const [includeLastNameInSearch, setIncludeLastNameInSearch] = useState(true)
  const [includeEmailInSearch, setIncludeEmailInSearch] = useState(true)
  const [searchTerm, setSearchTerm] = useState(null)
  const [searchResultsToRefine, setSearchResultsToRefine] = useState({})
  const [guestsToMerge, setGuestsToMerge] = useState([])
  const [dataToMerge, setDataToMerge] = useState({ ...dataToMergePlaceholder })
  const [loading, setLoading] = useState(false)
  const [showSearchForm, setShowSearchForm] = useState(true)
  const [showLanding, setShowLanding] = useState(true)
  const [showSearchingResults, setShowSearchingResults] = useState(false)
  const [showMergingRefinement, setShowMergingRefinement] = useState(false)
  const [showFinalReview, setShowFinalReview] = useState(false)
  const [showMergingResults, setShowMergingResults] = useState(false)
  const [proceedToFinalReview, setProceedToFinalReview] = useState(false)
  const [comingBackFromRefinementStep, setComingBackFromRefinementStep] = useState(false)
  const [mergingResultsError, setMergingResultsError] = useState(false)
  const [searchParams, setSearchParams] = useState({
    email: true,
    firstName: true,
    lastName: true
  })

  // Closing the modal and reseting the whole state variables and show the landing step
  const handleModalClose = () => {
    setIncludeFirstNameInSearch(true)
    setIncludeLastNameInSearch(true)
    setIncludeEmailInSearch(true)
    setSearchTerm(null)
    setSearchResultsToRefine({})
    setGuestsToMerge([])
    handleDeselectAllRefinementFields()
    setLoading(false)
    setShowSearchForm(true)
    setShowLanding(true)
    setShowSearchingResults(false)
    setShowMergingRefinement(false)
    setShowFinalReview(false)
    setShowMergingResults(false)
    setComingBackFromRefinementStep(false)
    setProceedToFinalReview(false)
    onCancelClick()
  }

  // Handling the search triggering event and show the search results step
  const handleSearchChange = searchText => {
    setSearchTerm(searchText)
    setSearchResultsToRefine({})
    setGuestsToMerge([])
    setShowLanding(false)
    setShowSearchingResults(true)

    if (comingBackFromRefinementStep) {
      handleDeselectAllRefinementFields()
      setComingBackFromRefinementStep(false)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchResultsToRefine({})
    setGuestsToMerge([])
    setShowLanding(true)
    setShowSearchingResults(false)

    if (comingBackFromRefinementStep) {
      handleDeselectAllRefinementFields()
      setComingBackFromRefinementStep(false)
    }
  }

  // Handling the search params toggling events and updating the matching highlighting logic accordingly
  const handleSearchParamsChange = (searchParam, isActive) => {
    switch (searchParam) {
      case 'firstName':
        setIncludeFirstNameInSearch(isActive)
        break
      case 'lastName':
        setIncludeLastNameInSearch(isActive)
        break
      case 'email':
        setIncludeEmailInSearch(isActive)
        break
    }
    setSearchParams({ ...searchParams, [searchParam]: isActive })

    if (comingBackFromRefinementStep) {
      handleDeselectAllRefinementFields()
      setComingBackFromRefinementStep(false)
    }
  }

  // Handling the checkboxes changes in the search results step and also for populating
  // the refined search results and the array of guests customer numbers to merge
  const handleSearchResultCheckboxClick = (checkboxState, guestModel) => {
    const tmpSearchResultsToRefine = { ...searchResultsToRefine }
    const { customerNumber } = guestModel

    tmpSearchResultsToRefine[customerNumber] = checkboxState && guestModel

    const tmpGuestsToMerge = Object.entries(tmpSearchResultsToRefine).reduce((arr, [customerNumber, guestInfo]) => {
      if (guestInfo) arr.push(customerNumber)
      return arr
    }, [])

    setSearchResultsToRefine(tmpSearchResultsToRefine)
    setGuestsToMerge(tmpGuestsToMerge)

    if (comingBackFromRefinementStep) {
      handleDeselectAllRefinementFields()
      setComingBackFromRefinementStep(false)
    }
  }

  // Verifying the data to merge is complete in order to enable the 'Continue' button on the merging refinement step
  const checkDataToMerge = validationResult => {
    setProceedToFinalReview(validationResult && !Object.values(dataToMerge).find(prop => !prop.value && prop.label !== 'Picture'))
  }

  // Handling the checkboxes changes in the merging refinement step for populating the data to merge
  const handleRefinementCheckboxClick = (checkboxState, [key, value, customerNumber]) => {
    const tmpDataToMerge = { ...dataToMerge }

    tmpDataToMerge[key].linkedGuest = checkboxState ? customerNumber : null
    tmpDataToMerge[key].value = checkboxState ? value : null

    if (key === 'customerNumber') tmpDataToMerge.objectID.value = searchResultsToRefine[value].objectID

    let validationResult = null
    if (key === 'email') {
      validationResult = validateEmail(tmpDataToMerge[key].value)
    } else if (key === 'dateOfBirth') {
      validationResult = validateDOB(tmpDataToMerge[key].value)
    }

    setDataToMerge(tmpDataToMerge)
    checkDataToMerge(validationResult == null)
  }

  // Handling the extra customization for the data to merge directly from the input text fields
  const handleRefinementTextFieldChange = ({ target }) => {
    const tmpDataToMerge = { ...dataToMerge }

    let validationResult = null
    if (target.name === 'email') {
      validationResult = validateEmail(target.value)
    } else if (target.name === 'dateOfBirth') {
      validationResult = validateDOB(target.value)
    }
    if (tmpDataToMerge[target.name]) {
      tmpDataToMerge[target.name].value = target.value
      setDataToMerge(tmpDataToMerge)
    }
    checkDataToMerge(validationResult == null)
  }

  // Deselecting all of the previously selected fields on refinement step
  const handleDeselectAllRefinementFields = () => {
    const tmpDataToMerge = { ...dataToMerge }
    Object.keys(tmpDataToMerge).forEach(key => {
      tmpDataToMerge[key].linkedGuest = null
      tmpDataToMerge[key].value = null
    })
    setDataToMerge(tmpDataToMerge)
    checkDataToMerge(false)
  }

  // Handling any error on the final merging queries
  const errorHandlerOnFinalStep = err => {
    setLoading(false)
    setShowFinalReview(false)
    setShowMergingResults(true)
    setMergingResultsError(true)
  }
  // Call to the GraphQL services to merge the selected guests and update the resulting guest props
  const mergeGuests = () => {
    let actualDataToMerge = { ...dataToMerge }
    actualDataToMerge = Object.entries(actualDataToMerge).reduce((data, [key, { value }]) => {
      if (key === 'objectID') {
        data['userId'] = value
      } else if (key === 'dateOfBirth') {
        data[key] = saveDateFormat(value)
      } else if (key !== 'customerNumber') {
        data[key] = value
      }
      return data
    }, {})

    let usersToMerge = [...guestsToMerge]
    usersToMerge.splice(guestsToMerge.indexOf(dataToMerge.customerNumber.value), 1)
    usersToMerge = usersToMerge.map(userId => searchResultsToRefine[userId].objectID)

    setLoading(true)
    client
      .mutate({
        mutation: UPDATE_GUEST_USER,
        variables: actualDataToMerge
      })
      .then(res => {
        client
          .mutate({
            mutation: DEDUPLICATE_GUESTS,
            variables: { userId: dataToMerge.objectID.value, usersToMerge }
          })
          .then(res => {
            setLoading(false)
            setShowFinalReview(false)
            setShowMergingResults(true)
          })
          .catch(errorHandlerOnFinalStep)
      })
      .catch(errorHandlerOnFinalStep)
  }

  // Main search form (visible until proceeding to refinement step)
  const renderSearchForm = () => (
    <DupedGuestsSearchForm
      handleClearSearch={handleClearSearch}
      searchTerm={searchTerm}
      includeFirstNameInSearch={includeFirstNameInSearch}
      includeLastNameInSearch={includeLastNameInSearch}
      includeEmailInSearch={includeEmailInSearch}
      onChange={handleSearchChange}
      onParamsChange={handleSearchParamsChange}
    />
  )

  // Initial modal step (Just when opening the modal)
  const renderLandingStep = () => <DupedGuestsLandingStep />

  // Search results modal step (After triggering a search)
  const renderDupedGuestsSearchResults = () => (
    <DupedGuestsSearchResults
      baseQueryConfig={baseQueryConfig}
      searchTerm={searchTerm}
      searchParams={searchParams}
      searchResultsToRefine={searchResultsToRefine}
      guestsToMerge={guestsToMerge}
      onCheckboxClick={handleSearchResultCheckboxClick}
      onContinue={() => {
        setShowSearchForm(false)
        setShowSearchingResults(false)
        setShowMergingRefinement(true)
        setComingBackFromRefinementStep(false)
      }}
      onUnselect={() => {
        setSearchResultsToRefine({})
        setGuestsToMerge([])
      }}
    />
  )

  // Merging refinement modal step (For when the possible duped guests have been selected and it is time to refine the data to be merged)
  const renderRefinementGuestFlow = () => (
    <DupedGuestsRefinement
      searchResultsToRefine={searchResultsToRefine}
      guestsToMerge={guestsToMerge}
      dataToMerge={dataToMerge}
      proceedToFinalReview={proceedToFinalReview}
      onCheckboxClick={handleRefinementCheckboxClick}
      onTextFieldChange={handleRefinementTextFieldChange}
      onDeselectAll={handleDeselectAllRefinementFields}
      onGoBack={() => {
        setComingBackFromRefinementStep(true)
        setShowMergingRefinement(false)
        setShowSearchForm(true)
        setShowSearchingResults(true)
      }}
      onContinue={() => {
        setShowMergingRefinement(false)
        setShowFinalReview(true)
      }}
    />
  )

  // Final review modal step (After refining all of the desired data to be merged and prior to final confirmation)
  const renderFinalReviewStep = () => (
    <DupedGuestsFinalReview
      guestsToMerge={guestsToMerge}
      dataToMerge={dataToMerge}
      searchResultsToRefine={searchResultsToRefine}
      onGoBack={() => {
        setShowFinalReview(false)
        setShowMergingRefinement(true)
      }}
      onConfirm={mergeGuests}
    />
  )

  // Complete process results modal step (Either success or error result message)
  const renderMergingResults = () => (
    <DupedMergingResults
      onClose={handleModalClose}
      onGoBack={() => {
        setShowFinalReview(true)
        setShowMergingResults(false)
        setMergingResultsError(false)
      }}
      error={mergingResultsError}
    />
  )

  // Dynamic modal main title
  const processTitle = () => {
    let title = 'Duplicated Guests Search'
    if (showMergingRefinement) title = 'Data Merging Refinement'
    if (showFinalReview) title = 'Final Review'
    if (showMergingResults) title = 'Merging Results'
    return title
  }
  // Dynamic modal subtitle
  const processSubTitle = () => {
    let subtitle = 'Find & merge possible duplicated info'
    if (showMergingRefinement) subtitle = 'Select the desired data to merge. Can be edited if necessary'
    if (showFinalReview) subtitle = 'This process can not be undone, please verify the expected results'
    if (showMergingResults) subtitle = ''
    return subtitle
  }

  return (
    <ProductModal title={processTitle()} subTitle={processSubTitle()} onCancelHandler={handleModalClose} lightLayout closeIcon>
      <MainWrapper>
        {loading && <SpinLoader withWrapper wrapperClass="spinloader-wrapper" size="80px" color="primary" />}
        {showSearchForm && renderSearchForm()}
        {showLanding && renderLandingStep()}
        {showSearchingResults && renderDupedGuestsSearchResults()}
        {showMergingRefinement && guestsToMerge.length > 1 && renderRefinementGuestFlow()}
        {showFinalReview && renderFinalReviewStep()}
        {showMergingResults && renderMergingResults()}
      </MainWrapper>
    </ProductModal>
  )
}

export default withApollo(MergingDupedGuestsModal)
