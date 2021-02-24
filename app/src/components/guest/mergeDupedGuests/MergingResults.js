import React from 'react'
import styled from 'styled-components'

import { Par, Button, Icon } from 'es-components'

const Wrapper = styled.div`
  .duped-user-results-icon {
    left: 50%;
    opacity: 0.25;
    position: absolute;
    top: 30%;
    transform: translateX(-50%);
  }

  p {
    font-size: 1.5rem;
    line-height: 1.5;
    margin: 0 auto 5rem;
    padding-top: 35%;
    text-align: center;
    width: 75%;
  }
`

export const DupedMergingResults = ({ error, onClose: handleModalClose, onGoBack: handleGoBack }) => {
  if (!error) {
    return (
      <Wrapper>
        <Icon className="duped-user-results-icon success-icon" name="FaCheckCircle" size="6rem" />
        <Par>You have succesfully merged the duplicated info into a single guest entry.</Par>
        <div className="buttons-wrapper">
          <Button title="Accept and Close" kind="primary" onClickHandler={handleModalClose} />
        </div>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Icon className="duped-user-results-icon error-icon" name="MdError" size="6rem" />
        <Par>It seems there was an error while attempting to merge the duplicated info.</Par>
        <div className="buttons-wrapper">
          <Button title="Go Back and Review" kind="secondary" onClickHandler={handleGoBack} />
          <Button title="Discard and Close" kind="primary" onClickHandler={handleModalClose} />
        </div>
      </Wrapper>
    )
  }
}
