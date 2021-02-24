import React from 'react'
import styled from 'styled-components'

const PaddingWrapper = styled.div`
  padding-top: ${props => (props.top ? props.theme[props.size] : 0)};
  padding-right: ${props => (props.right ? props.theme[props.size] : 0)};
  padding-left: ${props => (props.left ? props.theme[props.size] : 0)};
  padding-bottom: ${props => (props.bottom ? props.theme[props.size] : 0)};
`

export const WaiverPart = ({ data }) => (
  <PaddingWrapper size="spacingTiny" top left right bottom>
    <div dangerouslySetInnerHTML={{ __html: data }} />
  </PaddingWrapper>
)
