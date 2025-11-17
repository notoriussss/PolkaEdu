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
      d="M57.542 91.667H25a8.304 8.304 0 0 1-8.333-8.334V16.667A8.333 8.333 0 0 1 25 8.333h33.333l25 25v21.209c-1.375-.209-2.75-.375-4.166-.375s-2.792.166-4.167.375V37.5H54.167V16.667H25v66.666h29.542c.5 3 1.541 5.792 3 8.334M95.833 75h-12.5V62.5H75V75H62.5v8.333H75v12.5h8.333v-12.5h12.5z"
    ></path>
  </svg>
);

export default SvgIcon;
