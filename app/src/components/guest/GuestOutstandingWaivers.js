import React from 'react'
import styled from 'styled-components'

import { Par, CompletedWaiverCard } from 'es-components'
const WaiversWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.grey};
  padding: 1.25rem 2.5rem;
`
export const GuestOutstandingWaivers = ({ guest }) => {
  const handleCompletedWaiver = () => {}

  return (
    <WaiversWrapper>
      {guest.completedWaiversInvited.length ? (
        guest.completedWaiversInvited.map(completedWaiver => (
          <CompletedWaiverCard
            key={completedWaiver.id}
            id={completedWaiver.id}
            data={completedWaiver.waiver}
            signingString={completedWaiver.signingString}
            handleCompletedWaiver={handleCompletedWaiver}
          />
        ))
      ) : (
        <Par>There are no waivers to complete for this guest.</Par>
      )}
    </WaiversWrapper>
  )
}
