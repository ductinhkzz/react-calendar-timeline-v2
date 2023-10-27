import React, { useContext } from 'react'

import {
  calculateXPositionForTime,
  calculateTimeForXPosition,
} from '../utility/calendar'

/* this context will hold all information regarding timeline state:
  1. timeline width
  2. visible time start and end
  3. canvas time start and end
  4. helpers for calculating left offset of items (and really...anything)
*/

/* eslint-disable no-console */
const defaultContextState = {
  getTimelineState: () => {
    console.warn('"getTimelineState" default func is being used')
  },
  getLeftOffsetFromDate: () => {
    console.warn('"getLeftOffsetFromDate" default func is being used')
  },
  getDateFromLeftOffsetPosition: () => {
    console.warn('"getDateFromLeftOffsetPosition" default func is being used')
  },
  showPeriod: () => {
    console.warn('"showPeriod" default func is being used')
  },
}
/* eslint-enable */

const TimelineStateContext = React.createContext(defaultContextState)

export function TimelineStateProvider(props) {
  const {
    children,
    visibleTimeStart,
    visibleTimeEnd,
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    showPeriod,
    timelineUnit,
    timelineWidth,
  } = props

  const getTimelineState = () => {
    return {
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      timelineUnit,
      timelineWidth,
    } // REVIEW,
  }

  const getLeftOffsetFromDate = (date) => {
    return calculateXPositionForTime(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      date,
    )
  }

  const getDateFromLeftOffsetPosition = (leftOffset) => {
    return calculateTimeForXPosition(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      leftOffset,
    )
  }

  const timelineContext = {
    getTimelineState,
    getLeftOffsetFromDate,
    getDateFromLeftOffsetPosition,
    showPeriod,
  }

  return (
    <TimelineStateContext.Provider value={timelineContext}>
      {children}
    </TimelineStateContext.Provider>
  )
}

export function TimelineStateConsumer(props) {
  const timelineContext = useContext(TimelineStateContext)
  return props.children(timelineContext)
}
