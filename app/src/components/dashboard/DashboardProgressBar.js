import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Icon } from 'es-components'

const ProgressBar = styled.div`
  grid-column: 1 / span 2;
  display: grid;
  grid-gap: 0.5em;
  width: 100%;
  padding: 0.5em;
  position: relative;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
`

const ProgressHr = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${props => props.theme.greyDark};
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 0;
  transform: translateY(-50%);
`

const ProgressStep = styled.span`
  width: ${props => props.theme.width || 'auto'};
  padding: 0.3em 0.8em;
  background-color: ${props => props.theme.white};
  position: relative;
  z-index: 10;
  border: 1px solid ${props => props.theme.greyDark};
  color: ${props => props.theme.greyDark};
  border-radius: 0.4em;

  .icon {
    margin-right: 0.5em;
  }

  &.complete {
    background: ${props => props.theme.secondary};
    color: ${props => props.theme.white};
  }

  &.active {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.white};
  }

  ${flexCenterItem}
`

export default function DashboardProgressBar({ currentStep }) {
  const addItemsClass = classNames({
    active: ['addProducts', 'addPurchaser'].includes(currentStep),
    complete: ['addProducts', 'addPurchaser', 'addPayment', 'posOrderComplete'].includes(currentStep)
  })
  const paymentProcessClass = classNames({
    active: currentStep === 'addPayment',
    complete: ['addPayment', 'posOrderComplete'].includes(currentStep)
  })
  const purchaseCompleteClass = classNames({
    active: currentStep === 'posOrderComplete'
  })

  return (
    <ProgressBar>
      <ProgressStep className={addItemsClass}>
        <Icon name="IoIosCard" size="1.2rem" />
        Add Items
      </ProgressStep>
      <ProgressStep className={paymentProcessClass}>
        <Icon name="IoIosCart" size="1.2rem" />
        Payment Process
      </ProgressStep>
      <ProgressStep className={purchaseCompleteClass}>
        <Icon name="IoIosCheckmarkCircle" size="1.2rem" />
        Purchase Complete
      </ProgressStep>
      <ProgressHr />
    </ProgressBar>
  )
}
