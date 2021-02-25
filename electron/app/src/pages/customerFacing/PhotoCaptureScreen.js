import React, { useState } from 'react'
import { CaptureGuestPhotoInner } from 'es-components'
import styled from 'styled-components'
import { UPDATE_GUEST } from './schema'
export const PageWrap = styled.div`
  height: 100%;
  padding: 130px 40px 110px 40px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`
export default function PhotoCaptureScreen({ guest, client, toastManager, orderId, updateScreen }) {
  const [loading, setLoading] = useState(false)
  const uploadFile = async (file, guestId) => {
    const awsImage = await fetch(guest.signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file ? file.type : 'image/jpeg' },
      body: file
    })
    const savedImage = client.mutate({
      mutation: UPDATE_GUEST,
      variables: { id: guestId, profilePictureUrl: guest.signedUrl.split('?')[0] }
    })
    if (savedImage) {
      toastManager.add('Image uploaded successfully.', { appearance: 'success', autoDismissTimeout: 3000, autoDismiss: true })
      updateScreen({ screen: orderId ? 'presentOrder' : 'logo', orderId, toastManager, client, isCustomerFacing: true })
    }
  }

  const handleCaptureGuestPhotoCompleteSelect = file => {
    setLoading(true)
    uploadFile(file, guest.id)
  }

  return (
    <PageWrap>
      <CaptureGuestPhotoInner
        guestFullName={guest && guest.fullName}
        isCustomerFacing
        loading={loading}
        previousProfilePictureUrl={guest && guest.profilePictureUrl}
        onCompleteClick={file => handleCaptureGuestPhotoCompleteSelect(file)}
      />
    </PageWrap>
  )
}
