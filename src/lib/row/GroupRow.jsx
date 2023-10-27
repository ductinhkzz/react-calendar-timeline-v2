import React, { Component } from 'react'
import classNames from 'classnames'

import PreventClickOnDrag from '../interaction/PreventClickOnDrag'

class GroupRow extends Component {
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
    } = this.props

    const classNamesForGroup = horizontalLineClassNamesForGroup?.(group)

    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          className={classNames(
            {
              'rct-hl-even': isEvenRow,
              'rct-hl-odd': !isEvenRow,
            },
            classNamesForGroup,
          )}
          style={style}
        />
      </PreventClickOnDrag>
    )
  }
}

export default GroupRow
