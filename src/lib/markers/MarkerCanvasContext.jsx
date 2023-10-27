import React, { createContext, useContext } from 'react'

const defaultContextState = {
  subscribeToMouseOver: () => {
    console.warn('"subscribeToMouseOver" default func is being used')
  },
}

const MarkerCanvasContext = createContext(defaultContextState)

export function MarkerCanvasProvider(props) {
  return (
    <MarkerCanvasContext.Provider value={props.value}>
      {props.children}
    </MarkerCanvasContext.Provider>
  )
}

export function MarkerCanvasConsumer(props) {
  const context = useContext(MarkerCanvasContext)
  return props.children(context)
}
