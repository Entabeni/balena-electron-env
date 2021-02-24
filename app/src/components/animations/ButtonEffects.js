import { keyframes } from 'styled-components'

export const btnRippleEffect = (color, hoverColor) => keyframes`
  0% {
    color: ${color};
  }
  50% {
    color: ${hoverColor};
  }
  100% {
    color: ${color};
  }
`

export const btnBlastBackgroundEffect = keyframes`
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(10, 10);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(20, 20);
  }
`
