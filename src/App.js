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

    startTime.setHours(0, 0, 0)
    startTime.setDate(1)

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
  };

  onTimeChange = (start, end, fn) => {
    fn(start, start + 12 * 30 * 24 * 60 * 60 * 1000)
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

  swapElements = (array, index1, index2) => {
    array[index1] = array.splice(index2, 1, array[index1])[0];
  };

  onDragStart = (id) => (e) => {
    e
      .dataTransfer
      .setData('text/plain', id);
  }

  onDragEnter = (e) => {
    e.preventDefault()
    return true
  }

  onDrop = (id) => (e) => {
    // console.log('log - drop:', id, e.dataTransfer.getData('text/plain'))
    // console.log(this.state.groups)

    const groups = [...this.state.groups]

    const index = groups.findIndex((group) => group.id === id)
    const index2 = groups.findIndex((group) => group.id === e.dataTransfer.getData('text/plain'))

    this.swapElements(groups, index, index2)

    this.setState({ ...this.state, groups })

    console.log('log - groups', this.state.groups)
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
        groupRenderer={({ group }) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }} onDrop={this.onDrop(group.id)} onDragOver={this.onDragEnter}>
              <span>{group.title}</span>
              <span draggable style={{ cursor: 'move' }} onDragStart={this.onDragStart(group.id)}>move</span>
            </div>
          );
        }}
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
