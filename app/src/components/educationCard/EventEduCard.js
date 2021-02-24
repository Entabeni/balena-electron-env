import React from 'react'
import styled from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Icon, H4 } from 'es-components'

const EduCardWrapper = styled.div`
  ${flexCenterItem}
  background-color: ${props => props.theme.white};
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

export const EventEduCard = () => (
  <EduCardWrapper>
    <EduCardList>
      <li className="li">
        <IconContainer>
          <Icon name="FaCalendar" size="3rem" />
        </IconContainer>
        <H4 color="primary">Event Form Process: Select a valid date from the calendar to list the available events to chooose from.</H4>
      </li>
    </EduCardList>
  </EduCardWrapper>
)
