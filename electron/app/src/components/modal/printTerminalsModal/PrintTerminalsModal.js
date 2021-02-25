import React from 'react'
import styled from 'styled-components'

// Theme
import { theme } from '../../../themes/index'

// Component
import { DarkModal } from '../'
import { SelectInput } from 'es-components'

const renderPrintTerminalsSelectField = (selectedPrintTerminalId, printTerminals, onChangeHandler) => {
  return (
    <SelectInput
      id="printTerminalSelect"
      controlBgColor={theme.greyBlackShade}
      controlBorderColor={theme.grey}
      controlMarginBottom="0"
      value={selectedPrintTerminalId}
      inputColor={theme.white}
      menuBgColor={theme.greyBlackShade}
      menuBorderRadius="0"
      menuMarginTop="0"
      optionBgColorOnFocus={theme.greyDarkShade}
      optionColorOnFocus={theme.white}
      valueColor={theme.white}
      isClearable={true}
      onChange={onChangeHandler}
      options={printTerminals.map(terminal => ({ value: terminal.id, label: terminal.name }))}
      placeholder="Choose a print terminal"
    />
  )
}

export default function PrintTerminalsModal({ selectedPrintTerminalId, onPrimaryBtnHandler, onListChangeHandler, printTerminals }) {
  const modalSizing = {
    height: 'auto',
    maxHeight: '316px',
    maxWidth: '560px',
    width: '40%'
  }
  return (
    <DarkModal
      buttonLabel="Select and Submit"
      onClick={() => onPrimaryBtnHandler(printTerminals.find(printTerminal => printTerminal.id === selectedPrintTerminalId))}
      sizing={modalSizing}
      title="Print Terminal Selection"
      titleHint="Select a print terminal from the list or start typing in">
      {renderPrintTerminalsSelectField(selectedPrintTerminalId, printTerminals, onListChangeHandler)}
    </DarkModal>
  )
}
