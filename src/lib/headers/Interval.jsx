import React from 'react'
import classNames from 'classnames'

import { getNextUnit } from '../utility/calendar'
import { composeEvents } from '../utility/events'

class Interval extends React.PureComponent {
  onIntervalClick = () => {
    const { primaryHeader, interval, unit, showPeriod } = this.props
    if (primaryHeader) {
      const nextUnit = getNextUnit(unit)
      const newStartTime = interval.startTime.clone().startOf(nextUnit)
      const newEndTime = interval.startTime.clone().endOf(nextUnit)
      showPeriod(newStartTime, newEndTime)
    } else {
      showPeriod(interval.startTime, interval.endTime)
    }
  }

  getIntervalProps = (props = {}) => {
    return {
      ...this.props.getIntervalProps({
        interval: this.props.interval,
        ...props,
      }),
      onClick: composeEvents(this.onIntervalClick, props.onClick),
    }
  }

  render() {
    const { intervalText, interval, intervalRenderer, headerData } = this.props
    const Renderer = intervalRenderer
    if (Renderer) {
      return (
        <Renderer
          getIntervalProps={this.getIntervalProps}
          intervalContext={{
            interval,
            intervalText,
          }}
          data={headerData}
        />
      )
    }

    return (
      <div
        data-testid="dateHeaderInterval"
        {...this.getIntervalProps({})}
        className={classNames('rct-dateHeader', {
          'rct-dateHeader-primary': this.props.primaryHeader,
        })}
      >
        <span>{intervalText}</span>
      </div>
    )
  }
}

export default Interval
