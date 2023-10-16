import PropTypes from 'prop-types';
import React, { Component } from 'react';
import clsx from 'clsx';

import { _get, arraysEqual } from '../utility/generic';

export default class Sidebar extends Component {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    );
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        group,
        isRightSidebar,
      });
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey);
    }
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props;

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys;

    const sidebarStyle = {
      width: `${width}px`,
      height: `${height}px`,
    };

    const groupsStyle = {
      width: `${width}px`,
    };

    const groupLines = this.props.groups.map((group, index) => {
      const elementStyle = {
        height: `${groupHeights[index]}px`,
        lineHeight: `${groupHeights[index]}px`,
      };

      const classNamePrefix = index % 2 === 0 ? 'even' : 'odd';

      return (
        <div
          key={_get(group, groupIdKey)}
          className={clsx('rct-sidebar-row', `rct-sidebar-row-${classNamePrefix}`)}
          style={elementStyle}
        >
          {this.renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey)}
        </div>
      );
    });

    return (
      <div className={clsx('rct-sidebar', { 'rct-sidebar-right': isRightSidebar })} style={sidebarStyle}>
        <div style={groupsStyle}>{groupLines}</div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  groupHeights: PropTypes.array.isRequired,
  keys: PropTypes.object.isRequired,
  groupRenderer: PropTypes.func,
  isRightSidebar: PropTypes.bool,
};
