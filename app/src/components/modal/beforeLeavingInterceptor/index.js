import React from 'react'
import { confirmAlert } from 'react-confirm-alert'

// Components
import { DarkModalLayout } from 'es-components'

// Global store for mapping the different interceptor triggering instances with their respective buttons callbacks
export const interceptorGlobalKeyNames = {
  orderComplete: '__ent__pos__ord__comp__int',
  cashOut: '__ent__pos__cashout__int',
  cashOutMethod: '__ent__pos__cashout__method__int',
  logOut: '__ent__pos__logout__int',
  logOutMethod: '__ent__pos__logout__method__int',
  logOutTriggerFlag: '__trig__from__logout'
}

const beforeLeavingInterceptor = (configStr, callback) => {
  // Modal config passed in as a String from React Router's Prompt component
  const { customButtons, customCSSClassName, customMessage, customMessageStyling, customTitle, customTitleHint } = JSON.parse(configStr)
  // Optional custom CSS styling for the modal's inner message
  const messageStyling = customMessageStyling || {
    lineHeight: '2.5rem',
    size: '1.5rem',
    textAlign: 'center'
  }
  // Optional custom buttons set to be rendered after the modal's inner message
  const buttons = [
    {
      label: (customButtons && customButtons.accept && customButtons.accept.label) || 'Yes, continue',
      onClick: () => {
        if (customButtons && customButtons.accept && customButtons.accept.callback) {
          const btnCallback = window[customButtons.accept.callback]
          if (btnCallback) {
            btnCallback.accept()
          }
        }
        callback(true)
      }
    },
    {
      label: (customButtons && customButtons.decline && customButtons.decline.label) || 'No, cancel',
      onClick: () => {
        if (customButtons && customButtons.decline && customButtons.decline.callback) {
          const btnCallback = window[customButtons.decline.callback]
          if (btnCallback) {
            btnCallback.decline()
          }
        }
        callback(false)
      }
    }
  ]

  // React Confirm Alert generic invokation with our Dark Modal custom component
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <DarkModalLayout
          buttons={buttons}
          className={customCSSClassName || 'custom-ui'}
          message={
            customMessage || (
              <React.Fragment>
                Are you sure you want to leave?
                <br />
                You could permanently lose your changes.
              </React.Fragment>
            )
          }
          messageStyling={messageStyling}
          onClick={onClose}
          title={customTitle || 'Please review and confirm'}
          titleHint={customTitleHint || 'You have unsaved changes'}
        />
      )
    }
  })
}

export default beforeLeavingInterceptor
