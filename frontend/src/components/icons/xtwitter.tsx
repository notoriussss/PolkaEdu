import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 50 50"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_15_1037)">
      <mask
        id="mask0_15_1037"
        width="50"
        height="50"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "luminance" }}
      >
        <path fill="#fff" d="M0 0h50v50H0z"></path>
      </mask>
      <g mask="url(#mask0_15_1037)">
        <path
          fill="#fff"
          fillOpacity="0.4"
          d="M39.375 2.343h7.668l-16.75 19.193L50 47.657H34.571L22.48 31.817 8.657 47.658H.982l17.914-20.536L0 2.346h15.821l10.915 14.475zm-2.696 40.714h4.25L13.5 6.703H8.943z"
        ></path>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_15_1037">
        <path fill="#fff" d="M0 0h50v50H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default SvgIcon;