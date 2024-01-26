import React, { Component } from "react";
import moment from "moment";

import Timeline, { TodayMarker } from "../node_modules/react-calendar-timeline/lib";

import generateFakeData from "./fake-data";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

export default class App extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData(10, 1);
    const defaultTimeStart = moment()
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("day")
      .add(1, "day")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd
    };
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    const startTime = new Date(dragTime);
  
    startTime.setHours(0, 0 ,0)
    startTime.setDate(1)

    console.log('log - time: ', startTime)

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: startTime.getTime(),
              end: startTime.getTime() + (item.end - item.start),
              group: group.id
            })
          : item
      )
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time
            })
          : item
      )
    });

    console.log("Resized", itemId, time, edge);
  };

  onTimeChange = (start, end, fn) => {
    fn(start, start + 12 * 30 * 24 * 60 * 60* 1000)
  }

  onCanvasClick = (itemId, time, edge) => {
    console.log(itemId, time, edge)

    console.log('log - items', this.state.items)

    const items = [...this.state.items, {
      id: Date.now(),
      group: itemId,
      start: time,
      end: time + 5184378274,
      title: 'new'
    }]

    this.setState({
      ...this.state, items
    })
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;

    return (
      <Timeline
        // timeSteps={{ month: 1, year: 1 }}
        // minZoom={60 * 60 * 1000}
        defaultTimeStart={new Date('2024-01-01')}
        defaultTimeEnd={new Date('2025-01-01')}
        traditionalZoom={false}
        // minResizeWidth={1000}
        // clickTolerance={100}
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        canMove={true}
        canResize={"both"}
        onItemMove={this.handleItemMove}
        onItemResize={this.handleItemResize}
        onTimeChange={this.onTimeChange}
        lineHeight={50}
        onCanvasClick={this.onCanvasClick}
        canChangeGroup={false}
      >
      </Timeline>
    );
  }
}
