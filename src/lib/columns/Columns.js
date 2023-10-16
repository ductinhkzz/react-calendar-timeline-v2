import PropTypes from 'prop-types';
import React, { Component } from 'react';
import clsx from 'clsx';

import { iterateTimes } from '../utility/calendar';
import { TimelineStateConsumer } from '../timeline/TimelineStateContext';

const passThroughPropTypes = {
  canvasTimeStart: PropTypes.number.isRequired,
  canvasTimeEnd: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  lineCount: PropTypes.number.isRequired,
  minUnit: PropTypes.string.isRequired,
  timeSteps: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  verticalLineClassNamesForTime: PropTypes.func,
};

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
      nextProps.verticalLineClassNamesForTime === this.props.verticalLineClassNamesForTime
    );
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
    } = this.props;

    let lines = [];

    iterateTimes(canvasTimeStart, canvasTimeEnd, minUnit, timeSteps, (time, nextTime) => {
      const minUnitValue = time.get(minUnit === 'day' ? 'date' : minUnit);
      const firstOfType = minUnitValue === (minUnit === 'day' ? 1 : 0);

      // TODO: rename or remove class that has reference to vertical-line

      const isCorrectUnit = ['day', 'hour', 'minute'].includes(minUnit);

      const className = clsx(
        'rct-vl',
        {
          'rct-vl-first': firstOfType,
        },
        isCorrectUnit && `rct-day-${time.day()}`,
        verticalLineClassNamesForTime?.(
          time.unix() * 1000, // turn into ms, which is what verticalLineClassNamesForTime expects
          nextTime.unix() * 1000 - 1,
        ),
      );

      const left = getLeftOffsetFromDate(time.valueOf());
      const right = getLeftOffsetFromDate(nextTime.valueOf());
      lines.push(
        <div
          key={`line-${time.valueOf()}`}
          className={className}
          style={{
            left: `${left}px`,
            width: `${right - left}px`,
            height: `${height}px`,
          }}
        />,
      );
    });

    return <div className="rct-vertical-lines">{lines}</div>;
  }
}

Columns.propTypes = {
  ...passThroughPropTypes,
  getLeftOffsetFromDate: PropTypes.func.isRequired,
};

const ColumnsWrapper = ({ ...props }) => {
  return (
    <TimelineStateConsumer>
      {({ getLeftOffsetFromDate }) => <Columns getLeftOffsetFromDate={getLeftOffsetFromDate} {...props} />}
    </TimelineStateConsumer>
  );
};

ColumnsWrapper.defaultProps = {
  ...passThroughPropTypes,
};

export default ColumnsWrapper;
