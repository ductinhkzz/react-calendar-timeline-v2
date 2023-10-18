import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PreventClickOnDrag from '../interaction/PreventClickOnDrag';

class GroupRow extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    onContextMenu: PropTypes.func.isRequired,
    isEvenRow: PropTypes.bool.isRequired,
    style: PropTypes.object.isRequired,
    clickTolerance: PropTypes.number.isRequired,
    group: PropTypes.object.isRequired,
    horizontalLineClassNamesForGroup: PropTypes.func,
  };

  render() {
    const {
      onContextMenu,
      onDoubleClick,
      isEvenRow,
      style,
      onClick,
      clickTolerance,
      horizontalLineClassNamesForGroup,
      group,
    } = this.props;

    let classNamesForGroup = [];
    if (horizontalLineClassNamesForGroup) {
      classNamesForGroup = horizontalLineClassNamesForGroup(group);
    }

    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          className={clsx(
            {
              'rct-hl-even': isEvenRow,
              'rct-hl-odd': !isEvenRow,
            },
            classNamesForGroup,
          )}
          style={style}
        />
      </PreventClickOnDrag>
    );
  }
}

export default GroupRow;
