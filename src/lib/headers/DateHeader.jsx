import React from 'react'
import memoize from 'memoize-one'

// import PropTypes from 'prop-types'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'
import CustomHeader from './CustomHeader'
import { getNextUnit } from '../utility/calendar'
import { defaultHeaderFormats } from '../default-config'
import { CustomDateHeader } from './CustomDateHeader'

class DateHeader extends React.Component {
  getHeaderUnit = () => {
    if (this.props.unit === 'primaryHeader') {
      return getNextUnit(this.props.timelineUnit)
    } else if (this.props.unit) {
      return this.props.unit
    }
    return this.props.timelineUnit
  }

  getRootStyle = memoize((style) => {
    return {
      height: 30,
      ...style,
    }
  })

  getLabelFormat = (interval, unit, labelWidth) => {
    const { labelFormat } = this.props
    if (typeof labelFormat === 'string') {
      const startTime = interval[0]
      return startTime.format(labelFormat)
    } else if (typeof labelFormat === 'function') {
      return labelFormat(interval, unit, labelWidth)
    } else {
      throw new Error('labelFormat should be function or string')
    }
  }

  getHeaderData = memoize(
    (
      intervalRenderer,
      style,
      className,
      getLabelFormat,
      unitProp,
      headerData,
    ) => {
      return {
        intervalRenderer,
        style,
        className,
        getLabelFormat,
        unitProp,
        headerData,
      }
    },
  )

  render() {
    const unit = this.getHeaderUnit()
    const headerData = this.getHeaderData(
      this.props.intervalRenderer,
      this.getRootStyle(this.props.style),
      this.props.className,
      this.getLabelFormat,
      this.props.unit,
      this.props.headerData,
    )

    return (
      <CustomHeader
        unit={unit}
        height={this.props.height}
        headerData={headerData}
      >
        {CustomDateHeader}
      </CustomHeader>
    )
  }
}

const DateHeaderWrapper = (props) => (
  <TimelineStateConsumer>
    {({ getTimelineState }) => {
      const timelineState = getTimelineState()
      return <DateHeader timelineUnit={timelineState.timelineUnit} {...props} />
    }}
  </TimelineStateConsumer>
)

DateHeaderWrapper.defaultProps = {
  labelFormat: formatLabel,
}

function formatLabel(
  [timeStart, _timeEnd],
  unit,
  labelWidth,
  formatOptions = defaultHeaderFormats,
) {
  let format
  if (labelWidth >= 150) {
    format = formatOptions[unit]['long']
  } else if (labelWidth >= 100) {
    format = formatOptions[unit]['mediumLong']
  } else if (labelWidth >= 50) {
    format = formatOptions[unit]['medium']
  } else {
    format = formatOptions[unit]['short']
  }
  return timeStart.format(format)
}

export default DateHeaderWrapper
