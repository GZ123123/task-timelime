import { useState, useEffect, useMemo } from "react";

import Timeline, { TimelineHeaders, DateHeader } from "./components/Timeline";

import { Item } from "./components/Custom/Item";

import { root } from "./main";
import { Header } from "./components/Custom/Header";
import { Group } from "./components/Custom/Group";
import { GROUP_TYPES, MODES } from "./constants";

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

const CONFIGS = {
  traditionalZoom: false,
  itemHeightRatio: 0.75,
  itemTouchSendsClick: false,
  canMove: false,
  canResize: false,
  lineHeight: 56,
  canChangeGroup: false,
  fullUpdate: true,
  useResizeHandle: false,
  stackItems: true,
};

const emit = (name, value) => {
  const event = new CustomEvent(name, { detail: value });

  root.dispatchEvent(event);
}

export function App() {
  const [items, setItems] = useState(JSON.parse(root.dataset["items"] ?? "[]"));
  const [groups, setGroups] = useState(
    JSON.parse(root.dataset["groups"] ?? "[]")
  );
  const [mode, setMode] = useState(JSON.parse(root.dataset["mode"] ?? '"edit"'));

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groupList[newGroupOrder];

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

    emit("modify:items", _items)
  };

  // const handleItemResize = (itemId, time, edge) => {
  //   const _items = items.map((item) => {
  //     const start = edge === "left" ? time : item.start;
  //     const end = edge === "left" ? item.end : time;

  //     return item.id === itemId
  //       ? Object.assign({}, item, { start, end })
  //       : item;
  //   });

  //   emit("modify:items", _items)
  // };

  const onTimeChange = (start, end, fn) => fn(start, start + 12 * 30 * 24 * 60 * 60 * 1000)

  const onItemDoubleClick = (e) => {
    emit("select:item", e)
  };

  const onSwapGroup = (source, target) => {
    const sourceIndex = groups.findIndex((group) => group.id === source);
    const targetIndex = groups.findIndex((group) => group.id === target);

    groups[sourceIndex] = groups.splice(targetIndex, 1, groups[sourceIndex])[0];

    emit("edit:items", groups)
  };

  const onChange = (v) => {
    const index = groups.findIndex((group) => group.id === v.id);
    groups[index].title = v.title;

    emit("edit:items", groups)
  };

  const onCreateItem = (group, time) => {
    emit("create:item", { group, time })
  }

  const onCreateGroup = () => {
    emit("create:group", null)
  }

  const groupList = useMemo(() => {
    if (mode !== MODES.EDIT) return groups;

    return [
      ...groups,
      { id: "create-button", title: "工程を追加", type: GROUP_TYPES.ADD_BUTTON },
    ];
  }, [groups, mode]);

  const itemList = useMemo(() => {
    return [...items];
  }, [items]);

  useEffect(() => {
    const onChangeItems = () => setItems(JSON.parse(root.dataset.items));
    const onChangeGroups = () => setGroups(JSON.parse(root.dataset.groups));
    const onChangeMode = () => setMode(JSON.parse(root.dataset.mode));

    root.addEventListener("sync:items", onChangeItems);
    root.addEventListener("sync:groups", onChangeGroups);
    root.addEventListener("sync:mode", onChangeMode);

    return () => {
      root.removeEventListener("sync:items", onChangeItems);
      root.removeEventListener("sync:groups", onChangeGroups);
      root.removeEventListener("sync:mode", onChangeMode);
    };
  }, []);

  return (
    <Timeline
      mode={mode}
      defaultTimeStart={new Date("2024-01-01")}
      defaultTimeEnd={new Date("2025-01-01")}
      groups={groupList}
      items={itemList}
      keys={KEYS}
      {...CONFIGS}
      onItemMove={handleItemMove}
      // onItemResize={handleItemResize}
      onTimeChange={onTimeChange}
      onItemDoubleClick={onItemDoubleClick}
      onCanvasDoubleClick={onCreateItem}
      itemRenderer={Item}
      groupRenderer={(props) => (
        <Group {...props} onSwapGroup={onSwapGroup} onChange={onChange} onCreateGroup={onCreateGroup}/>
      )}
    >
      <TimelineHeaders className="sticky">
        <DateHeader labelFormat="YYYY年M月" intervalRenderer={Header} />
      </TimelineHeaders>
    </Timeline>
  );
}
