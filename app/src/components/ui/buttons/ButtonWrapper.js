import styled, { css } from 'styled-components'

// Components
import { media } from 'es-themes'

export const ButtonWrapper = styled.div`
  margin: 0;
  padding: ${props => props.padding || 0};
  margin-top: ${props => props.marginTop || 0};

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${props => props.justify};

  & > button {
    margin-right: 0.5rem;
  }

  & > button:last-child {
    margin-right: 0;
  }

  ${props =>
    props.borderTop &&
    css`
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: ${props => props.theme.StdBorder};
    `}

  ${media.phone`
    & > button {
      margin-right: 0;
    }
  `}
`
