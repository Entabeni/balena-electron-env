import React from 'react'
import styled from 'styled-components'

import { Icon } from 'es-components'

const Wrapper = styled.div`
  .duped-user-icon,
  .inverted-icon {
    opacity: 0.25;
    position: absolute;
  }

  .duped-user-icon {
    left: 50%;
    top: auto;

    &.left-icon {
      transform: translate(-175%, 75%);
    }
    &.right-icon {
      transform: translate(-15%, 75%);
      & + .right-icon {
        transform: translate(65%, 75%);
      }
      & + .right-icon + .right-icon {
        transform: translate(145%, 75%);
      }
    }
    &.bottom-icon {
      top: calc(1.5rem + 50%);
      transform: translate(-50%, 200%);
    }
  }

  .inverted-icon {
    left: 50%;
    top: calc(1.5rem + 50%);
    transform: rotate(180deg) translate(50%, 25%);
  }
`

export const DupedGuestsLandingStep = () => {
  return (
    <Wrapper>
      <Icon className="duped-user-icon left-icon" name="FaUserCircle" size="6rem" />
      <Icon className="duped-user-icon right-icon" name="FaUserCircle" size="6rem" />
      <Icon className="duped-user-icon right-icon" name="FaUserCircle" size="6rem" />
      <Icon className="duped-user-icon right-icon" name="FaUserCircle" size="6rem" />
      <Icon className="inverted-icon" name="MdCallMerge" size="18rem" />
      <Icon className="duped-user-icon bottom-icon" name="FaUserCircle" size="6rem" />
    </Wrapper>
  )
}
