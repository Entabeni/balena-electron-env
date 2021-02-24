import React from 'react'

// Components
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${props => (props.withWrapper && typeof props.withWrapper === 'string' ? props.withWrapper : '100%')};
  width: 100%;
`

const LoaderContainer = styled.figure`
  display: inline-block;
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
`

const StyledSpinner = styled.svg`
  animation: ${rotate} 2s linear infinite;
  margin: 0;
  width: 100%;
  height: 100%;

  .path {
    stroke: ${props => props.theme[props.color] || props.theme.white};
    stroke-linecap: round;
    animation: ${dash} 1.5s ease-in-out infinite;
  }

  .static {
    stroke: rgba(180, 180, 180, 0.4);
    stroke-linecap: round;
  }
`

const Loader = props => (
  <LoaderContainer size={props.size}>
    <StyledSpinner className="spinLoader" viewBox="0 0 50 50" color={props.color}>
      <circle className="static" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
    </StyledSpinner>
  </LoaderContainer>
)

export const SpinLoader = ({ withWrapper, wrapperAs, wrapperClass, ...props }) => {
  if (withWrapper) {
    return (
      <LoaderWrapper className={wrapperClass} withWrapper={withWrapper} as={wrapperAs}>
        <Loader {...props} />
      </LoaderWrapper>
    )
  }
  return <Loader {...props} />
}
