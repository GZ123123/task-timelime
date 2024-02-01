import types from "prop-types";
import { useRef, useState } from "react";

export function Group({ mode, group, setSelected, onSwapGroup, onChange }) {
  const parentRef = useRef();

  const [isDragging, setDragging] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(group.title);

  const onHandleMouseDown = () => {
    parentRef.current.setAttribute("draggable", "true");
  };

  const onHandleMouseUp = () => {
    setDragging(false);

    parentRef.current.setAttribute("draggable", "false");
  };

  const onDragStart = () => {
    setDragging(true);
    event.dataTransfer.setData("id", group.id);
  };

  const onDragEnter = (event) => {
    const transferId = event.dataTransfer.getData("id");

    if (transferId === group.id) return;

    parentRef.current.parentNode.style.borderBottom = `2px solid black`;
  };

  const onDragLeave = (event) => {
    const transferId = event.dataTransfer.getData("id");

    if (transferId === group.id) return;

    parentRef.current.parentNode.style.borderBottom = `2px solid transparent`;
  };

  const onDragOver = (event) => {
    event.preventDefault();
    return true;
  };

  const onDrop = (event) => {
    onHandleMouseUp();
    onDragLeave(event);

    const transferId = event.dataTransfer.getData("id");

    if (transferId !== group.id) {
      onSwapGroup(transferId, group.id);
    } else {
      parentRef.current.parentNode.style.borderBottom = `2px solid transparent`;
    }
  };

  const onEdit = () => {
    console.log("onEdit");

    setSelected(group.id);

    setIsEdit(true);
  };

  const onSave = () => {
    console.log("onSave");

    setSelected(null);

    setIsEdit(false);

    onChange({ ...group, title: editTitle });
  };

  const onTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  console.log('log - mode:', mode)

  if (mode === "edit") {
    return (
      <div className="group-item" ref={parentRef}>
        <div style={{ flex: 1 }} onClick={onEdit}>
          <span>{group.title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group-item"
      ref={parentRef}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
    >
      {isEdit ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <input
              autoFocus
              style={{ width: "100%" }}
              type="text"
              value={editTitle}
              onChange={onTitleChange}
            />
          </div>
          <svg
            onClick={onSave}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.333 4.66797L6.66634 11.3346L3.33301 8.0013"
              stroke="#4B2396"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }} onClick={onEdit}>
            <span>{group.title}</span>
          </div>
          <svg
            className="drag-handler"
            onMouseDown={onHandleMouseDown}
            onMouseUp={onHandleMouseUp}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={
              isDragging ? { pointerEvents: "none", userSelect: "none" } : {}
            }
          >
            <path
              d="M2.8 5.2L1 7M1 7L2.8 8.8M1 7H13M5.2 2.8L7 1M7 1L8.8 2.8M7 1V13M8.8 11.2L7 13M7 13L5.2 11.2M11.2 5.2L13 7M13 7L11.2 8.8"
              stroke="#A4A4A4"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

Group.propTypes = {
  mode: types.string,
  setSelected: types.func,
  group: types.any,
  onSwapGroup: types.func,
  onChange: types.func,
};
