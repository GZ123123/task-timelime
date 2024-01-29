import { useEffect, useState } from "preact/hooks";

import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/lib/Timeline.css";

import { root } from "./main";

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

    startTime.setHours(0, 0, 0);
    startTime.setDate(1);

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
    fn(start, start + 12 * 30 * 24 * 60 * 60 * 1000);
  };

  const onCanvasClick = (group, time, edge) => {
    const event = new CustomEvent("add:items", {
      detail: { group, time, edge },
    });

    root.dispatchEvent(event);
  };

  const onDragStart = (id) => (e) => {
    e.dataTransfer.setData("id", id);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    return true;
  };

  const onDrop = (id) => (e) => {
    const _groups = [...groups];

    const transferId = e.dataTransfer.getData("id");

    const index1 = _groups.findIndex((group) => group.id === id);
    const index2 = _groups.findIndex((group) => group.id === transferId);

    _groups[index1] = _groups.splice(index2, 1, _groups[index1])[0];

    const event = new CustomEvent("modify:groups", { detail: _groups });

    root.dispatchEvent(event);
  };

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
      groupRenderer={({ group }) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
            onDrop={onDrop(group.id)}
            onDragOver={onDragEnter}
          >
            <span>{group.title}</span>
            <span
              draggable
              style={{ cursor: "move" }}
              onDragStart={onDragStart(group.id)}
            >
              m
            </span>
          </div>
        );
      }}
      groups={groups}
      items={items}
      keys={KEYS}
      fullUpdate
      itemTouchSendsClick={false}
      stackItems
      canMove={true}
      canResize={"both"}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onTimeChange={onTimeChange}
      lineHeight={50}
      onCanvasClick={onCanvasClick}
      canChangeGroup={false}
    />
  );
}
