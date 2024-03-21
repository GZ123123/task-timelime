import PropTypes from "prop-types";
import { Component } from "react";

import { _get, arraysEqual } from "../utility/generic";
import Group from "./Group";
import { GroupConsumer } from "./GroupProvider";

class Sidebar extends Component {
  static propTypes = {
    mode: PropTypes.string,
    editing: PropTypes.string,
    error: PropTypes.bool,

    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,

    onSwapGroup: PropTypes.func,
    onCreateGroup: PropTypes.func,
    onRemoveGroup: PropTypes.func,
    onChange: PropTypes.func,
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

  // renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
  //   if (this.props.groupRenderer) {
  //     return React.createElement(this.props.groupRenderer, {
  //       mode: this.props.mode,
  //       group,
  //       isRightSidebar,
  //     });
  //   } else {
  //     return _get(group, isRightSidebar ? groupRightTitleKey : groupTitleKey);
  //   }
  // }

  render() {
    const {
      mode,
      width,
      groupHeights,
      height,
      isRightSidebar,
      editing,
      error,

      onSwapGroup,
      onCreateGroup,
      onRemoveGroup,
      onChange,
    } = this.props;

    const { groupIdKey /*, groupTitleKey, groupRightTitleKey */ } =
      this.props.keys;

    let groupLines = this.props.groups.map((group, index) => {
      // todo: custom - height of error group

      const key = _get(group, groupIdKey);

      const height =
        editing === key
          ? groupHeights[index] + (error ? 22 : 0)
          : groupHeights[index];

      return (
        <div
          key={key}
          className={`rct-sidebar-row rct-sidebar-row-${
            index % 2 ? "even" : "old"
          }`}
          style={{
            height: `${height}px`,
            lineHeight: `${groupHeights[index]}px`,
          }}
        >
          {/* {this.renderGroupContent(
            group,
            isRightSidebar,
            groupTitleKey,
            groupRightTitleKey
          )} */}
          <Group
            id={key}
            mode={mode}
            group={group}
            onSwapGroup={onSwapGroup}
            onCreateGroup={onCreateGroup}
            onRemoveGroup={onRemoveGroup}
            onChange={onChange}
          />
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

class SidebarWrapper extends Component {
  static propTypes = {
    children: PropTypes.element,
    mode: PropTypes.string,
    groups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    groupHeights: PropTypes.array.isRequired,
    keys: PropTypes.object.isRequired,
    groupRenderer: PropTypes.func,
    isRightSidebar: PropTypes.bool,
  };

  render() {
    return (
      <GroupConsumer>
        {(props) => <Sidebar {...props} {...this.props} />}
      </GroupConsumer>
    );
  }
}

export default SidebarWrapper;
