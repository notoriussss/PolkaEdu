import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
    className={className}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.205 17.308V15.64a3.333 3.333 0 0 0-3.333-3.333h-5a3.333 3.333 0 0 0-3.334 3.333v1.667M13.205 2.414a3.333 3.333 0 0 1 0 6.454m5 8.44V15.64a3.33 3.33 0 0 0-2.5-3.225M7.372 8.974a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666"
    ></path>
  </svg>
);

export default SvgIcon;