import React from 'react'
import styled from 'styled-components'
import { BasicForm, DayPickerCalendar, Button } from 'es-components'
import dayjs from 'dayjs'

const EventContainer = styled.section`
  height: 100%;
  background-color: ${props => props.theme.greyLight};
`

const EventForm = styled(BasicForm)`
  padding: 0;
  height: 100%;
`

const FormWrapper = styled.div`
  height: 100%;
  padding: 1rem;
`

export class SelectAccessDate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentEvent: 0,
      dateSelected: (props.createdEvent && props.createdEvent.day) || null,
      eventGroupsSelected: null
    }
  }

  selectDate = day => {
    this.setState({ dateSelected: day })
  }

  onAssignClick = () => {
    const { dateSelected } = this.state
    const { onAssignClick } = this.props
    if (onAssignClick) {
      onAssignClick(dayjs(dateSelected).format('MM/DD/YYYY'))
    }
  }

  render() {
    const { dateSelected } = this.state

    return (
      <article style={{ height: '100%' }}>
        <EventContainer>
          <EventForm>
            <FormWrapper>
              <DayPickerCalendar selectedDay={dateSelected} onDateSelected={day => this.selectDate(day)} days={[]} />
              <Button title="Assign" kind="secondary" margin="1rem 0 0" onClickHandler={this.onAssignClick} disabled={dateSelected == null} />
            </FormWrapper>
          </EventForm>
        </EventContainer>
      </article>
    )
  }
}
