import React, { useState } from 'react'
import styled from 'styled-components'

import { CaptureRentalDetailsModal, SelectInput, TextInput, SpinLoader } from 'es-components'
import {
  validateRequired,
  validateAll,
  validatePositiveNumber,
  feetInchesToCm,
  lbsToKg,
  roundit,
  getFloat,
  kgToLbs,
  cmToFeetInches,
  disciplineOptions,
  levelOptions,
  stanceOptions
} from 'es-libs'

const AdditionalSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 1em;
  border-top: ${props => props.theme.StdBorder};
  padding: ${props => props.theme.spacingSml} ${props => props.theme.spacingSml} ${props => props.theme.spacingTiny};

  .pullLeft {
    grid-column: 2;
  }
`

const AdditionalSectionInner3 = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 0 1em;
  padding: ${props => props.theme.spacingSml} ${props => props.theme.spacingSml} ${props => props.theme.spacingTiny};

  .pullLeft {
    grid-column: 2;
  }
`

const AdditionalSectionInner4 = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 0 1em;
  padding: ${props => props.theme.spacingSml} ${props => props.theme.spacingSml} ${props => props.theme.spacingTiny};

  .pullLeft {
    grid-column: 2;
  }
`

export const CaptureGuestRentalDetails = ({ onCompleteClick, account, selectedGuest, onCancelClick, ...props }) => {
  const selectedDiscipline = selectedGuest && selectedGuest.discipline ? disciplineOptions.find(opt => opt.value === selectedGuest.discipline) : null
  const selectedLevel = selectedGuest && selectedGuest.level ? levelOptions.find(opt => opt.value === selectedGuest.level) : null
  const selectedStance = selectedGuest && selectedGuest.stance ? stanceOptions.find(opt => opt.value === selectedGuest.stance) : null
  const selectedWeight = selectedGuest && selectedGuest.weight ? selectedGuest.weight : null
  const selectedHeight = selectedGuest && selectedGuest.height ? selectedGuest.height : null
  const selectedShoeSize = selectedGuest && selectedGuest.shoeSize ? selectedGuest.shoeSize : null

  const [discipline, setDiscipline] = useState(selectedDiscipline)
  const [level, setLevel] = useState(selectedLevel)
  const [stance, setStances] = useState(selectedStance)
  const [weightKg, setWeightKg] = useState(roundit(selectedWeight))
  const [heightCm, setHeightCm] = useState(roundit(selectedHeight))
  const [shoeSizeMetric, setShoeSizeMetric] = useState(roundit(selectedShoeSize))
  const [weightLbs, setWeightLbs] = useState(kgToLbs(selectedWeight))
  const [heightFt, setHeightFt] = useState(cmToFeetInches(selectedHeight)[0])
  const [heightInches, setHeightInches] = useState(cmToFeetInches(selectedHeight)[1])
  const [shoeSizeImperial, setShoeSizeImperial] = useState(roundit(selectedShoeSize))
  const [showLoader, setShowLoader] = useState(false)
  const { measurement } = account

  let primaryBtnEnabled = true
  if (measurement === 'metric') {
    primaryBtnEnabled = weightKg != null && weightKg !== '' && heightCm != null && heightCm !== '' && shoeSizeMetric != null && shoeSizeMetric !== ''
  } else if (measurement === 'imperial') {
    primaryBtnEnabled =
      weightLbs != null &&
      weightLbs !== '' &&
      heightFt != null &&
      heightFt !== '' &&
      heightInches != null &&
      heightInches !== '' &&
      shoeSizeImperial != null &&
      shoeSizeImperial !== ''
  }

  if (discipline != null && discipline.value) {
    switch (discipline.value) {
      case 'skiing':
        primaryBtnEnabled = level != null && level !== '' && primaryBtnEnabled
        break
      case 'snowboard':
        primaryBtnEnabled = stance != null && stance !== '' && primaryBtnEnabled
        break
    }
  } else {
    primaryBtnEnabled = false
  }

  const renderRentalForm = () => {
    return (
      <>
        <AdditionalSection>
          <SelectInput
            kind="assignGuest"
            field="discipline"
            placeholder="Select a discipline*"
            options={disciplineOptions}
            validate={validateRequired}
            onChange={val => {
              setDiscipline(val)
            }}
            value={discipline != null ? discipline.value : null}
          />
          {discipline && discipline.value === 'skiing' ? (
            <SelectInput
              kind="assignGuest"
              field="level"
              placeholder="Select a type*"
              options={levelOptions}
              validate={validateRequired}
              onChange={val => {
                setLevel(val)
              }}
              value={level != null ? level.value : null}
            />
          ) : null}
          {discipline && discipline.value === 'snowboard' ? (
            <SelectInput
              kind="assignGuest"
              field="stance"
              placeholder="Select a stance*"
              options={stanceOptions}
              validate={validateRequired}
              onChange={val => {
                setStances(val)
              }}
              value={stance != null ? stance.value : null}
            />
          ) : null}
        </AdditionalSection>
        {measurement === 'metric' && (
          <AdditionalSectionInner3>
            <TextInput
              id="weightKg"
              type="number"
              onChange={e => setWeightKg(e.target.value)}
              field="weightKg"
              label="Weight (Kg)*"
              icon="FaBalanceScale"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={weightKg}
            />
            <TextInput
              id="heightCm"
              type="number"
              onChange={e => setHeightCm(e.target.value)}
              field="heightCm"
              label="Height (Cm)*"
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={heightCm}
            />
            <TextInput
              id="shoeSizeMetric"
              type="number"
              onChange={e => setShoeSizeMetric(e.target.value)}
              field="shoeSizeMetric"
              label="Shoe Size*"
              icon="FaArrowsAltH"
              validate={validateRequired}
              validateOnBlur
              value={shoeSizeMetric}
            />
          </AdditionalSectionInner3>
        )}
        {measurement === 'imperial' && (
          <AdditionalSectionInner4>
            <TextInput
              id="weightLbs"
              type="number"
              field="weightLbs"
              label="Weight (Lbs)*"
              onChange={e => setWeightLbs(e.target.value)}
              icon="FaBalanceScale"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={weightLbs}
            />
            <TextInput
              id="heightFt"
              type="number"
              field="heightFt"
              label="Height (Feet)*"
              onChange={e => setHeightFt(e.target.value)}
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={heightFt}
            />
            <TextInput
              id="heightInches"
              type="number"
              field="heightInches"
              label="Height (Inches)*"
              onChange={e => setHeightInches(e.target.value)}
              icon="FaArrowsAltV"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={heightInches}
            />
            <TextInput
              id="shoeSizeImperial"
              type="number"
              field="shoeSizeImperial"
              onChange={e => setShoeSizeImperial(e.target.value)}
              label="Shoe Size*"
              icon="FaArrowsAltH"
              validate={validateAll([validateRequired, validatePositiveNumber])}
              validateOnBlur
              value={shoeSizeImperial}
            />
          </AdditionalSectionInner4>
        )}
      </>
    )
  }

  const onUpdateBtnHandler = () => {
    setShowLoader(true)
    const rentalData = {}
    rentalData['level'] = level ? level.value : null
    rentalData['stance'] = stance ? stance.value : null
    rentalData['discipline'] = discipline ? discipline.value : null

    if (measurement === 'metric') {
      rentalData['weight'] = getFloat(weightKg)
      rentalData['height'] = getFloat(heightCm)
      rentalData['shoeSize'] = getFloat(+shoeSizeMetric)
    } else if (measurement === 'imperial') {
      rentalData['weight'] = lbsToKg(weightLbs)
      rentalData['height'] = feetInchesToCm(heightFt, heightInches)
      rentalData['shoeSize'] = getFloat(+shoeSizeImperial)
    }

    onCompleteClick(rentalData)
  }

  return (
    <CaptureRentalDetailsModal
      {...props}
      title="Rental Information Capture"
      subTitle="Please provide the guest's rental information"
      primaryBtnDisabled={!primaryBtnEnabled || showLoader}
      onPrimaryBtnHandler={onUpdateBtnHandler}
      onCancelHandler={onCancelClick}
      primaryBtnTitle="Update">
      {showLoader ? <SpinLoader withWrapper size="80px" color="primary" /> : renderRentalForm()}
    </CaptureRentalDetailsModal>
  )
}
