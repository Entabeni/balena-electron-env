import { css } from 'styled-components'

const breakpoints = {
  phone: 580,
  tablet: 768,
  smlScreen: 768,
  lrgScreen: 1170
}

// Iterate through the sizes and create a media template
export const media = Object.keys(breakpoints).reduce((mediaSize, label) => {
  mediaSize[label] = (...args) => css`
    @media (max-width: ${breakpoints[label]}px) {
      ${css(...args)}
    }
  `

  return mediaSize
}, {})
