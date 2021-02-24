import React from 'react'

import {
  MainPanelWrapper,
  GuestTable,
  GuestDetailModal,
  CreateGuestModal,
  CaptureGuestPhoto,
  AccessRecordPrintModal,
  MergingDupedGuestsModal,
  GuestDashHeader
} from 'es-components'

import { UPDATE_GUEST_USER, GET_SALE_QUERY, GET_ACCOUNT_INFO, GET_GUESTS_BY_CARD_QUERY } from './schema'
import { auth, errorHandler } from 'es-libs'
const { ipcRenderer } = window.require('electron')

let baseQueryConfig = {
  noResultsMessage: 'There are not matching guests to show',
  indexesForLoad: [
    {
      indexName: 'staffUsers',
      options: {
        attributesToRetrieve: 'firstName,objectID,lastName,fullName,email,dateOfBirth,phone,customerNumber,profilePictureUrl,avatar',
        filters: ``
      }
    },
    {
      indexName: 'guests',
      options: {
        attributesToRetrieve: 'firstName,objectID,lastName,fullName,email,dateOfBirth,phone,customerNumber,profilePictureUrl,avatar',
        filters: ``
      }
    }
  ],
  type: 'algolia',
  cachePolicy: 'no-cache'
}

const originalSearchableAttributes = ['firstName', 'lastName', 'customerNumber', 'email']

