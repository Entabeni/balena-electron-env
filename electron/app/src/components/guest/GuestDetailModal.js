import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { withToastManager } from 'react-toast-notifications'
import { withApollo } from 'react-apollo'

import { ProductModal, SpinLoader } from 'es-components'
import { displayDateFormat, algoliaSearch } from 'es-libs'
import { GuestNotes } from './GuestNotes'
import { GuestAccessRecords } from './GuestAccessRecords'
import { GuestAddressesTable } from './GuestAddressesTable'
import { GuestCheckinsTable } from './GuestCheckinsTable'
import { GuestOutstandingWaivers } from './GuestOutstandingWaivers'
import { GuestEvent } from './GuestEvent'
import { GuestDetailsForm } from './GuestDetailsForm'

const MainWrapper = styled.div`
  max-height: 38rem;
  min-height: 38rem;
  padding-bottom: 1rem;
`

const Tabs = styled.section`
  display: flex;
  justify-content: stretch;
  align-items: flex-end;
  max-height: 4.375rem;
  min-height: 4.375rem;
`

const Tab = styled.span`
  /* background-color: ${props => (props.active ? props.theme.entabeniOrange : props.theme.greyDark)}; */
  background-color: ${props => (props.active ? props.theme.red : props.theme.primary)};
  border: ${props => (props.active ? `1px solid ${props.theme.white}` : 'none')};
  border-bottom: none !important;
  border-top: none !important;
  color: ${props => props.theme.white};
  cursor: ${props => (props.active ? 'default' : 'pointer')};
  display: inline-block;
  font-size: 1.25rem;
  font-weight: 700;
  padding: ${props => (props.active ? '1.5rem 2.25rem' : '1rem 2.25rem')};
  position: relative;
  transition: all 250ms ease 0s;
  width: auto;

  ${props =>
    !props.active &&
    css`
      &:hover {
        /* background-color: ${props.theme.greyBlack}; */
        padding-bottom: 1.25rem;
        padding-top: 1.25rem;
      }
    `}

  ${props =>
    props.hasNotifications &&
    css`
      &:after {
        background: ${props => (props.active ? props.theme.primary : props.theme.red)};
        border-radius: 35%;
        color: white;
        content: ${props.hasNotifications};
        font-size: 1.25rem;
        height: 1.75rem;
        line-height: 1.5rem;
        min-width: 1.75rem;
        padding: 0.15rem 0.35rem;
        position: absolute;
        right: -0.5rem;
        text-align: center;
        top: -0.5rem;
        width: auto;
      }
    `}
`

