import React from 'react'
import styled from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Small } from 'es-components'

const pjson = require('../../../package.json')
const Footer = styled.footer`
  grid-column: 2 / span 3;
  min-height: 20px;
  background-color: ${props => props.theme.white};

  ${flexCenterItem}
`

export default function DashboardFooter() {
  return (
    <Footer>
      <Small color="greyDarkShade">Product of Entabeni Systems (Version: {pjson.version})</Small>
    </Footer>
  )
}