export const GuestsPage = ({ client, account, toastManager }) => {
  const [guestSelected, setGuestSelected] = React.useState(null)
  const [accountSelected, setAccount] = React.useState(account)
  const [guestSelectedForPictureUpload, setGuestSelectedForPictureUpload] = React.useState(null)
  const [guestPictureModalOpen, setGuestPictureModalOpen] = React.useState(false)
  const [isClearSearch, setClearSearch] = React.useState(false)
  const [showPrintModal, setShowPrintModal] = React.useState(false)
  const [useLinkedSale, setLinkedSale] = React.useState(null)
  const [initPrinting, setInitPrinting] = React.useState(false)
  const [cardScanTable, setCardScanTable] = React.useState(false)
  const [selectedAccessRecord, setSelectedAccessRecord] = React.useState(null)
  const [creatingGuest, setCreateGuest] = React.useState(false)
  const [imageButtonLoading, setImageButtonLoading] = React.useState(false)
  const [searchText, setSearchText] = React.useState('')
  const [persistedTab, setPersistedTab] = React.useState('guestDetail')
  const [previousGuestModal, setPreviousGuestModal] = React.useState(null)
  const [loggedAccount, setLoggedAccount] = React.useState(null)
  const [scanning, setScanning] = React.useState(false)
  const [useGuestsFromCard, setGuestsFromCard] = React.useState([])
  const [useFilterString, setFilterString] = React.useState(false)
  const [useGuestSelectLoading, setGuestSelectLoading] = React.useState(false)
  const [isFirstNameIncludedInSearch, setIsFirstNameIncludedInSearch] = React.useState(true)
  const [isLastNameIncludedInSearch, setIsLastNameIncludedInSearch] = React.useState(true)
  const [isCustomerNumberIncludedInSearch, setIsCustomerNumberIncludedInSearch] = React.useState(true)
  const [isEmailIncludedInSearch, setIsEmailIncludedInSearch] = React.useState(true)
  const [attributesToSearchFor, setAttributesToSearchFor] = React.useState(originalSearchableAttributes)
  console.log('🚀 ~ file: GuestsPage.js ~ line 52 ~ GuestsPage ~ cardScanTable', cardScanTable)

  // ES-352: Deduped Users
  const [mergingModalOpen, setMergingModalOpen] = React.useState(false)

  React.useEffect(() => {
    try {
      client.query({ query: GET_ACCOUNT_INFO }).then(result => {
        const { account } = result.data.pos
        if (!!result && account) {
          setLoggedAccount(account)
          setAccount(account)
        } else {
          throw new Error('There was an error with the response from the server.')
        }
      })
    } catch (error) {
      const currentError = errorHandler(error)
      toastManager.add('The retrieval of the account info failed.', { appearance: 'error', autoDismiss: false })
    }
  }, [loggedAccount])

  const handlePrintAccessRecord = (accessRecord, linkedSaleId) => {
    setSelectedAccessRecord(accessRecord)
    client.query({ query: GET_SALE_QUERY, variables: { id: linkedSaleId } }).then(result => {
      setLinkedSale(result.data.pos.sale)
      setInitPrinting(true)
      setShowPrintModal(true)
    })
  }

  const handleCreateGuest = () => {
    setCreateGuest(true)
  }

  const uploadFile = async (file, guestId) => {
    const urlData = await fetch(`${auth.getBaseUrl()}/signUrl?userId=${guestId}&uploadType=avatar`, {
      method: 'GET',
      mode: 'cors',
      headers: { Authorization: auth.getToken(), 'Content-Type': 'application/json', 'X-Key-Inflection': 'camel' }
    })
    urlData.json().then(async json => {
      const awsImage = await fetch(json.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file ? file.type : 'image/jpeg' },
        body: file
      })
      const savedImage = await client.mutate({
        mutation: UPDATE_GUEST_USER,
        variables: { userId: guestId, profilePictureUrl: awsImage.url.split('?')[0] }
      })
      if (savedImage) {
        // bugfix(ES-863): Adding a delay to wait on Algolia syncing to show new updated profile pic
        setTimeout(() => {
          setImageButtonLoading(false)
          setGuestSelectedForPictureUpload(null)
          setSearchText('')
          setSearchText(searchText)
          toastManager.add('Image uploaded successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
        }, 10000)
      }
    })
  }

  const handleSkipGuestPhotoCompleteSelect = () => {
    setGuestSelectedForPictureUpload(null)
    setGuestPictureModalOpen(false)
  }

  const handleCaptureGuestPhotoCompleteSelect = file => {
    const guestId = guestSelectedForPictureUpload.objectID || guestSelectedForPictureUpload.id
    uploadFile(file, guestId)
    setImageButtonLoading(true)
    setGuestPictureModalOpen(false)
  }

  const handleSearchChange = React.useCallback(searchText => {
    console.log('🚀 ~ file: GuestsPage.js ~ line 144 ~ GuestsPage ~ searchText', searchText)
    setGuestsFromCard([])
    setCardScanTable(false)

    if (searchText !== '') {
      setFilterString(false)
    }
    setSearchText(searchText)
  }, [])
  const handleScanCardClicked = () => {
    setCardScanTable(true)
    setScanning(true)
    ipcRenderer.send('scan-button')
    ipcRenderer.once('scan-reply', (event, arg) => {
      if (arg === 'OPEN-ERROR' || arg === 'SCAN-ERROR' || arg === 'NO-SCAN') {
        let text
        setScanning(false)
        setGuestsFromCard([])

        switch (arg) {
          case 'OPEN-ERROR':
            text = 'Error connecting to scanner'
            break
          case 'SCAN-ERROR':
            text = 'Error writing to scanner'
            break
          case 'NO-SCAN':
            text = 'Card not detected'
            break
          default:
            text = 'An error occured'
        }
        toastManager.add(text, {
          appearance: 'error',
          autoDismissTimeout: 3000,
          autoDismiss: true
        })
      } else {
        toastManager.add('Card Scanned, Searching...', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })

        client
          .query({
            query: GET_GUESTS_BY_CARD_QUERY,
            variables: {
              cardRfid: arg
            }
          })
          .then(res => {
            setScanning(false)

            if (res.data.pos.allGuests.length) {
              setGuestsFromCard(res.data.pos.allGuests)
            } else {
              toastManager.add('No Guests found for this card', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
            }
          })
      }
    })
  }

  const handleSearchParamsChange = (searchParam, isActive) => {
    const paramsMap = {
      FirstName: 'firstName',
      LastName: 'lastName',
      CustomerNumber: 'customerNumber',
      Email: 'email'
    }
    const methodsMap = {
      FirstName: setIsFirstNameIncludedInSearch,
      LastName: setIsLastNameIncludedInSearch,
      CustomerNumber: setIsCustomerNumberIncludedInSearch,
      Email: setIsEmailIncludedInSearch
    }
    let modifiedAlgoliaAttributes

    if (!isActive) {
      modifiedAlgoliaAttributes = attributesToSearchFor.filter(attr => attr !== paramsMap[searchParam])
    } else {
      modifiedAlgoliaAttributes = attributesToSearchFor
      modifiedAlgoliaAttributes.push(paramsMap[searchParam])
    }

    setAttributesToSearchFor(modifiedAlgoliaAttributes)
    methodsMap[searchParam](isActive)
  }

  const saveGuestModalSelectedTab = (guestId, tab) => {
    setPersistedTab(tab)
    setPreviousGuestModal(guestId)
  }

  // ES-352: Deduped Users
  const openMergingModal = () => setMergingModalOpen(true)
  const closeMergingModal = () => setMergingModalOpen(false)

  return (
    <MainPanelWrapper centeredLayout disableHeader>
      <>
        <GuestDashHeader
          isCustomerNumberIncludedInSearch={isCustomerNumberIncludedInSearch}
          isFirstNameIncludedInSearch={isFirstNameIncludedInSearch}
          handleSearchParamsChange={handleSearchParamsChange}
          isLastNameIncludedInSearch={isLastNameIncludedInSearch}
          isEmailIncludedInSearch={isEmailIncludedInSearch}
          handleSearchChange={handleSearchChange}
          handleCreateGuest={handleCreateGuest}
          handleScanCardClicked={handleScanCardClicked}
          openMergingModal={openMergingModal}
          accountSelected={accountSelected}
          setFilterString={setFilterString}
          setSearchText={setSearchText}
          setClearSearch={setClearSearch}
          scanning={scanning}
          isClearSearch={isClearSearch}
        />
        <GuestTable
          useFilterString={useFilterString}
          searchText={searchText}
          setGuestSelectLoading={setGuestSelectLoading}
          scanning={scanning}
          setGuestSelected={setGuestSelected}
          cardScanTable={cardScanTable}
          baseQueryConfig={baseQueryConfig}
          attributesToSearchFor={attributesToSearchFor}
          useGuestsFromCard={useGuestsFromCard}
          imageButtonLoading={imageButtonLoading}
          guestSelectedForPictureUpload={guestSelectedForPictureUpload}
          setGuestPictureModalOpen={setGuestPictureModalOpen}
          setGuestSelectedForPictureUpload={setGuestSelectedForPictureUpload}
        />
        {guestPictureModalOpen && guestSelectedForPictureUpload && (
          <CaptureGuestPhoto
            previousProfilePictureUrl={guestSelectedForPictureUpload.profilePictureUrl}
            onCompleteClick={handleCaptureGuestPhotoCompleteSelect}
            cancelButtonTitle="Cancel"
            guestId={guestSelectedForPictureUpload && guestSelectedForPictureUpload.objectID}
            onCancelClick={handleSkipGuestPhotoCompleteSelect}
          />
        )}
        {creatingGuest && <CreateGuestModal account={accountSelected} onCancelClick={() => setCreateGuest(false)} />}
        {(guestSelected || useGuestSelectLoading) && !showPrintModal && (
          <GuestDetailModal
            client={client}
            useGuestSelectLoading={useGuestSelectLoading}
            toastManager={toastManager}
            accessRecords={
              guestSelected && guestSelected.accessRecords.length
                ? guestSelected.accessRecords.map(accessRecord => ({
                    id: accessRecord.id,
                    saleId: accessRecord.saleId,
                    forDate: accessRecord.forDate,
                    productJson: accessRecord.productJson,
                    productName: accessRecord.productInfo && accessRecord.productInfo.productName,
                    guest: {
                      firstName: guestSelected.firstName,
                      lastName: guestSelected.lastName,
                      fullName: guestSelected.fullName,
                      profilePictureUrl: guestSelected.profilePictureUrl,
                      email: guestSelected.email
                    }
                  }))
                : []
            }
            guest={guestSelected}
            account={accountSelected}
            onPrintClick={handlePrintAccessRecord}
            loggedAccount={loggedAccount}
            selectedAccessRecord={selectedAccessRecord}
            printing={initPrinting}
            persistedTab={persistedTab}
            previousGuestModal={previousGuestModal}
            onTabChange={saveGuestModalSelectedTab}
            onCancelClick={() => setGuestSelected(null)}
          />
        )}
        {showPrintModal && (
          <AccessRecordPrintModal
            client={client}
            handleCloseModal={() => {
              setShowPrintModal(false)
            }}
            sale={{
              id: useLinkedSale.id,
              shippedAt: useLinkedSale.shippedAt,
              hasShipped: useLinkedSale.hasShipped,
              shippingAddressId: useLinkedSale.shippingAddressId,
              number: useLinkedSale.number,
              accessRecords: [selectedAccessRecord]
            }}
          />
        )}
        {mergingModalOpen && !guestSelected && !showPrintModal && <MergingDupedGuestsModal onCancelClick={closeMergingModal} />}
      </>
    </MainPanelWrapper>
  )
}
