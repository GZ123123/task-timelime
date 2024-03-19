import PropTypes from "prop-types";
import React, { Component } from "react";

import { _get, arraysEqual } from "../utility/generic";

export default class Sidebar extends Component {
  static propTypes = {
    mode: PropTypes.string,
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.mode === this.props.keys &&
      nextProps.keys === this.props.keys &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height &&
      arraysEqual(nextProps.groups, this.props.groups) &&
      arraysEqual(nextProps.groupHeights, this.props.groupHeights)
    );
  }

  renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
    if (this.props.groupRenderer) {
      return React.createElement(this.props.groupRenderer, {
        mode: this.props.mode,
        group,
        isRightSidebar,
      });
    } else {
      return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey);
    }
  }

  render() {
    const { width, groupHeights, height, isRightSidebar } = this.props;

    const { groupIdKey, groupTitleKey, groupRightTitleKey } = this.props.keys;

    let groupLines = this.props.groups.map((group, index) => {
      // todo: custom - height of error group
      const height = groupHeights[index] + (group.isError ? 50 : 0)
      return (
        <div
          key={_get(group, groupIdKey)}
          className={`rct-sidebar-row rct-sidebar-row-${
            index % 2 ? "even" : "old"
          }`}
          style={{
            height: `${height}px`,
            lineHeight: `${groupHeights[index]}px`,
          }}
        >
          {this.renderGroupContent(
            group,
            isRightSidebar,
            groupTitleKey,
            groupRightTitleKey
          )}
        </div>
      );
    });

    return (
      <div
        className={"rct-sidebar" + (isRightSidebar ? " rct-sidebar-right" : "")}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div style={{ width: `${width}px` }}>{groupLines}</div>
      </div>
    );
  }
}
