import * as React from "react";

const SvgIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 70 70"
    preserveAspectRatio="xMidYMid meet"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_15_498)" filter="url(#filter0_d_15_498)">
      <path
        fill="#E6007A"
        d="M42.642 7.764a4.375 4.375 0 0 1 3.033 5.396L32.751 59.205a4.375 4.375 0 1 1-8.426-2.362l12.924-46.051a4.375 4.375 0 0 1 5.396-3.03zM22.05 19.533a4.375 4.375 0 0 1 0 6.183L12.775 35l9.28 9.28a4.375 4.375 0 0 1-6.188 6.187L3.49 38.092a4.375 4.375 0 0 1 0-6.184l12.373-12.375a4.374 4.374 0 0 1 6.186 0m25.9 6.183a4.375 4.375 0 1 1 6.183-6.183L66.51 31.905a4.375 4.375 0 0 1 0 6.187L54.136 50.467a4.377 4.377 0 0 1-7.47-3.092 4.38 4.38 0 0 1 1.281-3.094L57.227 35z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_15_498">
        <path fill="#fff" d="M0 0h70v70H0z"></path>
      </clipPath>
      <filter
        id="filter0_d_15_498"
        width="105.578"
        height="94.802"
        x="-17.788"
        y="-8.402"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="4"></feOffset>
        <feGaussianBlur stdDeviation="10"></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_15_498"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_15_498"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);

export default SvgIcon;