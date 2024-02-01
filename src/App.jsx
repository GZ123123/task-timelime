import { useState, useEffect, useMemo } from "react";

import Timeline, { TimelineHeaders, DateHeader } from "./components/Timeline";

import { Item } from "./Item";

import { root } from "./main";
import { Header } from "./Header";
import { Group } from "./Group";
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

export function App() {
  const [items, setItems] = useState(JSON.parse(root.dataset["items"] ?? "[]"));
  const [groups, setGroups] = useState(
    JSON.parse(root.dataset["groups"] ?? "[]")
  );
  const [isEdit, setEdit] = useState(
    JSON.parse(root.dataset["isEdit"] ?? "false")
  );

  // const [, setSelected] = useState(0);

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

    const event = new CustomEvent("modify:items", { detail: _items });

    root.dispatchEvent(event);
  };

  const handleItemResize = (itemId, time, edge) => {
    const _items = items.map((item) => {
      const start = edge === "left" ? time : item.start;
      const end = edge === "left" ? item.end : time;

      return item.id === itemId
        ? Object.assign({}, item, { start, end })
        : item;
    });

    const event = new CustomEvent("modify:items", { detail: _items });

    root.dispatchEvent(event);
  };

  const onTimeChange = (start, end, fn) => {
    fn(start, start + 12 * 30 * 24 * 60 * 60 * 1000);
  };

  const onCanvasClick = (group, time) => {
    const event = new CustomEvent("add:items", { detail: { group, time } });

    root.dispatchEvent(event);
  };

  const onItemDoubleClick = (e) => {
    const event = new CustomEvent("edit:items", { detail: e });

    root.dispatchEvent(event);
  };

  const onSwapGroup = (source, target) => {
    const sourceIndex = groups.findIndex((group) => group.id === source);
    const targetIndex = groups.findIndex((group) => group.id === target);

    groups[sourceIndex] = groups.splice(targetIndex, 1, groups[sourceIndex])[0];

    const event = new CustomEvent("modify:groups", { detail: groups });

    root.dispatchEvent(event);
  };

  const onChange = (v) => {
    const index = groups.findIndex((group) => group.id === v.id);
    groups[index].title = v.title;

    const event = new CustomEvent("modify:groups", { detail: groups });

    root.dispatchEvent(event);
  };

  const groupList = useMemo(() => {
    if (isEdit) {
      return [
        ...groups,
        { id: "add-button", title: "工程を追加", type: GROUP_TYPES.ADD_BUTTON },
      ];
    }
    return groups;
  }, [groups, isEdit]);

  const itemList = useMemo(() => {
    return [...items];
  }, [items]);

  useEffect(() => {
    const onChangeItems = () => setItems(JSON.parse(root.dataset.items));
    const onChangeGroups = () => setGroups(JSON.parse(root.dataset.groups));

    root.addEventListener("sync:items", onChangeItems);
    root.addEventListener("sync:groups", onChangeGroups);

    return () => {
      root.removeEventListener("sync:items", onChangeItems);
      root.removeEventListener("sync:groups", onChangeGroups);
    };
  }, []);

  useEffect(() => {
    const onClick = () => setEdit(!isEdit);
    document.querySelector("#editMode").addEventListener("click", onClick);

    return () => {
      document.querySelector("#editMode").removeEventListener("click", onClick);
    };
  }, [isEdit]);

  return (
    <Timeline
      mode={isEdit ? MODES.EDIT : MODES.VIEW}
      defaultTimeStart={new Date("2024-01-01")}
      defaultTimeEnd={new Date("2025-01-01")}
      groups={groupList}
      items={itemList}
      keys={KEYS}
      {...CONFIGS}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onTimeChange={onTimeChange}
      onItemDoubleClick={onItemDoubleClick}
      onCanvasDoubleClick={onCanvasClick}
      itemRenderer={Item}
      groupRenderer={(props) => (
        <Group {...props} onSwapGroup={onSwapGroup} onChange={onChange} />
      )}
    >
      <TimelineHeaders className="sticky">
        <DateHeader labelFormat="YYYY年M月" intervalRenderer={Header} />
      </TimelineHeaders>
    </Timeline>
  );
}
