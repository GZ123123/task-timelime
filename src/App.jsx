import { useState, useEffect, useMemo } from "react";

import Timeline, { TimelineHeaders, DateHeader } from "./components/Timeline";

import { Item } from "./Item";

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
  const [items, setItems] = useState(JSON.parse(root.dataset.items ?? "[]"));
  const [groups, setGroups] = useState(JSON.parse(root.dataset.groups ?? "[]"));

  const [, setSelected] = useState(0)

  const [mode, setMode] = useState('view')

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
    const _items = items.map((item) =>{
      const start = edge === "left" ? time : item.start;
      const end = edge === "left" ? item.end : time;

      return item.id === itemId ? Object.assign({}, item, { start, end }) : item
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
  } 

  const onChange = (v) => {
    const index = groups.findIndex((group) => group.id === v.id);
    groups[index].title = v.title
    
    const event = new CustomEvent("modify:groups", { detail: groups });

    root.dispatchEvent(event);
  } 

  const onChangeMode = () => {
    setMode(mode === 'edit' ? 'view': 'edit')
  }

  const groupList = useMemo(() => {
    return [
      { id: "-1", title: "Start" },
      ...groups,
      { id: "-2", title: "End" },
    ];
  }, [groups]);

  const itemList = useMemo(() => {
    return [
      ...items,
      {
        id: "1",
        group: "-1",
        title: "masker",
        type: 2,
        start: 1706310000000,
        end: 1706310000000,
        className: "item-weekend",
        itemProps: {
          "data-tip":
            "Try to transmit the COM interface, maybe it will generate the solid state sensor!",
        },
      },
      {
        id: "3",
        group: "-2",
        title: "masker",
        type: 2,
        start: 1720575339222,
        end: 1720575339222,
        className: "item-weekend",
        itemProps: {
          "data-tip":
            "Try to transmit the COM interface, maybe it will generate the solid state sensor!",
        },
      },
    ];
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
  });

  return (
    <>
    <Timeline
      mode={mode}
      defaultTimeStart={new Date("2024-01-01")}
      defaultTimeEnd={new Date("2025-01-01")}
      traditionalZoom={false}
      itemHeightRatio={0.75}
      groups={groupList}
      items={itemList}
      keys={KEYS}
      fullUpdate
      useResizeHandle
      itemTouchSendsClick={false}
      stackItems
      canMove={false}
      canResize={false}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onTimeChange={onTimeChange}
      onItemDoubleClick={onItemDoubleClick}
      lineHeight={50}
      onCanvasDoubleClick={onCanvasClick}
      canChangeGroup={false}

      itemRenderer={Item}
      groupRenderer={({ group }) => <Group mode={mode} group={group} onSwapGroup={onSwapGroup} setSelected={setSelected} onChange={onChange}/>}
    >
      <TimelineHeaders className="sticky">
        <DateHeader labelFormat="YYYY年M月" intervalRenderer={Header} />
      </TimelineHeaders>
    </Timeline>
    <button onClick={onChangeMode}> changeMode - {mode}</button>
    </>
  );
}
