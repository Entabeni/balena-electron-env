import React, { useState } from 'react'

import { CaptureDOBModal, MaskedTextInput } from 'es-components'
import { validateAgeVar, getDateFormat, validatePurhaserAge } from 'es-libs'

export const CaptureGuestDOB = ({ onCompleteClick, onCancelClick, account, ageVariant, addingPurchaser, ...props }) => {
  const [dateOfBirth, setDateOfBirth] = useState('')
  let validation
  if (addingPurchaser) {
    validation = validatePurhaserAge(account)
  } else {
    validation = validateAgeVar(ageVariant, account.ageCalculationMethod, account.endOfWinterSeasonMonth, account.ageCalculationDate)
  }

  return (
    <CaptureDOBModal
      {...props}
      title="Date of Birth Capture"
      subTitle="Please provide the guest's date of birth"
      onPrimaryBtnHandler={() => {
        onCompleteClick(dateOfBirth)
      }}
      onCancelHandler={onCancelClick}
      primaryBtnTitle="Update"
      primaryBtnDisabled={validation(dateOfBirth) !== undefined || dateOfBirth.length !== 10 || dateOfBirth.indexOf('_') !== -1}>
      <MaskedTextInput
        id="dateOfBirth"
        field="dateOfBirth"
        label={`Date of Birth (${getDateFormat()})`}
        validate={validation}
        validateOnChange
        onChange={e => setDateOfBirth(e.target.value)}
      />
    </CaptureDOBModal>
  )
}
