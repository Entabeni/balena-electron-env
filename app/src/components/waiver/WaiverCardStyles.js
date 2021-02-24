import styled, { css } from 'styled-components'

const sharedStyles = css`
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  outline: 0;
  border: 0;
  color: ${props => props.theme[props.color]};
  font-size: 1.1rem;
  font-weight: 500;
  background-color: transparent;

  &:hover {
    color: ${props => props.theme[props.hoverColor]};
  }
`

export const StyledWaiverCard = styled.section`
  width: 100%;
  height: ${props => props.height || 'auto'};
  display: block;
  margin-bottom: ${props => props.theme.spacingSml};
  border: ${props => props.theme.StdBorder};
  background-color: ${props => props.theme.white};
  box-shadow: ${props => props.theme.boxShadow};

  &:last-child {
    margin: 0;
  }
`
export const CardHeader = styled.header`
  padding: ${props => props.theme.spacingTiny};
  padding-right: 90px;
  border-bottom: ${props => props.theme.StdBorder};
  position: relative;
`

export const ConfirmCheck = styled.div`
  width: 100%;
  padding: 1rem 0;
`

export const CardHeaderButton = styled.button`
  width: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 1rem 0 0;

  ${sharedStyles}
`

export const CardContent = styled.div`
  padding: ${props => props.theme.spacingTiny};
  color: ${props => props.theme.greyDarkShade};
  font-size: 1.1rem;
  height: ${props => (props.activeWaiver ? '250px' : 'auto')};
  max-height: 250px;
  overflow-y: scroll;

  .waiverForm {
    padding: 1.2rem 1rem 0.8rem;
    margin-top: 1rem;
    height: 100%;
    border-top: ${props => props.theme.StdBorder};
  }

  .waiverBtn {
    margin-top: 1rem;
  }
`

export const CardFooter = styled.footer`
  display: flex;
  height: 35px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.greyLight};
  border: 0;
  padding-left: 10px;
  overflow: hidden;
`

// Icon Button
export const CardFooterButton = styled.button`
  display: block;
  width: auto;
  height: 35px;
  position: relative;
  padding: 0 35px 0 1rem;

  ${sharedStyles}
`

export const CardFooterIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 35px;
  position: relative;
  padding: 0 35px 0 1rem;

  ${sharedStyles}
`

export const StyledIcon = styled.span`
  margin: 0;
  padding: 0;
  z-index: 0;
  width: 35px;
  height: 35px;
  right: 0;
  top: 0;
  position: absolute;
  transition: all 0.6s ease-in-out;
  color: ${props => props.theme[props.color]};

  display: flex;
  justify-content: center;
  align-items: center;
`
