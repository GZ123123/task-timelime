import types from "prop-types";

export const Item = ({ item, itemContext, getItemProps, getResizeProps }) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const background = itemContext.selected
    ? itemContext.dragging
      ? "red"
      : "#59BE50"
    : "#59BE5066";

  const { style, ...props } = getItemProps({  });

  return (
    <div
      {...props}
      style={{...style, background, color: item.color, borderRadius: '8px' }}
    >
      {itemContext.useResizeHandle && itemContext.selected ? <div {...leftResizeProps} /> : null}

      <div
        style={{
          height: itemContext.dimensions.height,
          overflow: "hidden",
          padding: "5px",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {itemContext.title}
      </div>

      {itemContext.useResizeHandle && itemContext.selected ? <div {...rightResizeProps} /> : null}
    </div>
  );
};

Item.propTypes = {
  item: types.any,
  itemContext: types.any,
  getItemProps: types.any,
  getResizeProps: types.any,
};
