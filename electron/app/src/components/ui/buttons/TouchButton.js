import styled, { keyframes } from 'styled-components'

// Style Utils
import { flexCenterItem } from '../../utils'

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

export const TouchButton = styled.button`
  border: none;
  outline: none;
  position: relative;
  z-index: 0;
  cursor: pointer;
  background: transparent;
  /* transition: all 0.4s ease-in-out; */
  overflow: hidden;

  ${flexCenterItem}

  &:before {
    content: '';
    width: auto;
    height: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: -2;
    position: absolute;
    /* transition: all 0.4s ease-in-out; */
  }

  &:after {
    content: '';
    width: 10px;
    height: 10px;
    z-index: -1;
    opacity: 0;
    position: absolute;
    transform: scale(1, 1);
    border-radius: 100%;
  }

  &:focus:not(:active)::after {
    animation: ${btnBlastBackgroundEffect} 1s linear 1;
  }
`
