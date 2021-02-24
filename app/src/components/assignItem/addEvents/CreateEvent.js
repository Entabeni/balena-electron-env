import React from 'react'
import { Mutation, Query } from 'react-apollo'
import moment from 'moment'

// Components
import { StandardForm, TextInput, SelectInput, TimeInput, DayPickerCalendar, SpinLoader } from 'es-components'

//Validations
import { validateRequired } from 'es-libs'

import { ALL_EVENT_GROUPS, ALL_EVENT_TYPES, ALL_PRODUCT_SKUS, CREATE_PRODUCT_EVENT } from './schema/eventSchema'

export class CreateEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMsg: '',
      selectedDay: null
    }
  }

  handleOnSubmit = (values, createEvent) => {
    const { selectedDay } = this.state
    const { onEventCreated } = this.props
    if (selectedDay == null) {
      this.setState({
        errorMsg: 'Please pick day in date picker'
      })
      return
    }

    // transform data form form
    if (selectedDay != null) {
      values['day'] = moment(selectedDay).format('YYYY-MM-DD')
    }

    values.startTime = moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(values.startTime).format('hh:mm:ss')
    values.endTime = moment(selectedDay).format('YYYY-MM-DD') + ' ' + moment(values.endTime).format('hh:mm:ss')
    values.spots = +values.spots

    if (values.eventTypeId) {
      values.eventTypeId = values.eventTypeId.value
    }

    if (values.productSkuIds) {
      values.productSkuIds = values.productSkuIds.map(product => product.value)
    }

    if (values.eventEventGroups) {
      values.eventEventGroups = values.eventEventGroups.map(eventGroup => {
        return { eventGroupId: eventGroup.value }
      })
    }

    createEvent({ variables: { ...values } })
      .then(({ data }) => {
        this.setState({
          errorMsg: ''
        })
        const event = data.pos.createEvent
        if (onEventCreated) {
          onEventCreated(event)
        }
      })
      .catch(error => {
        const newError = error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : ''
        this.setState({
          errorMsg: newError
        })
      })
  }

  onCancelClick = () => {
    const { onCancelBtnClick } = this.props
    if (onCancelBtnClick) {
      onCancelBtnClick()
    }
  }

  selectDate = selectedDay => {
    this.setState({ selectedDay })
  }

  render() {
    const { errorMsg } = this.state
    const { productItemEvents } = this.props
    const allowProducts = productItemEvents[0].productSkuIds

    return (
      <Query query={ALL_PRODUCT_SKUS}>
        {({ loading, error, data }) => {
          if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
          if (error) return `Error! ${error.message}`
          const { allProductSkus } = data.pos
          const productSkusOptions = []
          allProductSkus.forEach(product => {
            if (allowProducts.indexOf(product.id) !== -1) {
              productSkusOptions.push({ value: product.id, label: product.name })
            }
          })

          return (
            <Query query={ALL_EVENT_TYPES}>
              {({ loading, error, data }) => {
                if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
                if (error) return `Error! ${error.message}`
                const { allEventTypes } = data.pos
                const eventTypesOptions = []
                allEventTypes.forEach(eventType => {
                  eventTypesOptions.push({ value: eventType.id, label: eventType.name })
                })

                return (
                  <Query query={ALL_EVENT_GROUPS}>
                    {({ loading, error, data }) => {
                      if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
                      if (error) return `Error! ${error.message}`

                      const { allEventGroups } = data.pos
                      const eventGroupsOptions = []
                      allEventGroups.forEach(eventGroup => {
                        eventGroupsOptions.push({ value: eventGroup.id, label: eventGroup.name })
                      })

                      return (
                        <Mutation mutation={CREATE_PRODUCT_EVENT}>
                          {(createEvent, { loading }) => {
                            return (
                              <StandardForm
                                tint="true"
                                formcols={2}
                                error={errorMsg}
                                loading={loading}
                                onCancelClick={this.onCancelClick}
                                onSubmitHandler={values => this.handleOnSubmit(values, createEvent)}>
                                <TextInput id="name" field="name" label="Name" autoComplete="off" validate={validateRequired} validateOnChange />
                                <SelectInput
                                  placeholder="Select type"
                                  id="eventTypeId"
                                  field="eventTypeId"
                                  options={eventTypesOptions}
                                  validate={validateRequired}
                                  borderRadius="0"
                                />
                                <TimeInput id="startTime" field="startTime" name="startTime" label="Start time" />
                                <TimeInput id="endTime" field="endTime" name="endTime" label="End time" />
                                <TextInput id="spots" field="spots" label="Spot" autoComplete="off" validate={validateRequired} validateOnChange />
                                <SelectInput
                                  placeholder="Instructor pods"
                                  id="productSkuIds"
                                  field="productSkuIds"
                                  options={productSkusOptions}
                                  validate={validateRequired}
                                  isMulti
                                  borderRadius="0"
                                />
                                <SelectInput
                                  placeholder="Groups"
                                  id="eventEventGroups"
                                  field="eventEventGroups"
                                  options={eventGroupsOptions}
                                  isMulti
                                  validate={validateRequired}
                                  borderRadius="0"
                                />
                                <DayPickerCalendar onDateSelected={day => this.selectDate(day)} days={[]} />
                              </StandardForm>
                            )
                          }}
                        </Mutation>
                      )
                    }}
                  </Query>
                )
              }}
            </Query>
          )
        }}
      </Query>
    )
  }
}
