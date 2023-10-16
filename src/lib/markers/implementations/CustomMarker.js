import React from 'react';
import PropTypes from 'prop-types';
import { createMarkerStylesWithLeftOffset, createDefaultRenderer } from './shared';

const defaultCustomMarkerRenderer = createDefaultRenderer('default-customer-marker-id');
/**
 * CustomMarker that is placed based on passed in date prop
 */
class CustomMarker extends React.Component {
  static defaultProps = {
    renderer: defaultCustomMarkerRenderer,
  };
  render() {
    const { date } = this.props;
    const leftOffset = this.props.getLeftOffsetFromDate(date);

    const styles = createMarkerStylesWithLeftOffset(leftOffset);
    return this.props.renderer({ styles, date });
  }
}

CustomMarker.propTypes = {
  getLeftOffsetFromDate: PropTypes.func.isRequired,
  renderer: PropTypes.func,
  date: PropTypes.number.isRequired,
};

export default CustomMarker;
