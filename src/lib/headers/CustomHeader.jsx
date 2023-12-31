import React from 'react'

import { TimelineHeadersConsumer } from './HeadersContext'
import { TimelineStateConsumer } from '../timeline/TimelineStateContext'
import { iterateTimes } from '../utility/calendar'

export class CustomHeader extends React.Component {
  constructor(props) {
    super(props)
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      unit,
      timeSteps,
      showPeriod,
      getLeftOffsetFromDate,
    } = props

    const intervals = this.getHeaderIntervals({
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      unit,
      timeSteps,
      showPeriod,
      getLeftOffsetFromDate,
    })

    this.state = {
      intervals,
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.canvasTimeStart !== this.props.canvasTimeStart ||
      nextProps.canvasTimeEnd !== this.props.canvasTimeEnd ||
      nextProps.canvasWidth !== this.props.canvasWidth ||
      nextProps.unit !== this.props.unit ||
      nextProps.timeSteps !== this.props.timeSteps ||
      nextProps.showPeriod !== this.props.showPeriod ||
      nextProps.children !== this.props.children ||
      nextProps.headerData !== this.props.headerData
    ) {
      return true
    }
    return false
  }

  getHeaderIntervals = ({
    canvasTimeStart,
    canvasTimeEnd,
    unit,
    timeSteps,
    getLeftOffsetFromDate,
  }) => {
    const intervals = []
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      timeSteps,
      (startTime, endTime) => {
        const left = getLeftOffsetFromDate(startTime.valueOf())
        const right = getLeftOffsetFromDate(endTime.valueOf())
        const width = right - left
        intervals.push({
          startTime,
          endTime,
          labelWidth: width,
          left,
        })
      },
    )
    return intervals
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.canvasTimeStart !== prevState.prevCanvasTimeStart ||
      nextProps.canvasTimeEnd !== prevState.prevCanvasTimeEnd ||
      nextProps.canvasWidth !== prevState.prevCanvasWidth ||
      nextProps.unit !== prevState.prevUnit ||
      nextProps.timeSteps !== prevState.prevTimeSteps ||
      nextProps.showPeriod !== prevState.prevShowPeriod
    ) {
      const {
        canvasTimeStart,
        canvasTimeEnd,
        unit,
        timeSteps,
        getLeftOffsetFromDate,
      } = nextProps

      const intervals = []
      iterateTimes(
        canvasTimeStart,
        canvasTimeEnd,
        unit,
        timeSteps,
        (startTime, endTime) => {
          const left = getLeftOffsetFromDate(startTime.valueOf())
          const right = getLeftOffsetFromDate(endTime.valueOf())
          const width = right - left
          intervals.push({
            startTime,
            endTime,
            labelWidth: width,
            left,
          })
        },
      )

      return {
        intervals,
        prevCanvasTimeStart: nextProps.canvasTimeStart,
        prevCanvasTimeEnd: nextProps.canvasTimeEnd,
        prevCanvasWidth: nextProps.canvasWidth,
        prevUnit: nextProps.unit,
        prevTimeSteps: nextProps.timeSteps,
        prevShowPeriod: nextProps.showPeriod,
      }
    }

    return null
  }

  getRootProps = (props = {}) => {
    const { style } = props
    return {
      style: Object.assign({}, style ? style : {}, {
        width: this.props.canvasWidth,
        height: this.props.height,
      }),
    }
  }

  getIntervalProps = (props = {}) => {
    const { interval, style } = props
    if (!interval)
      throw new Error('you should provide interval to the prop getter')
    const { startTime, labelWidth, left } = interval
    return {
      style: this.getIntervalStyle({
        style,
        startTime,
        labelWidth,
        canvasTimeStart: this.props.canvasTimeStart,
        unit: this.props.unit,
        left,
      }),
      key: `label-${startTime.valueOf()}`,
    }
  }

  getIntervalStyle = ({ left, labelWidth, style }) => {
    return {
      ...style,
      left: left - 1,
      width: labelWidth,
    }
  }

  getStateAndHelpers = () => {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      unit,
      showPeriod,
      timelineWidth,
      visibleTimeStart,
      visibleTimeEnd,
      headerData,
    } = this.props
    //TODO: only evaluate on changing params
    return {
      timelineContext: {
        timelineWidth,
        visibleTimeStart,
        visibleTimeEnd,
        canvasTimeStart,
        canvasTimeEnd,
      },
      headerContext: {
        unit,
        intervals: this.state.intervals,
      },
      getRootProps: this.getRootProps,
      getIntervalProps: this.getIntervalProps,
      showPeriod,
      data: headerData,
    }
  }

  render() {
    const props = this.getStateAndHelpers()
    const Renderer = this.props.children
    return <Renderer {...props} />
  }
}

const CustomHeaderWrapper = ({ children, unit, headerData, height }) => (
  <TimelineStateConsumer>
    {({ getTimelineState, showPeriod, getLeftOffsetFromDate }) => {
      const timelineState = getTimelineState()
      return (
        <TimelineHeadersConsumer>
          {({ timeSteps }) => (
            <CustomHeader
              timeSteps={timeSteps}
              showPeriod={showPeriod}
              unit={unit ? unit : timelineState.timelineUnit}
              {...timelineState}
              headerData={headerData}
              getLeftOffsetFromDate={getLeftOffsetFromDate}
              height={height}
            >
              {children}
            </CustomHeader>
          )}
        </TimelineHeadersConsumer>
      )
    }}
  </TimelineStateConsumer>
)

CustomHeaderWrapper.defaultProps = {
  height: 30,
}

export default CustomHeaderWrapper
