import React, { Component } from 'react';
import moment from 'moment';

import { Timeline } from 'react-calendar-timeline-v2';
import containerResizeDetector from '../../../src/resize-detector/container';

import generateFakeData from '../generate-fake-data';
import './style.css';

const keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
};

export default class App extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData(10, 200);
    const defaultTimeStart = moment().startOf('day').toDate();
    const defaultTimeEnd = moment().startOf('day').add(1, 'day').toDate();
    const width = 80;

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      width,
    };
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd, width } = this.state;

    return (
      <div className='flex-center'>
        <div style={{ width: `${width}%` }}>
          <Timeline
            groups={groups}
            items={items}
            keys={keys}
            sidebarWidth={150}
            sidebarContent={<div>Above The Left er aew rawe rwea rwae</div>}
            rightSidebarWidth={150}
            rightSidebarContent={<div>Above The Right</div>}
            canMove
            canResize='right'
            canSelect
            itemsSorted
            itemTouchSendsClick={false}
            stackItems
            itemHeightRatio={0.75}
            resizeDetector={containerResizeDetector}
            defaultTimeStart={defaultTimeStart}
            defaultTimeEnd={defaultTimeEnd}
          />
        </div>
        <div style={{ flex: `1 1 ${100 - width}%` }}>
          <div style={{ padding: 20 }}>
            The timeline is {width}% wide.
            <br />
            <br />
            Set containers width:
            <br />
            {[20, 40, 60, 80].map((p) => (
              <span
                key={p}
                onClick={() => this.setState({ width: p })}
                style={{
                  cursor: 'pointer',
                  marginLeft: 10,
                  textDecoration: p === width ? 'underline' : 'none',
                }}>
                {p}%
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
