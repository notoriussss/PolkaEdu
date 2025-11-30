import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 100 100"
    className={className}
    {...props}
  >
    <path
      stroke="#E6007A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6.25"
      d="M83.333 62.5c0 7.767 0 11.65-1.266 14.708a16.67 16.67 0 0 1-9.021 9.021C69.983 87.5 66.1 87.5 58.333 87.5h-12.5c-15.716 0-23.575 0-28.458-4.883-4.875-4.88-4.875-12.738-4.875-28.45v-25A16.666 16.666 0 0 1 29.167 12.5"
    ></path>
    <path
      stroke="#E6007A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6.25"
      d="m41.667 35.417 1.808 16.537a3.92 3.92 0 0 0 2.3 3.138c2.858 1.229 8.212 3.241 12.558 3.241s9.7-2.012 12.558-3.241a3.92 3.92 0 0 0 2.305-3.138L75 35.417m10.417-4.167v15.708M58.332 16.667l-29.166 12.5 29.166 12.5 29.167-12.5z"
    ></path>
  </svg>
);

export default SvgIcon;