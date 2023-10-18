import React from 'react';
import PropTypes from 'prop-types';
import { createMarkerStylesWithLeftOffset, createDefaultRenderer } from './shared';
import { MarkerCanvasContext } from '../MarkerCanvasContext';

const defaultRenderer = createDefaultRenderer('default-cursor-marker');

/**
 * CursorMarker implementation subscribes to 'subscribeToCanvasMouseOver' on mount.
 * This subscription is passed in via MarkerCanvasConsumer, which is wired up to
 * MarkerCanvasProvider in the MarkerCanvas component. When the user mouses over MarkerCanvas,
 * the callback registered in CursorMarker (this component) is passed:
 *  leftOffset - pixels from left edge of canvas, used to position this element
 *  date - the date the cursor pertains to
 *  isCursorOverCanvas - whether the user cursor is over the canvas. This is set to 'false'
 *  when the user mouseleaves the element
 */
class CursorMarker extends React.Component {
  static propTypes = {
    subscribeToCanvasMouseOver: PropTypes.func.isRequired,
    renderer: PropTypes.func,
  };

  static defaultProps = {
    renderer: defaultRenderer,
  };

  static contextType = MarkerCanvasContext;

  constructor() {
    super();

    this.state = {
      leftOffset: 0,
      date: 0,
      isShowingCursor: false,
    };
  }

  handleCanvasMouseOver = ({ leftOffset, date, isCursorOverCanvas }) => {
    this.setState({
      leftOffset,
      date,
      isShowingCursor: isCursorOverCanvas,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.context.subscribeToMouseOver(this.handleCanvasMouseOver);
  }

  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  render() {
    const { isShowingCursor, leftOffset, date } = this.state;

    if (!isShowingCursor) return null;

    const styles = createMarkerStylesWithLeftOffset(leftOffset);

    return this.props.renderer({ styles, date });
  }
}

export default CursorMarker;
