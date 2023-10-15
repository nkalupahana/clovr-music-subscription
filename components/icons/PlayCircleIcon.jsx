import React from "react";

export const PlayCircleIcon = ({size = 24, width, height, ...props}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >

    <path
      d="M10.5 7L15.5 12L10.5 17V7Z"
      fill="currentColor"
    />
  </svg>
);
