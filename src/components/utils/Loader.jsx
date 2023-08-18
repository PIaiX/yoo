import React, { memo } from "react";

const Loader = memo(
  ({ className, full = false, size = 35, color, speed = "1s" }) => {
    const Icon = () => {
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 38 38"
          stroke={color ? color : "#4a83dc"}
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur={speed}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      );
    };
    if (full) {
      return (
        <div className="loader">
          <Icon />
        </div>
      );
    }
    return <Icon />;
  }
);

export default Loader;
