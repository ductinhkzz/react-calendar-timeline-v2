import React, { Component } from 'react'
import classNames from 'classnames'

import { iterateTimes } from '../utility/calendar'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'

class Columns extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.height === this.props.height &&
      nextProps.verticalLineClassNamesForTime ===
        this.props.verticalLineClassNamesForTime
    )
  }

  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime,
      getLeftOffsetFromDate,
    } = this.props

    const lines = []

    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const minUnitValue = time.get(minUnit === 'day' ? 'date' : minUnit)
        const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0)

        const classNamesForTime = verticalLineClassNamesForTime?.(
          time.unix() * 1000, // turn into ms, which is what verticalLineClassNamesForTime expects
          nextTime.unix() * 1000 - 1,
        )

        const className = classNames(
          'rct-vl',
          firstOfType && 'rct-vl-first',
          minUnit === 'day' ||
            minUnit === 'hour' ||
            (minUnit === 'minute' && `rct-day-${time.day()}`),
          classNamesForTime,
        )

        const left = getLeftOffsetFromDate(time.valueOf())
        const right = getLeftOffsetFromDate(nextTime.valueOf())
        lines.push(
          <div
            key={`line-${time.valueOf()}`}
            className={className}
            style={{
              pointerEvents: 'none',
              top: '0px',
              left: `${left}px`,
              width: `${right - left}px`,
              height: `${height}px`,
            }}
          />,
        )
      },
    )

    return <div className="rct-vertical-lines">{lines}</div>
  }
}

const ColumnsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => (
        <Columns getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />
      )}
    </TimelineStateConsumer>
  )
}

export default ColumnsWrapper
