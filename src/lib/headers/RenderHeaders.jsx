import React from 'react'
import TimelineHeaders from './TimelineHeaders'
import DateHeader from './DateHeader'

const RenderHeaders = ({ children, isTimelineHeader }) => {
  if (children) {
    let headerRenderer
    React.Children.map(children, (child) => {
      if (isTimelineHeader(child)) {
        headerRenderer = child
      }
    })
    if (headerRenderer) {
      return headerRenderer
    }
  }
  return (
    <TimelineHeaders>
      <DateHeader unit="primaryHeader" className="primaryHeader" />
      <DateHeader className="secondaryHeader" />
    </TimelineHeaders>
  )
}

export default RenderHeaders
