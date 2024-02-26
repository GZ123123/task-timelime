import clsx from "clsx";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Tooltip({ text, className, children, ...props }) {
  const activatedRef = useRef(false);

  const [position, setPosition] = useState(null);

  const onMouseMove = (e) => {
    const target = e.target;

    if (target.clientWidth < target.scrollWidth) {
      activatedRef.current = true;

      if (activatedRef.current) {
        setPosition({ top: e.pageY + 2, left: e.pageX + 2 });
      }
    }
  };

  const onMouseLeave = () => {
    activatedRef.current = false;
    setPosition(null);
  };

  useEffect(() => {
    const updatePosition = (e) => {
      if (activatedRef.current) {
        setPosition({ top: e.pageY + 2, left: e.pageX + 2 });
      }
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      window.addEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <div
      className={clsx("tooltip-container", className)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
      {position &&
        createPortal(
          <div
            className="react-calendar-timeline-tooltip"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            {text}
          </div>,
          document.body
        )}
    </div>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};
