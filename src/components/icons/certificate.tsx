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
    <g clipPath="url(#clip0_15_600)" filter="url(#filter0_d_15_600)">
      <path
        stroke="#E6007A"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5.833"
        d="M26.25 49.583V61.25L35 55.417l8.75 5.833V49.583M40.708 12.47l-.942-1.295a5.897 5.897 0 0 0-9.532 0l-.942 1.295-1.584-.248a5.89 5.89 0 0 0-6.737 6.737l.248 1.584-1.295.942a5.89 5.89 0 0 0 0 9.532l1.295.942-.248 1.58a5.893 5.893 0 0 0 6.737 6.741l1.584-.248.942 1.295a5.898 5.898 0 0 0 9.532 0l.942-1.295 1.58.248a5.89 5.89 0 0 0 6.741-6.737l-.248-1.584 1.295-.942a5.897 5.897 0 0 0 0-9.532l-1.295-.942.248-1.58a5.892 5.892 0 0 0-6.737-6.741z"
        shapeRendering="crispEdges"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_15_600">
        <path fill="#fff" d="M0 0h70v70H0z"></path>
      </clipPath>
      <filter
        id="filter0_d_15_600"
        width="80.837"
        height="98.333"
        x="-5.421"
        y="-10.167"
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
          result="effect1_dropShadow_15_600"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_15_600"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);

export default SvgIcon;