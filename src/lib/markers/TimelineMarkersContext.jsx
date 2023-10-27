import React, { useState, useContext } from 'react'

import { noop } from '../utility/generic'

const defaultContextState = {
  markers: [],
  subscribeMarker: () => {
    console.warn('default subscribe marker used')
    return noop
  },
}

const TimelineMarkersContext = React.createContext(defaultContextState)

// REVIEW: is this the best way to manage ids?
let _id = 0
const createId = () => {
  _id += 1
  return _id + 1
}

export function TimelineMarkersProvider(props) {
  const [markers, setMarkers] = useState([])

  const handleSubscribeToMarker = (newMarker) => {
    const _newMarker = {
      ...newMarker,
      // REVIEW: in the event that we accept id to be passed to the Marker components, this line would override those
      id: createId(),
    }

    setMarkers((pre) => [...pre, _newMarker])

    return {
      unsubscribe: () => {
        setMarkers((pre) => pre.filter((marker) => marker.id !== newMarker.id))
      },
      getMarker: () => {
        return _newMarker
      },
    }
  }

  const handleUpdateMarker = (updateMarker) => {
    const markerIndex = markers.findIndex(
      (marker) => marker.id === updateMarker.id,
    )
    if (markerIndex < 0) return

    setMarkers((pre) => [
      ...pre.slice(0, markerIndex),
      updateMarker,
      ...pre.slice(markerIndex + 1),
    ])
  }

  const contextValue = {
    markers,
    subscribeMarker: handleSubscribeToMarker,
    updateMarker: handleUpdateMarker,
  }

  return (
    <TimelineMarkersContext.Provider value={contextValue}>
      {props.children}
    </TimelineMarkersContext.Provider>
  )
}

export function TimelineMarkersConsumer(props) {
  const timelineMarkersContext = useContext(TimelineMarkersContext)
  return props.children(timelineMarkersContext)
}
