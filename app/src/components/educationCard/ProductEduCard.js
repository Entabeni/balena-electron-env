import React from 'react'
import styled from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Icon, H4, Par } from 'es-components'

const EduCardWrapper = styled.div`
  ${flexCenterItem}
  flex-direction: column;
  height: 100%;

  .halfContainer {
    width: 60%;
    text-align: center;
  }
`

const EduCardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  width: 60%;
  opacity: 0.3;

  .li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 0 20px 0 80px;
    margin: 0;
    height: 80px;
    position: relative;
    font-size: 1.5em;
    line-height: 1;
    color: ${props => props.theme.primary};
    font-weight: normal;
  }
`

const IconContainer = styled.figure`
  top: 0;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 80px;
  position: absolute;
  color: ${props => props.theme.primary};

  ${flexCenterItem}
`

export const ProductEduCard = () => (
  <EduCardWrapper>
    <EduCardList>
      <li className="li">
        <IconContainer>
          <Icon name="FaRegIdCard" size="3rem" />
        </IconContainer>
        <H4 color="primary">Add or create a guest for each guest item.</H4>
      </li>
      <li className="li">
        <IconContainer>
          <Icon name="FaCalendarCheck" size="3rem" />
        </IconContainer>
        <H4 color="primary">Complete the adding events process for each guest item.</H4>
      </li>
      <li className="li">
        <IconContainer>
          <Icon name="FaRegCalendarAlt" size="3rem" />
        </IconContainer>
        <H4 color="primary">Select access days for each guest item.</H4>
      </li>
      <li className="li">
        <IconContainer>
          <Icon name="FaWpforms" size="3rem" />
        </IconContainer>
        <H4 color="primary">If required for the product, complete the questionnaire.</H4>
      </li>
    </EduCardList>

    <Par color="primary" className="halfContainer">
      <b>Note:</b> The following steps are required to complete this process. Steps that have been skipped, will highlighted in red.
    </Par>
  </EduCardWrapper>
)
