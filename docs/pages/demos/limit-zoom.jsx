import moment from 'moment';
import { Timeline, CustomHeader, DateHeader, SidebarHeader, TimelineHeaders } from 'react-calendar-timeline-v2';
import { useState } from 'react';

import generateFakeData from '../generate-fake-data';

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
  groupLabelKey: 'title',
};

const defaultHeaderFormats = {
  year: {
    long: 'YYYY',
    mediumLong: 'YYYY',
    medium: 'YYYY',
    short: 'YY',
  },
  month: {
    long: 'MMMM YYYY',
    mediumLong: 'MMMM',
    medium: 'MMMM',
    short: 'MM/YY',
  },
  week: {
    long: 'w',
    mediumLong: 'w',
    medium: 'w',
    short: 'w',
  },
  day: {
    long: 'dddd, ll',
    mediumLong: 'ddd, l',
    medium: 'dd D',
    short: 'D',
  },
  hour: {
    long: 'dddd, LL, HH:00',
    mediumLong: 'L, HH:00',
    medium: 'HH:00',
    short: 'HH',
  },
  minute: {
    long: 'HH:mm',
    mediumLong: 'HH:mm',
    medium: 'HH:mm',
    short: 'mm',
  },
  second: {
    long: 'mm:ss',
    mediumLong: 'mm:ss',
    medium: 'mm:ss',
    short: 'ss',
  },
};

const LimitZoom = () => {
  const [state, setState] = useState(() => generateFakeData(30, 500, 500));
  const defaultTimeStart = moment().startOf('day').subtract(10, 'day').toDate();
  const defaultTimeEnd = moment().startOf('day').add(20, 'day').toDate();

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = state;

    const group = groups[newGroupOrder];

    setState((pre) => ({
      ...pre,
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            })
          : item
      ),
    }));

    console.log('Moved', itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    const { items } = state;
    setState((pre) => ({
      ...pre,
      items: items.map((item) =>
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

  function formatLabel([timeStart, timeEnd], unit, labelWidth) {
    let format;

    const unitFormat = defaultHeaderFormats[unit];

    if (!unitFormat) {
      return timeStart.format('DD/MM');
    }

    if (labelWidth >= 150) {
      format = unitFormat['long'];
    } else if (labelWidth >= 100) {
      format = unitFormat['mediumLong'];
    } else if (labelWidth >= 50) {
      format = unitFormat['medium'];
    } else {
      format = unitFormat['short'];
    }

    return timeStart.format(format);
  }

  function weekFormatLabel([timeStart, timeEnd], unit, labelWidth) {
    return timeStart.isoWeekday().toString();
  }

  return (
    <Timeline
      key={Math.random()}
      groups={state.groups}
      items={state.items}
      keys={keys}
      itemsSorted
      itemTouchSendsClick={false}
      stackItems
      itemHeightRatio={0.75}
      showCursorLine
      defaultTimeStart={defaultTimeStart}
      defaultTimeEnd={defaultTimeEnd}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      minZoom={604800000}
      maxZoom={31556736000}
      minResizeWidth={50}
      dragSnap={86400}>
      <TimelineHeaders className='sticky'>
        <SidebarHeader>
          {({ getRootProps }) => {
            return <div {...getRootProps()}>Propject</div>;
          }}
        </SidebarHeader>
        <CustomHeader unit='week'>
          {(props) => {
            const unit = props?.headerContext.unit;
            const intertalLenght = props?.headerContext.intervals.length ?? 0;
            if (unit === 'week' && intertalLenght > 24) {
              return (
                <DateHeader unit='primaryHeader' className='primaryHeader' labelFormat={weekFormatLabel} {...props} />
              );
            }

            return <DateHeader unit='primaryHeader' className='primaryHeader' {...props} />;
          }}
        </CustomHeader>
        <DateHeader className='secondaryHeader' labelFormat={formatLabel} />
      </TimelineHeaders>
    </Timeline>
  );
};

export default LimitZoom;
