/* eslint-disable no-console */
import React, { Component } from 'react';
import moment from 'moment';

import { Timeline, TimelineMarkers, TodayMarker, CustomMarker, CursorMarker } from 'react-calendar-timeline-v2';

import generateFakeData from '../generate-fake-data';

const minTime = moment().add(-6, 'months').valueOf();
const maxTime = moment().add(6, 'months').valueOf();

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

const ControlledSelect = () => {
  const [data, setData] = React.useState(() => generateFakeData());
  const [selected, setSelected] = React.useState(undefined);

  const defaultTimeStart = moment().startOf('day').toDate();
  const defaultTimeEnd = moment().startOf('day').add(1, 'day').toDate();

  const handleCanvasClick = (groupId, time) => {
    console.log('Canvas clicked', groupId, moment(time).format());
  };

  const handleCanvasDoubleClick = (groupId, time) => {
    console.log('Canvas double clicked', groupId, moment(time).format());
  };

  const handleCanvasContextMenu = (group, time) => {
    console.log('Canvas context menu', group, moment(time).format());
  };

  const handleItemClick = (itemId, _, time) => {
    console.log('Clicked: ' + itemId, moment(time).format());
  };

  const handleItemSelect = (itemId, _, time) => {
    setSelected([itemId]);
    console.log('Selected: ' + itemId, moment(time).format());
  };

  const handleItemDeselect = () => {
    setSelected(undefined);
  };

  const handleItemDoubleClick = (itemId, _, time) => {
    console.log('Double Click: ' + itemId, moment(time).format());
  };

  const handleItemContextMenu = (itemId, _, time) => {
    console.log('Context Menu: ' + itemId, moment(time).format());
  };

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    setData((pre) => ({
      ...pre,
      items: pre.items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: pre.groups[newGroupOrder].id,
            })
          : item
      ),
    }));

    console.log('Moved', itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    setData((pre) => ({
      ...pre,
      items: pre.items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time,
            })
          : item
      ),
    }));

    console.log('Resized', itemId, time, edge);
  };

  // this limits the timeline to -6 months ... +6 months
  const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  const moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      var newTime = Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  return (
    <Timeline
      key={Math.random()}
      groups={data.groups}
      items={data.items}
      keys={keys}
      sidebarWidth={150}
      sidebarContent={<div>Above The Left</div>}
      canMove
      canResize='right'
      canSelect
      itemsSorted
      itemTouchSendsClick={false}
      stackItems
      itemHeightRatio={0.75}
      defaultTimeStart={defaultTimeStart}
      defaultTimeEnd={defaultTimeEnd}
      onCanvasClick={handleCanvasClick}
      onCanvasDoubleClick={handleCanvasDoubleClick}
      onCanvasContextMenu={handleCanvasContextMenu}
      onItemClick={handleItemClick}
      onItemSelect={handleItemSelect}
      onItemContextMenu={handleItemContextMenu}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onItemDoubleClick={handleItemDoubleClick}
      onTimeChange={handleTimeChange}
      moveResizeValidator={moveResizeValidator}
      selected={selected}
      onItemDeselect={handleItemDeselect}>
      <TimelineMarkers>
        <TodayMarker />
        <CustomMarker date={moment().startOf('day').valueOf() + 1000 * 60 * 60 * 2} />
        <CustomMarker date={moment().add(3, 'day').valueOf()}>
          {({ styles }) => {
            const newStyles = { ...styles, backgroundColor: 'blue' };
            return <div style={newStyles} />;
          }}
        </CustomMarker>
        <CursorMarker />
      </TimelineMarkers>
    </Timeline>
  );
};

export default ControlledSelect;
