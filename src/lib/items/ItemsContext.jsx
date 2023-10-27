import React, { createContext, useContext } from 'react'

const defaultContextState = {
  getTimelineContext: () => {
    console.warn('"subscribeToMouseOver" default func is being used')
    return {}
  },
}

export const ItemsContext = createContext(defaultContextState)

export function ItemsProvider(props) {
  return (
    <ItemsContext.Provider value={props.value}>
      {props.children}
    </ItemsContext.Provider>
  )
}

export function ItemsConsumer(props) {
  const context = useContext(ItemsContext)
  return props.children(context)
}
