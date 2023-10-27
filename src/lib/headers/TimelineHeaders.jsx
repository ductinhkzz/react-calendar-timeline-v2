import React from 'react'
import classNames from 'classnames'

import { TimelineHeadersConsumer } from './HeadersContext'
import SidebarHeader from './SidebarHeader'
import { RIGHT_VARIANT } from './constants'
class TimelineHeaders extends React.Component {
  constructor(props) {
    super(props)
  }

  getRootStyle = () => {
    return {
      ...this.props.style,
      display: 'flex',
      width: '100%',
    }
  }

  getCalendarHeaderStyle = () => {
    const { leftSidebarWidth, rightSidebarWidth, calendarHeaderStyle } =
      this.props
    return {
      ...calendarHeaderStyle,
      width: `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)`,
    }
  }

  handleRootRef = (element) => {
    if (this.props.headerRef) {
      this.props.headerRef(element)
    }
  }

  /**
   * check if child of type SidebarHeader
   * refer to for explanation https://github.com/gaearon/react-hot-loader#checking-element-types
   */
  isSidebarHeader = (child) => {
    if (child.type === undefined) return false
    return child.type.secretKey === SidebarHeader.secretKey
  }

  render() {
    let rightSidebarHeader
    let leftSidebarHeader
    const calendarHeaders = []
    const children = Array.isArray(this.props.children)
      ? this.props.children.filter((c) => c)
      : [this.props.children]
    React.Children.forEach(children, (child) => {
      if (this.isSidebarHeader(child)) {
        if (child.props.variant === RIGHT_VARIANT) {
          rightSidebarHeader = child
        } else {
          leftSidebarHeader = child
        }
      } else {
        calendarHeaders.push(child)
      }
    })
    if (!leftSidebarHeader) {
      leftSidebarHeader = <SidebarHeader />
    }
    if (!rightSidebarHeader && this.props.rightSidebarWidth) {
      rightSidebarHeader = <SidebarHeader variant="right" />
    }
    return (
      <div
        ref={this.handleRootRef}
        data-testid="headerRootDiv"
        style={this.getRootStyle()}
        className={classNames('rct-header-root', this.props.className)}
      >
        {leftSidebarHeader}
        <div
          ref={this.props.registerScroll}
          style={this.getCalendarHeaderStyle()}
          className={classNames(
            'rct-calendar-header',
            this.props.calendarHeaderClassName,
          )}
          data-testid="headerContainer"
        >
          {calendarHeaders}
        </div>
        {rightSidebarHeader}
      </div>
    )
  }
}

const TimelineHeadersWrapper = ({
  children,
  style,
  className,
  calendarHeaderStyle,
  calendarHeaderClassName,
}) => (
  <TimelineHeadersConsumer>
    {({ leftSidebarWidth, rightSidebarWidth, registerScroll }) => {
      return (
        <TimelineHeaders
          leftSidebarWidth={leftSidebarWidth}
          rightSidebarWidth={rightSidebarWidth}
          registerScroll={registerScroll}
          style={style}
          className={className}
          calendarHeaderStyle={calendarHeaderStyle}
          calendarHeaderClassName={calendarHeaderClassName}
        >
          {children}
        </TimelineHeaders>
      )
    }}
  </TimelineHeadersConsumer>
)

TimelineHeadersWrapper.secretKey = 'TimelineHeaders'

export default TimelineHeadersWrapper
