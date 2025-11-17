import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 48 48"
    preserveAspectRatio="xMidYMid meet"
    className={className}
    {...props}
  >
    <path
      fill="currentColor"
      d="M40 14v-4c0-2.206-1.794-4-4-4H10c-3.308 0-6 2.692-6 6v24c0 4.402 3.588 6 6 6h30c2.206 0 4-1.794 4-4V18c0-2.206-1.794-4-4-4m-4 18h-4v-8h4zM10 14a2.002 2.002 0 0 1 0-4h26v4z"
    ></path>
  </svg>
);

export default SvgIcon;