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
      fill="#E6007A"
      d="M75 54.167h-2.833L63.833 62.5h7.959l7.375 8.333H20.833L28.25 62.5h8.542l-8.334-8.333H25l-12.5 12.5v16.666a8.333 8.333 0 0 0 8.333 8.334h58.334a8.333 8.333 0 0 0 8.333-8.334V66.667zm-4.167-21.042L50.208 53.75 35.417 39l20.666-20.625zM53.167 9.542 26.625 36.083a4.15 4.15 0 0 0 0 5.875L47.25 62.5c1.625 1.708 4.25 1.708 5.875 0l26.5-26.417a4.15 4.15 0 0 0 0-5.875L59 9.583a4.06 4.06 0 0 0-5.833-.041"
    ></path>
  </svg>
);

export default SvgIcon;