import React, { useContext } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import styled from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Libs
import { logoutHandler } from 'es-libs'

// Components
import { Icon, btnRippleEffect, TouchButton } from 'es-components'

// Context
import { SiteGlobalContext } from 'es-context'
// Interceptor globals
import { interceptorGlobalKeyNames } from '../../components/modal/beforeLeavingInterceptor'
// Safe key name for storing the interceptor modal methods/values in a 'private' global value
const interceptorLogOutGKN = interceptorGlobalKeyNames.logOut
const interceptorLogOutMethodGKN = interceptorGlobalKeyNames.logOutMethod

const DashboardNav = styled.nav`
  grid-row: 2 / span 2;
  display: flex;
  flex-direction: column;
  width: 60px;
  background-color: ${props => props.theme.primaryShade};
  justify-content: space-between;
`
const DashboardLink = styled(NavLink)`
  width: 60px;
  height: 60px;
  margin: 13px 0;
  color: ${props => props.theme.primaryTint};
  cursor: pointer;

  ${flexCenterItem}

  &:hover {
    color: ${props => props.theme.white};
  }

  &.active {
    color: ${props => props.theme.white};
  }
`

const DashboardLinkLogout = styled(TouchButton)`
  width: 60px;
  height: 60px;
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.red};

  &:before {
    background-color: ${props => props.theme.red};
  }

  &:hover {
    &:before {
      background: ${props => `radial-gradient(${props.theme.red} 10%, ${props.theme.redShade})`};
    }
  }

  &:after {
    background-color: ${props => props.theme.red};
  }

  &:focus:not(:active) {
    animation: ${props => btnRippleEffect(props.theme.white, props.theme.white)} 0.5s ease;
  }
`

function DashboardNavigation(props) {
  const { askBeforeLeaving } = useContext(SiteGlobalContext)

  const onLogOutClick = evt => {
    // Checking if no pending/incomplete process has been started before
    if (askBeforeLeaving) {
      window[interceptorLogOutGKN] = true
      window[interceptorLogOutMethodGKN] = () => logoutHandler(props)
      // Triggering the React Router customized prompt
      props.history.push(window.location.pathname)
      return null
    }
    // Using the regular logout flow
    logoutHandler(props)
  }

  return (
    <DashboardNav id="navigationPanel">
      <div>
        <DashboardLink to="/order" activeClassName="active" exact>
          <Icon name="FaCashRegister" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/order/orders" activeClassName="active" exact>
          <Icon name="IoMdCart" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/order/sales" activeClassName="active" exact>
          <Icon name="IoLogoUsd" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/order/guests" activeClassName="active" exact>
          <Icon name="IoIosPerson" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/order/outstandingAssets" activeClassName="active" exact>
          <Icon name="FaSignOutAlt" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/order/checkIns" activeClassName="active" exact>
          <Icon name="FaCheckSquare" size="2.5rem" />
        </DashboardLink>
        <DashboardLink to="/cashout" onClick={props.onCashoutClick} activeClassName="active" exact>
          <Icon name="FaMoneyBill" size="2.5rem" />
        </DashboardLink>
      </div>
      <DashboardLinkLogout id="logoutButton" onClick={onLogOutClick} type="button">
        <Icon name="IoIosLogOut" size="2rem" />
      </DashboardLinkLogout>
    </DashboardNav>
  )
}

export default withRouter(DashboardNavigation)
