import types from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";

import { GROUP_TYPES, MODES } from "../../constants";

let dragging = null;

export function Group({ mode, group, onSwapGroup, onChange, onCreateGroup, onRemoveGroup }) {
  const parentRef = useRef();

  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(group.title);
  const isProcess = useMemo(
    () =>
      ![GROUP_TYPES.START, GROUP_TYPES.END, GROUP_TYPES.ADD_BUTTON].includes(
        group.type
      ),
    [group.type]
  );

  const onHandleMouseDown = () => {
    parentRef.current.setAttribute("draggable", "true");
  };

  const onHandleMouseUp = () => {
    parentRef.current.setAttribute("draggable", "false");
  };

  const onDragStart = (event) => {
    event.dataTransfer.setData("id", group.id);

    dragging = group.id;

    document.querySelector(".rct-sidebar").classList.add("dragging");
  };

  const onDragEnter = () => {
    if (dragging === group.id) return;

    parentRef.current.classList.add("drag-over");
  };

  const onDragLeave = (event) => {
    const transferId = event.dataTransfer.getData("id");

    if (transferId === group.id) return;

    parentRef.current.classList.remove("drag-over");
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // return true;
  };

  const onDrop = (event) => {
    onHandleMouseUp();
    onDragLeave(event);

    document.querySelector(".rct-sidebar").classList.remove("dragging");

    const transferId = event.dataTransfer.getData("id");

    dragging = null;

    if (transferId !== group.id) {
      onSwapGroup(transferId, group.id);
    } else {
      parentRef.current.parentNode.style.borderBottom = `2px solid transparent`;
    }
  };

  const onEdit = () => setIsEdit(true);

  const onTitleChange = (e) => setEditTitle(e.target.value);

  const onSubmit = () => {
    setIsEdit(false);

    onChange({ ...group, title: editTitle });
  };

  const onRemove = () => {
    onRemoveGroup(group.id)
  };

  useEffect(() => {
    const el = document.querySelector('.rct-sidebar')
    const handleMouseLeave = () => {
      if(el.classList.contains('dragging')) {
        el.classList.remove('dragging')
      }
    }
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // #region Render
  const DragIcon = (props) => {
    return (
      <svg
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M2.8 5.2L1 7M1 7L2.8 8.8M1 7H13M5.2 2.8L7 1M7 1L8.8 2.8M7 1V13M8.8 11.2L7 13M7 13L5.2 11.2M11.2 5.2L13 7M13 7L11.2 8.8"
          stroke="#A4A4A4"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const RemoveIcon = (props) => {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.66712 2.53151C6.63176 2.53151 6.59785 2.54556 6.57284 2.57056C6.54784 2.59557 6.53379 2.62948 6.53379 2.66484V4.13151H9.46712V2.66484C9.46712 2.62948 9.45307 2.59557 9.42807 2.57056C9.40307 2.54556 9.36915 2.53151 9.33379 2.53151H6.66712ZM10.5338 4.13151V2.66484C10.5338 2.34658 10.4074 2.04136 10.1823 1.81632C9.95727 1.59127 9.65205 1.46484 9.33379 1.46484H6.66712C6.34886 1.46484 6.04364 1.59127 5.81859 1.81632C5.59355 2.04136 5.46712 2.34658 5.46712 2.66484V4.13151H3.34003C3.33627 4.13147 3.33251 4.13147 3.32874 4.13151H2.66712C2.37257 4.13151 2.13379 4.37029 2.13379 4.66484C2.13379 4.9594 2.37257 5.19818 2.66712 5.19818H2.84305L3.46728 12.6889C3.47353 13.1753 3.66946 13.6404 4.01386 13.9848C4.36392 14.3348 4.83872 14.5315 5.33379 14.5315H10.6671C11.1622 14.5315 11.637 14.3348 11.9871 13.9848C12.3315 13.6404 12.5274 13.1753 12.5336 12.6889L13.1579 5.19818H13.3338C13.6283 5.19818 13.8671 4.9594 13.8671 4.66484C13.8671 4.37029 13.6283 4.13151 13.3338 4.13151H12.6722C12.6684 4.13147 12.6646 4.13147 12.6609 4.13151H10.5338ZM3.91342 5.19818L4.53195 12.6206C4.53317 12.6353 4.53379 12.6501 4.53379 12.6648C4.53379 12.877 4.61807 13.0805 4.7681 13.2305C4.91813 13.3806 5.12162 13.4648 5.33379 13.4648H10.6671C10.8793 13.4648 11.0828 13.3806 11.2328 13.2305C11.3828 13.0805 11.4671 12.877 11.4671 12.6648C11.4671 12.6501 11.4677 12.6353 11.469 12.6206L12.0875 5.19818H3.91342ZM6.66712 6.79818C6.96167 6.79818 7.20046 7.03696 7.20046 7.33151V11.3315C7.20046 11.6261 6.96167 11.8648 6.66712 11.8648C6.37257 11.8648 6.13379 11.6261 6.13379 11.3315V7.33151C6.13379 7.03696 6.37257 6.79818 6.66712 6.79818ZM9.33379 6.79818C9.62834 6.79818 9.86712 7.03696 9.86712 7.33151V11.3315C9.86712 11.6261 9.62834 11.8648 9.33379 11.8648C9.03924 11.8648 8.80046 11.6261 8.80046 11.3315V7.33151C8.80046 7.03696 9.03924 6.79818 9.33379 6.79818Z"
          fill="#A4A4A4"
        />
      </svg>
    );
  };

  const SubmitIcon = (props) => {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M13.333 4.66797L6.66634 11.3346L3.33301 8.0013"
          stroke="#4B2396"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  if (mode === MODES.VIEW) {
    return (
      <div className="group-item">
        <div>{group.title}</div>
      </div>
    );
  }

  if (group.type === GROUP_TYPES.ADD_BUTTON) {
    return (
      <div className="group-container" ref={parentRef}>
        <div></div>
        <div className="group-item create-process" onClick={onCreateGroup}>
          <div style={{ flex: 1 }}>{group.title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="group-container" ref={parentRef} onDragStart={onDragStart}>
      <div className="group-item-remove" onDragOver={onDragOver}>
        <RemoveIcon onClick={onRemove} />
      </div>
      <div
        className="group-item"
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
      >
        {isEdit ? (
          <div className="form-control edit">
            <input
              autoFocus
              style={{ width: "100%" }}
              type="text"
              value={editTitle}
              onChange={onTitleChange}
            />

            <div onClick={onSubmit}>
              <SubmitIcon />
            </div>
          </div>
        ) : (
          <div className="form-control">
            <span onClick={onEdit}>{group.title}</span>
            {isProcess && (
              <div
                className="drag-handler"
                onMouseDown={onHandleMouseDown}
                onMouseUp={onHandleMouseUp}
                onDragOver={onDragOver}
              >
                <DragIcon draggable style={{ pointerEvent: "none" }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
  // #endregion
}

Group.propTypes = {
  mode: types.string,
  setSelected: types.func,
  group: types.any,
  onSwapGroup: types.func,
  onCreateGroup: types.func,
  onRemoveGroup: types.func,
  onChange: types.func,
};
