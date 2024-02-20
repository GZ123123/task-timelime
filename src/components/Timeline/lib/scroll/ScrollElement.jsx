import { Component } from "react";
import PropTypes from "prop-types";
import { getParentPosition } from "../utility/dom-helpers";
import { calculateTimeForXPosition, getCanvasWidth, coordinateToTimeRatio } from "../utility/calendar";
import { getSumScroll, getSumOffset } from '../utility/dom-helpers'
import { ScrollElementConsumer } from "./ScrollElementContext";

class ScrollElement extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    dragSnap: PropTypes.number.isRequired,
    buffer: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    canvasWidth: PropTypes.number.isRequired,
    canvasTimeStart: PropTypes.number.isRequired,
    canvasTimeEnd: PropTypes.number.isRequired,
    traditionalZoom: PropTypes.bool.isRequired,
    scrollRef: PropTypes.func.isRequired,
    isInteractingWithItem: PropTypes.bool.isRequired,
    
    item: PropTypes.any,

    onCreateItem: PropTypes.func.isRequired,
    onItemResizing: PropTypes.func.isRequired,
    onZoom: PropTypes.func.isRequired,
    onWheelZoom: PropTypes.func.isRequired,
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
    // zoom in the time dimension
    // if (e.ctrlKey || e.metaKey || e.altKey) {
    //   e.preventDefault()
    //   const parentPosition = getParentPosition(e.currentTarget)
    //   const xPosition = e.clientX - parentPosition.x

    //   const speed = e.ctrlKey ? 10 : e.metaKey ? 3 : 1

    //   // convert vertical zoom to horiziontal
    //   this.props.onWheelZoom(speed, xPosition, e.deltaY)
    // } else if (e.shiftKey) {
    //   e.preventDefault()
    //   // shift+scroll event from a touchpad has deltaY property populated; shift+scroll event from a mouse has deltaX
    //   this.props.onScroll(this.scrollComponent.scrollLeft + (e.deltaY || e.deltaX))
    //   // no modifier pressed? we prevented the default event, so scroll or zoom as needed
    // }

    // if (e.shiftKey) {
    // e.preventDefault()
    // shift+scroll event from a touchpad has deltaY property populated; shift+scroll event from a mouse has deltaX
    // this.props.onScroll(this.scrollComponent.scrollLeft + (e.deltaY || e.deltaX))
    // no modifier pressed? we prevented the default event, so scroll or zoom as needed
    // }
    e.preventDefault();
    this.props.onScroll(
      this.scrollComponent.scrollLeft + (e.deltaY || e.deltaX)
    );
  };

  handleMouseDown = (e) => {
    if (e.button === 0) {
      this.dragStartPosition = e.pageX;
      this.dragLastPosition = e.pageX;

      const time = this.getTimeFromRowClickEvent(e);

      this.dragStartTime = time;
      // this.dragLastTime = time

      this.props.onCreateItem(this.dragStartTime, this.dragStartTime);

      this.setState({ isDragging: true });
    }
  };

  // todo: update this fuinction
  handleMouseMove = (e) => {
    // this.props.onMouseMove(e)
    //why is interacting with item important?

    // console.log('log - ScrollElement - handleMouseMove - time: ', this.props.isInteractingWithItem)
    if (this.state.isDragging) {
      // const time = this.getTimeFromRowClickEvent(e);

      let resizeTime = this.resizeTimeSnap(this.timeFor(e))
          // const resizeTime = 
      console.log('log - resizeTime: ', resizeTime)
      this.props.onItemResizing(resizeTime);

      if (!this.props.isInteractingWithItem) {
        // console.log("log - e.pageX", e.pageX);
        // this.props.onScroll(this.scrollComponent.scrollLeft + this.dragLastPosition - e.pageX)

        this.dragLastPosition = e.pageX;
      }
    }
  };

  handleMouseUp = () => {
    this.dragStartPosition = null;
    this.dragLastPosition = null;

    // const time =  this.getTimeFromRowClickEvent(e)

    // this.dragStartTime = time
    // this.dragLastTime = time

    // console.log('log - ScrollElement - handleMouseUp - time: ', this.dragStartTime, time)
    // this.props.onCreateItem(this.dragStartTime, time)

    this.setState({ isDragging: false });

    if (this.dragStartPosition === this.dragLastPosition) return;
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
    const { isInteractingWithItem, width, onZoom } = this.props;
    if (isInteractingWithItem) {
      e.preventDefault();
      return;
    }
    if (this.lastTouchDistance && e.touches.length === 2) {
      e.preventDefault();
      let touchDistance = Math.abs(e.touches[0].screenX - e.touches[1].screenX);
      let parentPosition = getParentPosition(e.currentTarget);
      let xPosition =
        (e.touches[0].screenX + e.touches[1].screenX) / 2 - parentPosition.x;
      if (touchDistance !== 0 && this.lastTouchDistance !== 0) {
        onZoom(this.lastTouchDistance / touchDistance, xPosition / width);
        this.lastTouchDistance = touchDistance;
      }
    } else if (this.lastSingleTouch && e.touches.length === 1) {
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

  getTimeFromRowClickEvent = (e) => {
    const { width, buffer, dragSnap, canvasTimeStart, canvasTimeEnd } =
      this.props;

    const { offsetX } = e.nativeEvent;

    let time = calculateTimeForXPosition(
      canvasTimeStart,

      canvasTimeEnd,
      getCanvasWidth(width, buffer),
      offsetX
    );
    console.log('log - 220 = time: ', time)
    time = Math.floor(time / dragSnap) * dragSnap;

    return time;
  };

  timeFor(e) {
    const ratio = coordinateToTimeRatio(this.props.canvasTimeStart, this.props.canvasTimeEnd, this.props.canvasWidth)

    const offset = getSumOffset(this.scrollComponent).offsetLeft
    const scrolls = getSumScroll(this.scrollComponent)

      
    return (e.pageX - offset + scrolls.scrollLeft) * ratio + this.props.canvasTimeStart;
  }

  resizeTimeSnap(dragTime) {
    const { dragSnap } = this.props
    if (dragSnap) {
      const endTime = this.props.item.end % dragSnap
      return Math.round((dragTime - endTime) / dragSnap) * dragSnap + endTime
    } else {
      return dragTime
    }
  }


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
      cursor: isDragging ? "move" : "default",
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
    {({ item, handleCreateItem, handleResizingItem }) => (
      <ScrollElement
        item={item}
        onCreateItem={handleCreateItem}
        onItemResizing={handleResizingItem}
        {...props}
      />
    )}
  </ScrollElementConsumer>
);

export default ScrollElementWrapper;
