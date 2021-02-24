import React, { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import styled from 'styled-components'

const TimerWrapper = styled.div`
  position: absolute;
  left: 0.5rem;
  right: auto;

  span {
    border-radius: 3px;
    border-style: solid;
    border-width: 2px;
    font-size: 0.9rem;
    padding: 0.1rem 0.5rem;
  }

  .counting-mssg.on-going {
    background-color: #e4fcef;
    border-color: #30a171;
    color: #30a171;
  }

  .counting-mssg.timing-out,
  .timeout-mssg {
    background-color: ${props => props.theme.redTint};
    border-color: ${props => props.theme.redShade};
    color: ${props => props.theme.redShade};
  }
`

const timerTypes = {
  ORDER: '__orderTOD'
}

export const CountDownTimer = ({ customTimeUpMssg, onTimeOut: handleTimeOut, timeOut, timerID, timerMssg, timerType }) => {
  let timer
  const localStorageKeyName = `${timerTypes[timerType]}-${timerID}`
  const interval = 1000
  const [timeLeft, setTimeLeft] = useState(null)
  const [showTimeIsUpMssg, setShowTimeIsUpMssg] = useState(false)

  const clearingTimer = () => {
    clearInterval(timer)
    window.localStorage.removeItem(localStorageKeyName)
  }

  const timeIsUp = () => {
    setShowTimeIsUpMssg(true)
    clearingTimer()

    if (handleTimeOut) {
      handleTimeOut()
    }
  }

  useEffect(() => {
    let timeOutDate = window.localStorage.getItem(localStorageKeyName)

    if (!timeOutDate) {
      if (/String/.test(Object.prototype.toString.call(timeOut))) {
        timeOutDate = moment(timeOut).toString()
      } else {
        timeOutDate = moment()
          .add(timeOut, 'minutes')
          .toString()
      }
      window.localStorage.setItem(localStorageKeyName, timeOutDate)
    } else if (/String/.test(Object.prototype.toString.call(timeOut)) && moment(timeOut).toString() !== timeOutDate) {
      timeOutDate = moment(timeOut).toString()
    }

    timer = setInterval(() => {
      let diff = moment(timeOutDate).diff(moment())
      if (diff <= 0) {
        clearInterval(timer)
        timeIsUp()
      } else {
        setTimeLeft(diff)
        setShowTimeIsUpMssg(false)
      }
    }, interval)

    return () => {
      clearingTimer()
    }
  }, [timeOut])

  return !timeLeft ? null : (
    <TimerWrapper>
      {showTimeIsUpMssg && <span className="timeout-mssg">{customTimeUpMssg || 'Time is up!'}</span>}
      {!showTimeIsUpMssg && (
        <span className={`counting-mssg ${timeLeft > 60000 ? 'on-going' : 'timing-out'}`}>
          {`${timerMssg || 'Time left'} ${moment.utc(timeLeft).format('HH:mm:ss')}`}
        </span>
      )}
    </TimerWrapper>
  )
}
