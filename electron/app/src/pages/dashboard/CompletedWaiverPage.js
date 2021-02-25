import React from 'react'

// Graph QL
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'

import { MainPanelWrapper, CompletedWaiverCard, SpinLoader } from 'es-components'
export const GET_WAIVER_QUERY = gql`
  query Waiver($id: String!) {
    pos {
      completedWaiver(id: $id) {
        signingString
        canActivate
        waiver {
          id
          intro
          title
          showEmailPos
          part1
          part2
          part3
          part4
          part5
        }
      }
    }
  }
`

export const CompletedWaiverPage = ({ match, history }) => {
  const completedWaiverHandler = (canActivate, guestId) => {
    history.push('/')
  }
  return (
    <MainPanelWrapper title="Agreement" inModal>
      <Query query={GET_WAIVER_QUERY} variables={{ id: match.params.id }}>
        {({ loading, error, data }) => {
          if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
          console.log(error, data)
          // if (error || data === null) return <Redirect to="/" />

          return (
            <CompletedWaiverCard
              id={match.params.id}
              data={data.pos.completedWaiver.waiver}
              signingString={data.pos.completedWaiver.signingString}
              isTerminal
              match={match}
              handleCompletedWaiver={guestIdToActivate => completedWaiverHandler(data.pos.completedWaiver.canActivate, guestIdToActivate)}
            />
          )
        }}
      </Query>
    </MainPanelWrapper>
  )
}
