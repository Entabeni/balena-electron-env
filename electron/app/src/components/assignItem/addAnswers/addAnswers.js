import React from 'react'

// Components
import { StandardForm, TextInput, TextArea, SelectInput, CheckboxInputGroup, Par, CheckboxInputOld } from 'es-components'

//Validations
import { validateRequired, unique } from 'es-libs'

export class AddAnswers extends React.Component {
  reformatCheckBoxGroupData = values => {
    let newValues = []
    Object.keys(values).forEach(key => {
      const questionKey = key.split(':')
      if (questionKey.length > 1) {
        if (values[key] === true) {
          if (newValues[questionKey[0]] != null) {
            newValues[questionKey[0]].push(questionKey[1])
          } else {
            newValues[questionKey[0]] = [questionKey[1]]
          }
        }
      } else {
        newValues[questionKey[0]] = values[questionKey[0]]
      }
    })
    return newValues
  }

  handleOnSubmit = values => {
    const { onAnswersAdd } = this.props
    values = this.reformatCheckBoxGroupData(values)
    if (onAnswersAdd) {
      onAnswersAdd(values)
    }
  }

  onCancelClick = () => {
    const { onCancelBtnClick } = this.props
    if (onCancelBtnClick) {
      onCancelBtnClick()
    }
  }

  renderTextField(question) {
    return (
      <TextInput
        id={question.id}
        key={question.id}
        type="text"
        field={question.id}
        label={question.questionText}
        validate={question.required ? validateRequired : null}
        validateOnBlur
      />
    )
  }

  renderCheckboxField(question) {
    return (
      <div key={question.id}>
        <Par marginBottom="spacingSml">{question.questionText}</Par>
        <CheckboxInputGroup field={question.id} stack validate={question.required ? validateRequired : null}>
          {question.options.map((option, index) => (
            <CheckboxInputOld key={option.id} id={option.id} field={`${question.id}:${option.id}`} label={option.optionText} checked value={true} />
          ))}
        </CheckboxInputGroup>
      </div>
    )
  }

  renderSelectField(question, isMulti) {
    return (
      <SelectInput
        key={question.id}
        field={question.id}
        placeholder={question.questionText}
        options={question.options.map(option => {
          return { value: option.id, label: option.optionText }
        })}
        validate={question.required ? validateRequired : null}
        validateOnBlur
        multi={isMulti}
        multiple={isMulti}
      />
    )
  }

  renderTextArea = question => {
    return (
      <TextArea
        key={question.id}
        borderColor={'grey'}
        field={question.id}
        label={question.questionText}
        validate={question.required ? validateRequired : null}
        validateOnBlur
      />
    )
  }

  renderField(question) {
    if (question.formElement === 'text' || question.formElement === 'tel' || question.formElement === 'email') {
      return this.renderTextField(question)
    }
    if (question.formElement === 'textarea') {
      return this.renderTextArea(question)
    }
    if (question.formElement === 'checkbox') {
      return this.renderCheckboxField(question)
    }
    if (question.formElement === 'selectInput' || question.formElement === 'multiSelect') {
      return this.renderSelectField(question, question.formElement === 'multiSelect')
    }
  }

  render() {
    let questions = unique(this.props.questions, ['id'])
    return (
      <StandardForm tint="true" formcols={1} onCancelClick={this.onCancelClick} onSubmitHandler={values => this.handleOnSubmit(values)}>
        {questions && questions.map(question => this.renderField(question))}
      </StandardForm>
    )
  }
}
