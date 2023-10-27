import React, { useMemo, useContext } from 'react'

import { noop } from '../utility/generic'

const defaultContextState = {
  registerScroll: () => {
    console.warn('default registerScroll header used')
    return noop
  },
  rightSidebarWidth: 0,
  leftSidebarWidth: 150,
  timeSteps: {},
}

export const TimelineHeadersContext = React.createContext(defaultContextState)

export function TimelineHeadersProvider({
  children,
  rightSidebarWidth,
  leftSidebarWidth,
  timeSteps,
  registerScroll,
}) {
  const contextValue = useMemo(
    () => ({
      rightSidebarWidth,
      leftSidebarWidth,
      timeSteps,
      registerScroll,
    }),
    [rightSidebarWidth, leftSidebarWidth, timeSteps, registerScroll],
  )

  return (
    <TimelineHeadersContext.Provider value={contextValue}>
      {children}
    </TimelineHeadersContext.Provider>
  )
}

export function TimelineHeadersConsumer(props) {
  const context = useContext(TimelineHeadersContext)
  return props.children(context)
}
