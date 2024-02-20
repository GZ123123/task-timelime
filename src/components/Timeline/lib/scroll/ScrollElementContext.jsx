import React, { createContext } from "react";
import PropTypes from "prop-types";
import { TimelineStateContext } from "../timeline/TimelineStateContext";
import {
  calculateTimeForXPosition,
  coordinateToTimeRatio,
} from "../utility/calendar";
import { getSumScroll, getSumOffset } from "../utility/dom-helpers";

const defaultContextState = {};

const { Consumer, Provider } = createContext(defaultContextState);

export class ScrollElementProvider extends React.Component {
  static contextType = TimelineStateContext;

  static propTypes = {
    scrollRef: PropTypes.object,
    children: PropTypes.element.isRequired,

    buffer: PropTypes.number,
    dragSnap: PropTypes.number,

    groups: PropTypes.any,
    items: PropTypes.any,

    onCreateItem: PropTypes.func.isRequired,
    onResizing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      item: null,
      scrollElementContext: {
        selectGroup: this.selectGroup,
        getTimeFromRowClickEvent: this.getTimeFromRowClickEvent,
        tryCreateItem: this.tryCreateItem,
        tryResizing: this.tryResizing,
      },
    };
  }

  getTimeFromRowClickEvent = (e) => {
    const { dragSnap } = this.props;
    const { canvasWidth, canvasTimeStart, canvasTimeEnd } =
      this.context.getTimelineState();

    const { offsetX } = e.nativeEvent;

    const time = calculateTimeForXPosition(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      offsetX
    );

    return Math.floor(time / dragSnap) * dragSnap;
  };

  timeFor = (e) => {
    const { canvasWidth, canvasTimeStart, canvasTimeEnd } =
      this.context.getTimelineState();

    const ratio = coordinateToTimeRatio(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth
    );

    const offset = getSumOffset(this.props.scrollRef).offsetLeft;
    const scrolls = getSumScroll(this.props.scrollRef);

    return (e.pageX - offset + scrolls.scrollLeft) * ratio + canvasTimeStart;
  };

  resizeTimeSnap = (dragTime) => {
    const { dragSnap } = this.props;

    if (dragSnap) {
      const endTime = this.currentItem.end % dragSnap;
      return Math.round((dragTime - endTime) / dragSnap) * dragSnap + endTime;
    } else {
      return dragTime;
    }
  };

  selectGroup = (group) => {
    this.currentGroup = group;
  };

  tryCreateItem = (event) => {
    const time = this.getTimeFromRowClickEvent(event);

    if (this.currentGroup) {
      this.currentItem = this.props.onCreateItem(this.currentGroup, time, time);

      return this.currentItem;
    }

    return null;
  };

  tryResizing = (event) => {
    if (!this.currentItem) return;

    const resizeTime = this.resizeTimeSnap(this.timeFor(event));

    this.props.onResizing(this.currentItem.id, resizeTime, "right");
  };

  render() {
    return (
      <Provider
        value={{ item: this.state.item, ...this.state.scrollElementContext }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export const ScrollElementConsumer = Consumer;