const GuestDetailModal = withApollo(
  withToastManager(
    ({
      previousGuestModal,
      printing,
      onPrintClick,
      selectedAccessRecord,
      onCancelClick,
      guest,
      useGuestSelectLoading,
      persistedTab,
      onTabChange,
      toastManager,
      client,
      account,
      loggedAccount
    }) => {
      const [useGuest, setGuest] = useState(guest)
      const [useTabActive, setTabActive] = useState(guest && previousGuestModal === guest.id ? persistedTab : 'guestDetail')
      const [useTabsNotifications, setTabsNotifications] = useState({})

      const [useErrorMsg, setErrorMsg] = useState('')

      const [useCreateNoteOpen, setCreateNoteOpen] = useState(false)
      const [useAccessRecords, setAccessRecords] = useState([])
      const [useNotes, setNotes] = useState([])

      const loadAccessRecords = () => {
        const attributesToRetrieve = 'objectID,guestJson,productJson,forDate,scannedDays,saleId,forDateUnix'
        const filters = `guestId:${useGuest && useGuest.id}`

        algoliaSearch('accessRecords', { filters, attributesToRetrieve }, (err, accessRecords) => {
          if (accessRecords) {
            setAccessRecords(accessRecords)
          }
        })
      }

      const loadNotes = () => {
        const attributesToRetrieve = 'objectID,message,created,userFullName'
        const filters = `noteableId:${useGuest && useGuest.id}`

        algoliaSearch('notes', { filters, attributesToRetrieve }, (err, notes) => {
          if (notes) {
            setNotes(notes)
            handleTabsContentLoaded('notes', notes)
          }
        })
      }

      useEffect(() => {
        loadAccessRecords()
        loadNotes()
      }, [])

      const handleTabClick = tab => {
        onTabChange(useGuest && useGuest.id, tab)
        setTabActive(tab)
      }

      const handleTabsContentLoaded = (tabKeyName, data) => {
        let currTabsNotifications = { ...useTabsNotifications }
        if (data && data.length) {
          currTabsNotifications[tabKeyName] = `'${data.length}'`
        } else {
          delete currTabsNotifications[tabKeyName]
        }
        setTabsNotifications(currTabsNotifications)
      }

      const renderTab = () => {
        switch (useTabActive) {
          case 'guestDetail':
            return <GuestDetailsForm guest={useGuest} account={account} useErrorMsg={useErrorMsg} setErrorMsg={setErrorMsg} setGuest={setGuest} />
          case 'guestAddresses':
            return <GuestAddressesTable guest={useGuest} />
          case 'accessRecords':
            return (
              <GuestAccessRecords
                guest={guest}
                account={account}
                useAccessRecords={useAccessRecords}
                displayDateFormat={displayDateFormat}
                selectedAccessRecord={selectedAccessRecord}
                printing={printing}
                onPrintClick={onPrintClick}
              />
            )
          case 'outstandingWaivers':
            return <GuestOutstandingWaivers guest={useGuest} />
          case 'eventLineItems':
            return <GuestEvent guest={useGuest} account={account} />
          case 'checkIns':
            return <GuestCheckinsTable client={client} guestId={useGuest && useGuest.id} toastManager={toastManager} />
          case 'notes':
            return (
              <GuestNotes
                account={account}
                loggedAccount={loggedAccount}
                guest={useGuest}
                notes={useNotes}
                setErrorMsg={setErrorMsg}
                setCreateNoteOpen={setCreateNoteOpen}
                useCreateNoteOpen={useCreateNoteOpen}
                onNewNote={loadNotes}
              />
            )
          default:
            return <GuestDetailsForm guest={useGuest} account={account} useErrorMsg={useErrorMsg} setErrorMsg={setErrorMsg} setGuest={setGuest} />
        }
      }

      const addNote = () => {
        setCreateNoteOpen(true)
      }

      const secondaryBtnTitle = useTabActive === 'notes' ? 'Add a Note' : null
      const showSecondaryBtn = useTabActive === 'notes'
      const secondaryBtnHandler = useTabActive === 'notes' ? addNote : null

      return (
        <ProductModal
          title={useGuest ? `${useGuest.firstName} ${useGuest.lastName}` : ''}
          subTitle={useGuest ? 'View guest details' : ''}
          onCancelHandler={onCancelClick}
          lightLayout
          closeIconStyles={{ right: '-2.5rem', top: '-2rem' }}
          secondaryBtnTitle={secondaryBtnTitle}
          secondaryBtnShow={showSecondaryBtn}
          onSecondaryBtnHandler={secondaryBtnHandler}
          secondaryButtonStyles={{ kind: 'secondary', fontSize: '1.25rem', fontWeight: '700' }}
          closeIcon
          withScrollableTable>
          <MainWrapper>
            {useGuestSelectLoading ? (
              <SpinLoader withWrapper="570px" size="80px" color="primary" />
            ) : (
              <>
                <Tabs>
                  <Tab active={useTabActive === 'guestDetail'} onClick={() => handleTabClick('guestDetail')}>
                    Guest Details
                  </Tab>
                  <Tab active={useTabActive === 'guestAddresses'} onClick={() => handleTabClick('guestAddresses')}>
                    Addresses
                  </Tab>
                  <Tab active={useTabActive === 'accessRecords'} onClick={() => handleTabClick('accessRecords')}>
                    Access Records
                  </Tab>
                  <Tab active={useTabActive === 'outstandingWaivers'} onClick={() => handleTabClick('outstandingWaivers')}>
                    Outstanding Waivers
                  </Tab>
                  <Tab active={useTabActive === 'eventLineItems'} onClick={() => handleTabClick('eventLineItems')}>
                    Events
                  </Tab>
                  <Tab active={useTabActive === 'checkIns'} onClick={() => handleTabClick('checkIns')}>
                    CheckIns
                  </Tab>
                  <Tab active={useTabActive === 'notes'} hasNotifications={useTabsNotifications['notes']} onClick={() => handleTabClick('notes')}>
                    Notes
                  </Tab>
                </Tabs>
                {renderTab()}
              </>
            )}
          </MainWrapper>
        </ProductModal>
      )
    }
  )
)
export default GuestDetailModal
