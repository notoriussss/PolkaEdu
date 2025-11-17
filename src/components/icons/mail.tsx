import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 70 70"
    className={className}
    {...props}
  >
    <path
      fill="#fff"
      fillOpacity="0.4"
      d="M11.667 58.333q-2.406 0-4.119-1.712t-1.715-4.12v-35q0-2.407 1.715-4.12 1.715-1.71 4.119-1.714h46.666q2.407 0 4.122 1.715t1.712 4.118v35q0 2.406-1.712 4.121-1.713 1.715-4.122 1.712zM35 37.917 11.667 23.333V52.5h46.666V23.333zm0-5.834L58.333 17.5H11.667zm-23.333-8.75V17.5v35z"
    ></path>
  </svg>
);

export default SvgIcon;
