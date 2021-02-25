import React from 'react'
import styled from 'styled-components'

// Graph QL
import { Query } from 'react-apollo'

import { GET_WAIVERS_QUERY } from './schema'

import { MainPanelWrapper, CompletedWaiverCard, SpinLoader, Par, Button } from 'es-components'
const WaiverWrapper = styled.div`
  margin: 20px auto;
`

export const WaiversPage = ({ order, onCompletedAllWaivers, onGoBack, waivers, waiversLoading, completedAllWaivers, completedWaiversCount }) => {
  const [completedWaiver, setCompletedWaiver] = React.useState(0)

  const completedWaiverHandler = () => {
    if (waivers && waivers.length - completedWaiversCount === completedWaiver + 1) {
      onCompletedAllWaivers()
    } else {
      setCompletedWaiver(completedWaiver + 1)
    }
  }

  const spinLoader = () => {
    return <SpinLoader withWrapper size="80px" color="primary" />
  }

  const loadFromQuery = () => {
    return (
      <Query query={GET_WAIVERS_QUERY} variables={{ orderId: order.id }}>
        {({ loading, error, data }) => {
          if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
          if (error) return `Error! ${error.message}`
          const { allCompletedWaivers } = data.pos
          let allCompletedWaiversCont = 0

          allCompletedWaivers.forEach(waiver => {
            if (waiver.status === 'completed') {
              allCompletedWaiversCont = allCompletedWaiversCont + 1
            }
          })

          if (allCompletedWaivers.length === allCompletedWaiversCont && !completedAllWaivers) {
            onCompletedAllWaivers()
          }

          return (
            <>
              {allCompletedWaivers.length ? (
                allCompletedWaivers.map(completedWaiver => (
                  <CompletedWaiverCard
                    key={completedWaiver.id}
                    id={completedWaiver.id}
                    status={completedWaiver.status}
                    data={completedWaiver.waiver}
                    orderId={order.id}
                    signingString={completedWaiver.signingString}
                    handleCompletedWaiver={completedWaiverHandler}
                  />
                ))
              ) : (
                <Par>
                  The waiver for the products in this order needs to be done by the guests you have assigned to the product, once the transaction is complete
                  they will receive an email to complete the process.
                </Par>
              )}
            </>
          )
        }}
      </Query>
    )
  }

  const waiversList = () => {
    return (
      <>
        {waivers.length ? (
          waivers.map(completedWaiver => (
            <CompletedWaiverCard
              key={completedWaiver.id}
              id={completedWaiver.id}
              status={completedWaiver.status}
              data={completedWaiver.waiver}
              orderId={order.id}
              signingString={completedWaiver.signingString}
              handleCompletedWaiver={completedWaiverHandler}
            />
          ))
        ) : (
          <Par>
            The waiver for the products in this order needs to be done by the guests you have assigned to the product, once the transaction is complete they
            will receive an email to complete the process.
          </Par>
        )}
      </>
    )
  }

  const renderBody = () => {
    if (waiversLoading) {
      return spinLoader()
    } else if (!waiversLoading && !waivers) {
      return loadFromQuery()
    } else {
      return waiversList()
    }
  }
  return (
    <MainPanelWrapper title="Agreements">
      <WaiverWrapper>{renderBody()}</WaiverWrapper>
      <Button title="Back" kind="greyOutline" rounded onClickHandler={onGoBack} />
    </MainPanelWrapper>
  )
}
