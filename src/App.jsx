import { useState, useEffect } from "react";

import Timeline, {
  TimelineHeaders,
  DateHeader
}  from "react-calendar-timeline";

import { Item } from './Item';

import { root } from "./main";
import { Header } from "./Header";
import { Group } from "./Group";

const KEYS = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

export function App() {
  const [items, setItems] = useState(JSON.parse(root.dataset.items));
  const [groups, setGroups] = useState(JSON.parse(root.dataset.groups));

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groups[newGroupOrder];

    const startTime = new Date(dragTime);

    const _items = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start: startTime.getTime(),
            end: startTime.getTime() + (item.end - item.start),
            group: group.id,
          })
        : item
    );

    const event = new CustomEvent("modify:items", { detail: _items });

    root.dispatchEvent(event);
  };

  const handleItemResize = (itemId, time, edge) => {
    const _items = items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
            start: edge === "left" ? time : item.start,
            end: edge === "left" ? item.end : time,
          })
        : item
    );

    const event = new CustomEvent("modify:items", { detail: _items });

    root.dispatchEvent(event);
  };

  const onTimeChange = (start, end, fn) => {
    console.log('onTimeChange')
    fn(start, start + 12 * 30 * 24 * 60 * 60 * 1000);
  };

  const onCanvasClick = (group, time) => {
    const event = new CustomEvent("add:items", {
      detail: { group, time },
    });

    root.dispatchEvent(event);
  };

  // const onDragStart = (id) => (e) => {
  //   e.dataTransfer.setData("id", id);
  // };

  // const onDragEnter = (e) => {
  //   e.preventDefault();
  //   return true;
  // };

  // const onDrop = (id) => (e) => {
  //   const _groups = [...groups];

  //   const transferId = e.dataTransfer.getData("id");

  //   const index1 = _groups.findIndex((group) => group.id === id);
  //   const index2 = _groups.findIndex((group) => group.id === transferId);

  //   _groups[index1] = _groups.splice(index2, 1, _groups[index1])[0];

  //   const event = new CustomEvent("modify:groups", { detail: _groups });

  //   root.dispatchEvent(event);
  // };

  useEffect(() => {
    const onChangeItems = () => setItems(JSON.parse(root.dataset.items));
    const onChangeGroups = () => setGroups(JSON.parse(root.dataset.groups));

    root.addEventListener("sync:items", onChangeItems);
    root.addEventListener("sync:groups", onChangeGroups);

    return () => {
      root.removeEventListener("sync:items", onChangeItems);
      root.removeEventListener("sync:groups", onChangeGroups);
    };
  });

  return (
    <Timeline
      defaultTimeStart={new Date("2024-01-01")}
      defaultTimeEnd={new Date("2025-01-01")}
      traditionalZoom={false}
      groupRenderer={Group}
      itemHeightRatio={0.75}
      groups={groups}
      items={items}
      keys={KEYS}
      fullUpdate
      useResizeHandle
      itemTouchSendsClick={false}
      stackItems
      canMove={true}
      canResize={"both"}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onTimeChange={onTimeChange}
      lineHeight={50}
      onCanvasDoubleClick={onCanvasClick}
      canChangeGroup={false}
      itemRenderer={Item}
    >
      <TimelineHeaders className="sticky">
          {/* <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}>Left</div>;
            }}
          </SidebarHeader> */}
          {/* <DateHeader unit="primaryHeader" /> */}
          <DateHeader labelFormat="YYYY年M月" intervalRenderer={Header} />
        </TimelineHeaders>
    </Timeline>
  );
}
