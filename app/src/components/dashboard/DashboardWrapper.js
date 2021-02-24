import React from 'react'
import styled from 'styled-components'

const DashboardSection = styled.section`
  grid-column: span 2;
  margin: 0;
  min-height: 100%;
  background-color: ${props => props.theme.greyLight};
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 60% 40%;
`

export const DashboardWrapper = props => <DashboardSection dashbordNav={props.dashbordNav}>{props.children}</DashboardSection>
