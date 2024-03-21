import { useState, useEffect, useMemo } from "react";

import Timeline, { TimelineHeaders, DateHeader } from "./components/Timeline";

import { Item } from "./components/Custom/Item";

import { root } from "./main";
import { Header } from "./components/Custom/Header";
import { GROUP_TYPES, MODES } from "./constants";

const emit = (name, value) => {
  const event = new CustomEvent(name, { detail: value });

  root.dispatchEvent(event);
};

export function App() {
  const [items, setItems] = useState(JSON.parse(root.dataset["items"] ?? "[]"));

  const [fakeItem, setFakeItem] = useState(null);

  const [groups, setGroups] = useState(
    JSON.parse(root.dataset["groups"] ?? "[]")
  );

  const [mode, setMode] = useState(
    JSON.parse(root.dataset["mode"] ?? '"edit"')
  );

  const handleItemCreate = (item) => {
    emit("create:item", item);
  };

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

    setItems(_items);

    emit("modify:items", _items);
  };

  const handleItemResize = (itemId, time, edge) => {
    const _items = items.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      const start = edge === "left" ? time : item.start;
      const end = edge === "left" ? item.end : time;

      console.log("log - handle resize: ", { start, end });

      return Object.assign({}, item, { start, end });
    });

    setItems(_items);

    emit("modify:items", _items);
  };

  const onItemDoubleClick = (e) => {
    emit("select:item", e);
  };

  const onSwapGroup = (source, target) => {
    const sourceIndex = groups.findIndex(
      (group) => Number(group.id) === Number(source)
    );

    const targetIndex = groups.findIndex(
      (group) => Number(group.id) === Number(target)
    );

    groups[sourceIndex] = groups.splice(targetIndex, 1, groups[sourceIndex])[0];

    emit("modify:groups", groups);
  };

  const onChange = (v) => {
    const index = groups.findIndex((group) => group.id === v.id);
    groups[index].title = v.title;
    groups[index].isError = v.isError;

    emit("modify:groups", groups);
  };

  const onCreateItem = (group, time) => {
    const item = items.find(
      ({ group: _group }) => Number(group) === Number(_group)
    );
    const _group = groups.find(({ id }) => Number(group) === Number(id));

    if (
      _group?.type === GROUP_TYPES.START ||
      _group?.type === GROUP_TYPES.END
    ) {
      return;
    }

    if (!item) {
      emit("create:item", { group, start: time, end: time });
    } else {
      emit("select:item", item.id);
    }
  };

  const onCreateGroup = () => {
    emit("create:group", null);
  };

  const onRemoveGroup = (id) => {
    emit("remove:group", id);
  };

  const groupList = useMemo(() => {
    if (mode !== MODES.EDIT) return groups;

    return [
      ...groups,
      {
        id: "create-button",
        title: "工程を追加",
        type: GROUP_TYPES.ADD_BUTTON,
      },
    ];
  }, [groups, mode]);

  const itemList = useMemo(
    () => (fakeItem ? [...items, fakeItem] : [...items]),
    [items, fakeItem]
  );

  const moveResizeValidator = (action, item, time, resizeEdge) => {
    const delta = 5 * 24 * 60 * 60 * 1000; // start and end available distance equals 5 day

    // // drag left handler
    if (resizeEdge === "left") {
      if (time < item.end - delta) {
        return time;
      } else {
        return item.end - delta;
      }
    } else if (resizeEdge === "right") {
      if (time > item.start + delta) {
        console.log("return time");
        return time;
      } else {
        return item.start + delta;
      }
    }

    return time;
  };

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
      sidebarWidth={mode === MODES.VIEW ? 100 : 144}
      defaultTimeStart={
        new Date(
          root.dataset["defaultTimeStart"] ||
            `${new Date().getFullYear()}-01-01`
        )
      }
      defaultTimeEnd={
        new Date(
          root.dataset["defaultTimeEnd"] ||
            `${new Date().getFullYear() + 1}-01-01`
        )
      }
      groups={groupList}
      items={itemList}
      fakeItem={fakeItem}
      setFakeItem={setFakeItem}
      onItemMove={handleItemMove}
      onItemResize={handleItemResize}
      onItemCreate={handleItemCreate}
      onItemDoubleClick={onItemDoubleClick}
      onCanvasDoubleClick={onCreateItem}
      itemRenderer={Item}
      onSwapGroup={onSwapGroup}
      onChange={onChange}
      onCreateGroup={onCreateGroup}
      onRemoveGroup={onRemoveGroup}
      moveResizeValidator={moveResizeValidator}
    >
      <TimelineHeaders className="sticky">
        <DateHeader labelFormat="YYYY年M月" intervalRenderer={Header} />
      </TimelineHeaders>
    </Timeline>
  );
}
