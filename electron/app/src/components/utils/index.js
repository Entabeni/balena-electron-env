import { css } from 'styled-components'

export const flexCenterItem = css`
  display: flex;
  flex-direction: ${props => props.flexDirection || 'row'};
  justify-content: center;
  align-items: center;
`
