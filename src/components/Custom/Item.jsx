import types from "prop-types";
import { GROUP_TYPES } from "../../constants";
// import clsx from "clsx";

export const Item = ({ item, itemContext, getItemProps, getResizeProps }) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  const background = itemContext.selected
    ? itemContext.dragging
      ? "red"
      : "#59BE50"
    : "#59BE5066";

  const { style, ...props } = getItemProps({});

  if (item.type === GROUP_TYPES.START || item.type === GROUP_TYPES.END) {
    return (
      <div
        {...props}
        style={{
          ...style,
          background: "transparent",
          color: item.color,
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.43793 3.06721C7.57823 1.0224 8.14794 0 9.00024 0C9.85254 0 10.4222 1.0224 11.5625 3.06721L11.8577 3.59641C12.1817 4.17781 12.3437 4.46851 12.5957 4.66021C12.8477 4.85191 13.1628 4.92301 13.7928 5.06522L14.3652 5.19482C16.5792 5.69612 17.6853 5.94632 17.949 6.79322C18.2118 7.63922 17.4576 8.52213 15.9483 10.287L15.5577 10.7433C15.1293 11.2446 14.9142 11.4957 14.8179 11.8053C14.7216 12.1158 14.754 12.4506 14.8188 13.1193L14.8782 13.7286C15.1059 16.0839 15.2202 17.2612 14.5308 17.7841C13.8414 18.3079 12.8046 17.83 10.7327 16.8759L10.1954 16.6293C9.60684 16.3575 9.31254 16.2225 9.00024 16.2225C8.68794 16.2225 8.39364 16.3575 7.80413 16.6293L7.26863 16.8759C5.19593 17.83 4.15912 18.307 3.47062 17.785C2.78032 17.2612 2.89462 16.0839 3.12232 13.7286L3.18172 13.1202C3.24652 12.4506 3.27892 12.1158 3.18172 11.8062C3.08632 11.4957 2.87122 11.2446 2.44282 10.7442L2.05222 10.287C0.542913 8.52303 -0.211289 7.64012 0.0515116 6.79322C0.315212 5.94632 1.42222 5.69522 3.63622 5.19482L4.20862 5.06522C4.83773 4.92301 5.15183 4.85191 5.40473 4.66021C5.65673 4.46851 5.81873 4.17781 6.14273 3.59641L6.43793 3.06721Z"
            fill="#4B2396"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      {...props}
      style={{ ...style, background, color: item.color, borderRadius: "8px" }}
    >
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

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

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
    </div>
  );
};

Item.propTypes = {
  className: types.string,
  item: types.any,
  itemContext: types.any,
  getItemProps: types.any,
  getResizeProps: types.any,
};
