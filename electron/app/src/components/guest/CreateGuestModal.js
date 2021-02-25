import React from 'react'
import { withToastManager } from 'react-toast-notifications'

import { ProductModal, CreateGuest } from 'es-components'

const CreateGuestModal = ({ onCancelClick, account, toastManager }) => {
  return (
    <ProductModal title="Create Guest" subTitle="Enter guest details" onCancelHandler={onCancelClick}>
      <CreateGuest
        addPurchaser
        account={account}
        ageVariant={null}
        onGuestCreated={() => {
          toastManager.add('Guest created successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
          onCancelClick()
        }}
      />
    </ProductModal>
  )
}

export default withToastManager(CreateGuestModal)
