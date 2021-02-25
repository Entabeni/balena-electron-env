import { css } from 'styled-components'

import { media } from 'es-themes'

export const bgImageStyles = css`
  background-image: url(${props => props.theme.backgroundImage || props.bgImage});
  background-repeat: no-repeat;
  background-size: cover;
`
