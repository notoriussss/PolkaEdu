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
    <g clipPath="url(#clip0_15_594)" filter="url(#filter0_d_15_594)">
      <path
        fill="#E6007A"
        fillRule="evenodd"
        d="M52.5 30.625a8.75 8.75 0 0 1 8.75 8.75v17.5a8.75 8.75 0 0 1-8.75 8.75h-35a8.75 8.75 0 0 1-8.75-8.75v-17.5a8.75 8.75 0 0 1 8.75-8.75v-8.75a17.5 17.5 0 1 1 35 0zM35 10.208a11.667 11.667 0 0 1 11.667 11.667v8.75H23.333v-8.75A11.667 11.667 0 0 1 35 10.208m17.5 26.25h-35a2.917 2.917 0 0 0-2.917 2.917v17.5a2.917 2.917 0 0 0 2.917 2.917h35a2.917 2.917 0 0 0 2.917-2.917v-17.5a2.917 2.917 0 0 0-2.917-2.917"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_15_594">
        <path fill="#fff" d="M0 0h70v70H0z"></path>
      </clipPath>
      <filter
        id="filter0_d_15_594"
        width="92.5"
        height="101.25"
        x="-11.25"
        y="-11.625"
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
          result="effect1_dropShadow_15_594"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_15_594"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);

export default SvgIcon;
