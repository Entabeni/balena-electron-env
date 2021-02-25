import React from 'react'

// Component
import { DarkModal } from '../'

export default function ExistingSaleSelectionModal({ title, buttons, message, messageStyling, onClose, sizing }) {
  return <DarkModal sizing={sizing} buttons={buttons} className="custom-ui" message={message} messageStyling={messageStyling} onClick={onClose} title={title} />
}
