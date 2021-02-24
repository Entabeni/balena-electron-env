import React from 'react'
import styled from 'styled-components'

const DashboardSection = styled.section`
  grid-column: span 2;
  margin: 0;
  min-height: 100%;
  background-color: ${props => props.theme.greyLightTint};
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 100%;
`

export const DashboardWrapperSingle = props => <DashboardSection dashbordNav={props.dashbordNav}>{props.children}</DashboardSection>
