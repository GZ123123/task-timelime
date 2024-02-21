import { Component } from "react";
import PropTypes from "prop-types";
// import {
//   calculateTimeForXPosition,
//   getCanvasWidth,
//   coordinateToTimeRatio,
// } from "../utility/calendar";
// import { getSumScroll, getSumOffset } from "../utility/dom-helpers";
import { ScrollElementConsumer } from "./ScrollElementContext";

class ScrollElement extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,

    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,

    traditionalZoom: PropTypes.bool.isRequired,
    scrollRef: PropTypes.func.isRequired,
    isInteractingWithItem: PropTypes.bool.isRequired,

    getTimeFromRowClickEvent: PropTypes.func.isRequired,
    tryCreateItem: PropTypes.func.isRequired,
    tryResizing: PropTypes.func.isRequired,
    commitItem: PropTypes.func.isRequired,

    onScroll: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = { isDragging: false };
  }

  /**
   * needed to handle scrolling with trackpad
   */
  handleScroll = () => {
    const scrollX = this.scrollComponent.scrollLeft;
    this.props.onScroll(scrollX);
  };

  refHandler = (el) => {
    this.scrollComponent = el;
    this.props.scrollRef(el);
    if (el) {
      el.addEventListener("wheel", this.handleWheel, { passive: false });
    }
  };

  handleWheel = (e) => {
    e.preventDefault();
    this.props.onScroll(
      this.scrollComponent.scrollLeft + (e.deltaY || e.deltaX)
    );
  };

  handleMouseDown = (e) => {
    if (e.button === 0) {
      this.dragStartPosition = e.pageX;
      this.dragLastPosition = e.pageX;

      this.dragStartTime = this.props.getTimeFromRowClickEvent(e);

      this.setState({ isDragging: true });
    }
  };

  // todo: update this fuinction
  handleMouseMove = (e) => {
    // this.props.onMouseMove(e)
    //why is interacting with item important?
    if (this.state.isDragging) {
      if (!this.props.isInteractingWithItem) {
        if (!this.currentItem) {
          this.currentItem = this.props.tryCreateItem(e);
        } else {
          this.props.tryResizing(e);
        }
        this.dragLastPosition = e.pageX;
      }
    }
  };

  handleMouseUp = () => {
    // create item
    if (this.currentItem) {
      this.props.commitItem()
    }
    this.currentItem = null;

    this.dragStartPosition = null;
    this.dragLastPosition = null;

    this.setState({ isDragging: false });
  };

  handleMouseLeave = () => {
    // this.props.onMouseLeave(e)
    this.dragStartPosition = null;
    this.dragLastPosition = null;
    this.setState({ isDragging: false });
  };

  handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      this.lastTouchDistance = Math.abs(
        e.touches[0].screenX - e.touches[1].screenX
      );
      this.singleTouchStart = null;
      this.lastSingleTouch = null;
    } else if (e.touches.length === 1) {
      e.preventDefault();

      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;

      this.lastTouchDistance = null;
      this.singleTouchStart = { x: x, y: y, screenY: window.pageYOffset };
      this.lastSingleTouch = { x: x, y: y, screenY: window.pageYOffset };
    }
  };

  handleTouchMove = (e) => {
    // const { isInteractingWithItem, width, onZoom } = this.props;
    const { isInteractingWithItem } = this.props;
    if (isInteractingWithItem) {
      e.preventDefault();
      return;
    }
    if (this.lastSingleTouch && e.touches.length === 1) {
      e.preventDefault();
      let x = e.touches[0].clientX;
      let y = e.touches[0].clientY;
      let deltaX = x - this.lastSingleTouch.x;
      let deltaX0 = x - this.singleTouchStart.x;
      let deltaY0 = y - this.singleTouchStart.y;
      this.lastSingleTouch = { x: x, y: y };
      let moveX = Math.abs(deltaX0) * 3 > Math.abs(deltaY0);
      let moveY = Math.abs(deltaY0) * 3 > Math.abs(deltaX0);
      if (deltaX !== 0 && moveX) {
        this.props.onScroll(this.scrollComponent.scrollLeft - deltaX);
      }
      if (moveY) {
        window.scrollTo(
          window.pageXOffset,
          this.singleTouchStart.screenY - deltaY0
        );
      }
    }
  };

  handleTouchEnd = () => {
    if (this.lastTouchDistance) {
      this.lastTouchDistance = null;
    }
    if (this.lastSingleTouch) {
      this.lastSingleTouch = null;
      this.singleTouchStart = null;
    }
  };

  componentWillUnmount() {
    if (this.scrollComponent) {
      this.scrollComponent.removeEventListener("wheel", this.handleWheel);
    }
  }

  render() {
    const { width, height, children } = this.props;
    const { isDragging } = this.state;

    const scrollComponentStyle = {
      width: `${width}px`,
      height: `${height + 20}px`, //20px to push the scroll element down off screen...?
      cursor: isDragging ? "ew-resize" : "default",
      position: "relative",
    };

    return (
      <div
        ref={this.refHandler}
        data-testid="scroll-element"
        className="rct-scroll"
        style={scrollComponentStyle}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
        onScroll={this.handleScroll}
      >
        {children}
      </div>
    );
  }
}

const ScrollElementWrapper = (props) => (
  <ScrollElementConsumer>
    {({ tryCreateItem, tryResizing, commitItem, getTimeFromRowClickEvent }) => (
      <ScrollElement
        tryCreateItem={tryCreateItem}
        tryResizing={tryResizing}
        commitItem={commitItem}
        getTimeFromRowClickEvent={getTimeFromRowClickEvent}
        {...props}
      />
    )}
  </ScrollElementConsumer>
);

export default ScrollElementWrapper;
