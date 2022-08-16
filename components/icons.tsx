import * as React from 'react'

type IconProps = React.ComponentProps<'svg'>

export function SearchIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      className="__mantine-ref-icon mantine-1syvhlf"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="5 12 3 12 12 3 21 12 19 12"></polyline>
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
      <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
    </svg>
  )
}

export function StoreIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      className="__mantine-ref-icon mantine-1syvhlf"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="3" y1="21" x2="21" y2="21"></line>
      <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"></path>
      <line x1="5" y1="21" x2="5" y2="10.85"></line>
      <line x1="19" y1="21" x2="19" y2="10.85"></line>
      <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"></path>
    </svg>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      className="__mantine-ref-icon mantine-1syvhlf"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <polyline points="13 3 13 10 19 10 11 21 11 14 5 14 13 3"></polyline>
    </svg>
  )
}

export function FileIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      className="__mantine-ref-icon mantine-1syvhlf"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
    </svg>
  )
}

export function LifebuoyIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      className="__mantine-ref-icon mantine-1syvhlf"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="15" y1="15" x2="18.35" y2="18.35"></line>
      <line x1="9" y1="15" x2="5.65" y2="18.35"></line>
      <line x1="5.65" y1="5.65" x2="9" y2="9"></line>
      <line x1="18.35" y1="5.65" x2="15" y2="9"></line>
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 4.004c-.907 1.411-.686 3.31.5 4.496l4.793 4.793a1 1 0 001.414 0L13.5 8.5c1.186-1.186 1.407-3.085.5-4.496-1.38-2.147-4.584-2.123-6 0-1.416-2.123-4.62-2.147-6 0z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HeartFilledIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 4.004c-.907 1.411-.686 3.31.5 4.496l4.793 4.793a1 1 0 001.414 0L13.5 8.5c1.186-1.186 1.407-3.085.5-4.496-1.38-2.147-4.584-2.123-6 0-1.416-2.123-4.62-2.147-6 0z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MessageIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5 2.513a1 1 0 011 1V11.5a1 1 0 01-1 1H5.37a1 1 0 00-.65.24l-1.57 1.345a1 1 0 01-1.65-.76V3.514a1 1 0 011-1h11z"
        stroke="currentColor"
      />
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.5 4.5L6.35355 7.64645C6.15829 7.84171 6.15829 8.15829 6.35355 8.35355L9.5 11.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.5 11.5l3.146-3.146a.5.5 0 000-.708L6.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EditIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.333 2A1.886 1.886 0 0114 4.667l-9 9-3.667 1 1-3.667 9-9z"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.334 1.334 0 01-1.334-1.334V4h9.334z"
        stroke="currentColor"
        strokeWidth={1.41667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BoldIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 2.667h5.333a2.667 2.667 0 110 5.333H4V2.667z"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8h6a2.667 2.667 0 010 5.333H4V8z"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ItalicIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.667 2.667h-6M9.333 13.333h-6M10 2.667L6 13.333"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ListIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.333 4H14M5.333 8H14M5.333 12H14M2 4h.007M2 8h.007M2 12h.007"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LinkIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.334 3.334 0 008.98 2.313l-1.147 1.14"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.333 7.333a3.334 3.334 0 00-5.026-.36l-2 2a3.333 3.333 0 004.713 4.714l1.14-1.14"
        stroke="currentColor"
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.5 7l-11 11M6.5 7l11 11"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.627 7.449c.23.331.23.77 0 1.102C13.529 10.131 11.554 12.5 8 12.5s-5.53-2.368-6.627-3.949a.966.966 0 010-1.102C2.471 5.869 4.446 3.5 8 3.5s5.53 2.369 6.627 3.949z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path d="M10 8a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
    </svg>
  )
}

export function EyeClosedIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.447 4.435C3.006 5.27 2.032 6.5 1.373 7.448a.967.967 0 000 1.103C2.471 10.131 4.446 12.5 8 12.5c1.429 0 2.602-.383 3.566-.943m1.65-1.286c.09-.09.178-.18.262-.271.463-.498.84-1.004 1.148-1.448a.967.967 0 00.001-1.103C13.529 5.869 11.554 3.5 8 3.5c-.511 0-.99.049-1.438.138"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8a2 2 0 003.41 1.418L6.586 6.586A1.994 1.994 0 006 8z"
        fill="currentColor"
      />
      <path
        d="M13.5 13.5l-11-11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DotsIcon(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 8a1 1 0 11-2 0 1 1 0 012 0zM9 8a1 1 0 11-2 0 1 1 0 012 0zM14 8a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MarkdownIcon(props: IconProps) {
  return (
    <svg
      width={26}
      height={16}
      viewBox="0 0 26 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_33_726)">
        <path
          d="M24.125.625H1.875c-.69 0-1.25.56-1.25 1.25v12.25c0 .69.56 1.25 1.25 1.25h22.25c.69 0 1.25-.56 1.25-1.25V1.875c0-.69-.56-1.25-1.25-1.25z"
          stroke="currentColor"
          strokeWidth={1.29808}
        />
        <path
          d="M3.75 12.25v-8.5h2.5l2.5 3.125 2.5-3.125h2.5v8.5h-2.5V7.375L8.75 10.5l-2.5-3.125v4.875h-2.5zm15.625 0l-3.75-4.125h2.5V3.75h2.5v4.375h2.5l-3.75 4.125z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_33_726">
          <path fill="#fff" d="M0 0H26V16H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export function Logo(props: IconProps) {
  return (
    <svg
      width={533}
      height={232}
      viewBox="0 0 533 232"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M193.606 64.185H207.195V125.077H193.606V64.185Z"
        fill="#E90000"
      />
      <path
        d="M276.71 86.747L260.246 120.024H252.144L235.767 86.747V125.077H222.178V64.185H240.559L256.239 97.637L272.006 64.185H290.3V125.077H276.71V86.747V86.747Z"
        fill="#E90000"
      />
      <path
        d="M347.227 69.63C351.496 73.26 353.63 78.836 353.63 86.356C353.63 93.878 351.437 99.379 347.053 102.864C342.667 106.349 335.974 108.091 326.973 108.091H318.873V125.078H305.283V64.186H326.8C336.15 64.185 342.96 66.001 347.227 69.63ZM337.255 93.586C338.88 91.757 339.694 89.086 339.694 85.571C339.694 82.058 338.634 79.561 336.514 78.079C334.394 76.599 331.098 75.858 326.628 75.858H318.874V96.329H328.02C332.55 96.33 335.626 95.415 337.255 93.586Z"
        fill="#E90000"
      />
      <path
        d="M404.07 125.077L398.407 111.923H372.883L367.221 125.077H352.76L379.068 64.185H392.221L418.529 125.077H404.07ZM385.689 82.305L378.022 99.988H393.267L385.689 82.305Z"
        fill="#E90000"
      />
      <path
        d="M453.549 113.055C460.226 113.055 465.686 110.413 469.925 105.128L478.638 114.1C471.725 121.883 463.58 125.774 454.202 125.774C444.822 125.774 437.099 122.811 431.03 116.888C424.961 110.965 421.926 103.488 421.926 94.457C421.926 85.427 425.02 77.892 431.205 71.851C437.389 65.812 444.953 62.791 453.898 62.791C463.885 62.791 472.249 66.596 478.987 74.203L470.536 83.786C466.237 78.444 460.896 75.771 454.507 75.771C449.396 75.771 445.026 77.442 441.396 80.78C437.766 84.12 435.952 88.62 435.952 94.282C435.952 99.945 437.665 104.489 441.092 107.916C444.517 111.343 448.669 113.055 453.549 113.055Z"
        fill="#E90000"
      />
      <path
        d="M515.136 75.945V125.077H501.547V75.945H484.298V64.185H532.384V75.945H515.136Z"
        fill="#E90000"
      />
      <path
        d="M130.544 21.287L13.02 48.055C7.431 49.328 1.868 45.829 0.595002 40.24C-0.677998 34.651 2.821 29.088 8.41 27.815L125.934 1.047C131.523 -0.226002 137.086 3.273 138.359 8.862C139.633 14.451 136.134 20.014 130.544 21.287Z"
        fill="currentColor"
      />
      <path
        d="M167.755 184.658L50.23 211.426C44.641 212.699 41.142 218.262 42.415 223.851C43.688 229.44 49.251 232.939 54.84 231.666L172.364 204.898C177.953 203.625 181.452 198.062 180.179 192.473C178.907 186.884 173.344 183.385 167.755 184.658Z"
        fill="currentColor"
      />
      <path
        d="M13.087 57.309C12.05 57.309 11.112 56.594 10.872 55.54L7.842 42.239C7.708 41.651 7.814 41.034 8.134 40.523C8.455 40.012 8.966 39.65 9.554 39.516L129.97 12.089C130.556 11.957 131.176 12.061 131.686 12.381C132.196 12.702 132.558 13.213 132.692 13.801L135.721 27.102C136 28.326 135.233 29.545 134.009 29.824L13.593 57.251C13.424 57.29 13.254 57.309 13.087 57.309ZM12.781 43.446L14.801 52.313L130.783 25.896L128.763 17.029L12.781 43.446Z"
        fill="currentColor"
      />
      <path
        d="M50.297 220.68C49.26 220.68 48.322 219.965 48.082 218.911L45.052 205.609C44.918 205.021 45.024 204.404 45.344 203.894C45.665 203.383 46.176 203.021 46.764 202.887L167.18 175.46C167.767 175.328 168.385 175.431 168.896 175.752C169.406 176.073 169.768 176.584 169.902 177.172L172.931 190.473C173.21 191.697 172.443 192.916 171.219 193.195L50.803 220.622C50.634 220.662 50.464 220.68 50.297 220.68ZM49.992 206.817L52.012 215.685L167.994 189.268L165.974 180.401L49.992 206.817Z"
        fill="currentColor"
      />
      <path
        d="M56.908 205.183C56.483 205.183 56.063 205.064 55.698 204.834C55.188 204.513 54.825 204.002 54.691 203.414L20.51 53.344C20.231 52.12 20.998 50.901 22.222 50.622L123.361 27.586C123.948 27.453 124.566 27.558 125.077 27.878C125.587 28.199 125.949 28.71 126.083 29.298L160.264 179.368C160.543 180.592 159.776 181.811 158.552 182.09L57.413 205.126C57.246 205.164 57.077 205.183 56.908 205.183ZM25.449 54.551L58.62 200.188L155.325 178.162L122.154 32.525L25.449 54.551Z"
        fill="currentColor"
      />
      <path
        d="M140.957 112.22C145.033 112.22 148.338 108.915 148.338 104.839C148.338 100.763 145.033 97.458 140.957 97.458C136.881 97.458 133.576 100.763 133.576 104.839C133.576 108.915 136.881 112.22 140.957 112.22Z"
        fill="currentColor"
      />
      <path
        d="M39.818 135.256C43.8944 135.256 47.199 131.951 47.199 127.875C47.199 123.799 43.8944 120.494 39.818 120.494C35.7416 120.494 32.437 123.799 32.437 127.875C32.437 131.951 35.7416 135.256 39.818 135.256Z"
        fill="currentColor"
      />
      <path
        d="M84.146 198.979C83.763 198.979 83.383 198.882 83.044 198.694C72.699 192.959 66.414 185.36 64.362 176.11C61.222 161.952 68.893 148.626 73.745 141.944C81.665 130.683 81.612 124.086 80.371 118.639C79.13 113.192 76.322 107.222 64.276 100.485C57.038 96.579 44.353 87.891 41.053 73.77C38.896 64.543 41.271 54.971 48.112 45.322C48.435 44.865 48.916 44.544 49.462 44.42L96.126 33.792C96.671 33.67 97.244 33.749 97.734 34.021C108.078 39.756 114.364 47.355 116.417 56.606C119.557 70.764 111.886 84.089 107.034 90.772C99.113 102.034 99.167 108.63 100.408 114.077C101.648 119.524 104.457 125.494 116.503 132.231C123.741 136.137 136.425 144.825 139.726 158.946C141.883 168.173 139.508 177.744 132.668 187.394C132.345 187.851 131.863 188.172 131.318 188.296L84.654 198.924C84.484 198.96 84.314 198.979 84.146 198.979ZM51.327 48.657C45.65 56.951 43.682 65.048 45.479 72.734C47.594 81.781 55.243 90.443 66.464 96.499C80.127 104.14 83.4 111.467 84.803 117.628C86.206 123.789 86.429 131.811 77.443 144.587C69.931 154.934 66.788 166.054 68.8 175.125C70.509 182.831 75.789 189.276 84.498 194.294L129.447 184.056C135.124 175.762 137.092 167.665 135.295 159.979C133.18 150.932 125.531 142.27 114.309 136.214C100.646 128.572 97.373 121.246 95.971 115.085C94.567 108.924 94.344 100.904 103.331 88.126C110.843 77.78 113.986 66.66 111.975 57.589C110.265 49.883 104.985 43.437 96.276 38.419L51.327 48.657Z"
        fill="currentColor"
      />
      <path
        d="M121.504 148.941C118.971 143.374 112.595 140.714 106.83 142.758C103.882 143.803 101.733 145.774 100.289 148.543C99.621 149.822 99.325 151.22 98.97 152.598C98.918 152.797 98.799 153.285 98.799 153.285C98.799 153.285 98.478 152.896 98.346 152.741C98.215 152.585 98.085 152.429 97.955 152.273C97.681 151.943 97.236 151.834 96.825 151.96C96.68 152.004 96.531 152.041 96.377 152.071C96.045 152.134 95.718 152.156 95.406 152.141C94.6 152.103 93.783 152.258 93.048 152.59C92.763 152.719 92.451 152.818 92.119 152.881C91.786 152.945 91.458 152.967 91.145 152.952C90.34 152.913 89.523 153.07 88.788 153.401C88.503 153.53 88.191 153.629 87.859 153.692C87.526 153.756 87.199 153.778 86.886 153.763C86.08 153.724 85.263 153.882 84.527 154.213C84.243 154.341 83.931 154.44 83.6 154.503C83.267 154.567 82.94 154.589 82.627 154.574C81.822 154.535 81.004 154.692 80.269 155.024C79.985 155.152 79.673 155.252 79.342 155.315C78.844 155.41 78.358 155.412 77.915 155.336C77.397 155.247 76.912 155.621 76.787 156.131C76.543 157.125 76.426 158.167 76.451 159.242C76.53 162.501 77.746 165.392 79.74 167.959C80.943 169.507 82.418 170.826 84.013 171.966C87.451 174.422 91.188 176.373 94.888 178.378C102.302 182.394 106.235 186.139 106.292 186.189C106.322 186.118 108.246 181.04 113.189 174.21C115.672 170.781 118.211 167.384 120.25 163.655C121.167 161.979 121.906 160.199 122.315 158.334C123.022 155.116 122.871 151.946 121.504 148.941Z"
        fill="#E90000"
      />
      <path
        d="M86.814 145.715C86.809 145.712 86.803 145.709 86.798 145.707C86.399 145.508 85.91 145.635 85.668 146.002C85.505 146.249 84.993 146.993 84.993 146.993C84.989 146.999 84.985 147.005 84.98 147.011C84.693 147.419 84.808 147.978 85.233 148.248C85.66 148.518 86.231 148.393 86.497 147.97C86.673 147.69 86.895 147.334 87.16 146.907C87.421 146.487 87.262 145.938 86.814 145.715Z"
        fill="#E90000"
      />
      <path
        d="M83.594 150.395C83.59 150.391 83.584 150.389 83.58 150.386C83.226 150.159 82.783 150.283 82.556 150.674C82.404 150.937 81.926 151.729 81.926 151.729C81.922 151.735 81.918 151.742 81.914 151.748C81.646 152.182 81.736 152.791 82.113 153.095C82.49 153.4 83.007 153.28 83.257 152.829C83.422 152.53 83.63 152.152 83.878 151.695C84.121 151.248 83.992 150.649 83.594 150.395Z"
        fill="#E90000"
      />
      <path
        d="M89.924 139.264C89.915 139.259 89.906 139.255 89.897 139.25C89.436 139.015 88.876 139.218 88.678 139.696C88.341 140.511 87.974 141.334 87.573 142.167C87.395 142.536 87.484 142.975 87.783 143.255C87.788 143.26 87.793 143.264 87.798 143.269C88.266 143.706 89.029 143.542 89.283 142.954C89.664 142.073 90.022 141.217 90.356 140.378C90.527 139.952 90.335 139.471 89.924 139.264Z"
        fill="#E90000"
      />
      <path
        d="M91.143 133.663L91.12 133.66C90.664 133.595 90.233 133.882 90.115 134.327C89.965 134.892 89.802 135.459 89.62 136.03C89.493 136.43 89.661 136.863 90.024 137.074C90.031 137.078 90.037 137.082 90.044 137.085C90.531 137.366 91.157 137.13 91.334 136.596C91.534 135.994 91.719 135.399 91.889 134.807C92.04 134.28 91.686 133.741 91.143 133.663Z"
        fill="#E90000"
      />
      <path
        d="M107.668 61.576C100.518 68.576 87.824 70.961 79.381 68.019C70.938 65.076 58.237 67.464 51.087 74.463C53.719 81.139 60.003 87.504 68.767 92.231L68.863 92.279C81.023 99.085 87.208 106.343 89.532 116.548C89.58 116.757 89.623 116.965 89.664 117.173C89.746 117.59 90.121 117.883 90.545 117.869C90.551 117.869 90.557 117.869 90.563 117.868C91.101 117.85 91.489 117.35 91.382 116.823C91.338 116.604 91.291 116.383 91.239 116.159C88.915 105.954 91.346 96.734 99.359 85.333L99.425 85.248C105.279 77.191 108.187 68.733 107.668 61.576Z"
        fill="#E90000"
      />
      <path
        d="M91.456 123.452C90.943 123.468 90.543 123.896 90.555 124.408C90.565 124.832 90.565 125.256 90.556 125.681C90.546 126.179 90.922 126.601 91.418 126.642C91.966 126.687 92.434 126.256 92.438 125.706C92.441 125.256 92.433 124.8 92.415 124.339C92.395 123.831 91.964 123.437 91.456 123.452Z"
        fill="#E90000"
      />
      <path
        d="M91.127 121.828C91.665 121.828 92.081 121.361 92.023 120.826C91.984 120.459 91.938 120.088 91.886 119.711C91.824 119.267 91.434 118.945 90.986 118.964C90.97 118.965 90.954 118.965 90.939 118.966C90.432 118.987 90.056 119.44 90.118 119.944C90.161 120.297 90.198 120.65 90.229 121.002C90.27 121.469 90.659 121.828 91.127 121.828Z"
        fill="#E90000"
      />
      <path
        d="M91.491 128.099C90.979 128.098 90.562 128.503 90.542 129.015C90.515 129.696 90.464 130.381 90.391 131.07C90.337 131.574 90.699 132.022 91.204 132.079C91.217 132.08 91.229 132.082 91.242 132.083C91.742 132.142 92.201 131.793 92.26 131.293C92.347 130.557 92.407 129.821 92.438 129.08C92.46 128.545 92.027 128.1 91.491 128.099Z"
        fill="#E90000"
      />
      <path
        d="M344.976 153.262L337.227 168.924H333.414L325.706 153.262V171.302H319.31V142.643H327.961L335.341 158.387L342.762 142.643H351.372V171.302H344.976V153.262V153.262Z"
        fill="currentColor"
      />
      <path
        d="M380.892 171.302L378.227 165.111H366.214L363.549 171.302H356.742L369.124 142.643H375.315L387.697 171.302H380.892ZM372.24 151.171L368.633 159.494H375.808L372.24 151.171Z"
        fill="currentColor"
      />
      <path
        d="M416.316 152.155C416.316 156.747 414.499 159.713 410.863 161.052L418.121 171.302H410.249L403.894 162.159H399.466V171.302H393.07V142.643H403.935C408.39 142.643 411.568 143.395 413.467 144.898C415.365 146.401 416.316 148.82 416.316 152.155ZM408.608 155.557C409.401 154.847 409.797 153.719 409.797 152.175C409.797 150.631 409.387 149.571 408.567 148.997C407.748 148.423 406.312 148.136 404.262 148.136H399.465V156.623H404.139C406.325 156.623 407.815 156.269 408.608 155.557Z"
        fill="currentColor"
      />
      <path
        d="M424.925 142.642H431.321V154.409L442.145 142.642H450.058L438.66 155.311C439.644 156.678 441.462 159.227 444.113 162.958C446.763 166.689 448.746 169.47 450.058 171.301H442.595L434.191 159.985L431.321 163.183V171.301H424.925V142.642Z"
        fill="currentColor"
      />
      <path
        d="M476.749 142.642V148.341H462.48V154.245H475.313V159.698H462.48V165.643H477.2V171.301H456.085V142.642H476.749Z"
        fill="currentColor"
      />
      <path
        d="M497.085 148.178V171.302H490.689V148.178H482.571V142.643H505.203V148.178H497.085Z"
        fill="currentColor"
      />
      <path
        d="M518.384 148.362C517.769 148.868 517.461 149.537 517.461 150.371C517.461 151.205 517.837 151.868 518.589 152.36C519.34 152.852 521.075 153.433 523.796 154.102C526.515 154.772 528.627 155.777 530.13 157.116C531.633 158.455 532.385 160.41 532.385 162.979C532.385 165.549 531.422 167.633 529.494 169.232C527.567 170.831 525.032 171.63 521.889 171.63C517.352 171.63 513.265 169.949 509.63 166.587L513.443 161.913C516.531 164.619 519.387 165.972 522.011 165.972C523.186 165.972 524.109 165.72 524.779 165.214C525.449 164.709 525.784 164.025 525.784 163.164C525.784 162.303 525.429 161.62 524.718 161.114C524.007 160.609 522.6 160.096 520.495 159.576C517.16 158.784 514.721 157.752 513.177 156.481C511.632 155.21 510.861 153.215 510.861 150.495C510.861 147.776 511.838 145.678 513.793 144.202C515.746 142.726 518.186 141.988 521.111 141.988C523.024 141.988 524.937 142.316 526.85 142.972C528.763 143.628 530.431 144.557 531.853 145.76L528.614 150.434C526.127 148.548 523.556 147.605 520.906 147.605C519.839 147.603 518.999 147.857 518.384 148.362Z"
        fill="currentColor"
      />
      <path
        d="M213.86 34.176H220.298V44.344C217.456 47.515 213.519 49.1 208.489 49.1C204.28 49.1 200.747 47.706 197.891 44.918C195.034 42.13 193.606 38.611 193.606 34.36C193.606 30.11 195.063 26.564 197.973 23.721C200.883 20.878 204.397 19.457 208.51 19.457C212.623 19.457 216.198 20.81 219.231 23.516L215.911 28.313C214.626 27.192 213.444 26.42 212.364 25.997C211.284 25.574 210.116 25.361 208.858 25.361C206.426 25.361 204.376 26.188 202.71 27.841C201.042 29.495 200.208 31.674 200.208 34.381C200.208 37.088 201.007 39.254 202.606 40.88C204.206 42.506 206.112 43.319 208.327 43.319C210.54 43.319 212.386 42.896 213.86 42.048V34.176V34.176Z"
        fill="currentColor"
      />
      <path
        d="M252.155 44.816C249.258 47.645 245.691 49.06 241.454 49.06C237.218 49.06 233.65 47.645 230.754 44.816C227.856 41.987 226.407 38.468 226.407 34.258C226.407 30.049 227.855 26.529 230.754 23.701C233.65 20.872 237.218 19.457 241.454 19.457C245.691 19.457 249.258 20.872 252.155 23.701C255.052 26.53 256.502 30.049 256.502 34.258C256.502 38.468 255.052 41.987 252.155 44.816ZM249.982 34.279C249.982 31.724 249.162 29.544 247.522 27.739C245.882 25.935 243.866 25.033 241.474 25.033C239.082 25.033 237.067 25.935 235.427 27.739C233.786 29.543 232.967 31.723 232.967 34.279C232.967 36.835 233.786 39.008 235.427 40.798C237.067 42.589 239.082 43.484 241.474 43.484C243.866 43.484 245.882 42.589 247.522 40.798C249.162 39.008 249.982 36.835 249.982 34.279Z"
        fill="currentColor"
      />
      <path
        d="M288.07 44.816C285.173 47.645 281.606 49.06 277.369 49.06C273.133 49.06 269.565 47.645 266.669 44.816C263.771 41.987 262.322 38.468 262.322 34.258C262.322 30.049 263.77 26.529 266.669 23.701C269.565 20.872 273.133 19.457 277.369 19.457C281.606 19.457 285.173 20.872 288.07 23.701C290.967 26.53 292.417 30.049 292.417 34.258C292.417 38.468 290.968 41.987 288.07 44.816ZM285.897 34.279C285.897 31.724 285.077 29.544 283.437 27.739C281.797 25.935 279.781 25.033 277.389 25.033C274.997 25.033 272.982 25.935 271.342 27.739C269.701 29.543 268.882 31.723 268.882 34.279C268.882 36.835 269.701 39.008 271.342 40.798C272.982 42.589 274.997 43.484 277.389 43.484C279.781 43.484 281.797 42.589 283.437 40.798C285.077 39.008 285.897 36.835 285.897 34.279Z"
        fill="currentColor"
      />
      <path
        d="M321.772 23.865C324.505 26.366 325.872 29.845 325.872 34.3C325.872 38.756 324.54 42.282 321.875 44.878C319.21 47.475 315.144 48.773 309.678 48.773H299.879V20.114H310.006C315.116 20.113 319.039 21.364 321.772 23.865ZM317.078 40.9C318.649 39.424 319.435 37.278 319.435 34.463C319.435 31.648 318.649 29.482 317.078 27.964C315.506 26.447 313.094 25.689 309.842 25.689H306.275V43.114H310.335C313.258 43.114 315.506 42.377 317.078 40.9Z"
        fill="currentColor"
      />
      <path
        d="M348.505 20.113H356.213L347.275 33.93L356.951 48.772H349.161L343.052 39.342L336.985 48.772H329.277L338.912 34.094L329.933 20.113H337.6L343.052 28.6L348.505 20.113Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function GithubLogo(props: IconProps) {
  return (
    <svg
      width={17}
      height={16}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.5 0C3.806 0 0 3.668 0 8.192c0 3.62 2.436 6.69 5.813 7.774.425.075.58-.178.58-.395 0-.195-.007-.84-.01-1.525-2.366.496-2.865-.966-2.865-.966-.386-.947-.943-1.199-.943-1.199-.772-.508.058-.498.058-.498.853.058 1.303.844 1.303.844.758 1.253 1.988.89 2.473.681.077-.53.297-.89.54-1.095-1.888-.207-3.873-.91-3.873-4.049 0-.894.332-1.625.876-2.199-.088-.206-.38-1.04.082-2.168 0 0 .714-.22 2.339.84A8.435 8.435 0 018.5 3.961c.722.004 1.45.095 2.13.276 1.622-1.06 2.335-.84 2.335-.84.462 1.129.171 1.962.083 2.168.545.574.875 1.305.875 2.2 0 3.146-1.989 3.838-3.882 4.041.305.255.577.753.577 1.517 0 1.096-.01 1.979-.01 2.248 0 .218.153.474.584.393C14.568 14.88 17 11.81 17 8.192 17 3.668 13.194 0 8.5 0zM3.184 11.67c-.02.04-.086.053-.146.025-.062-.027-.096-.082-.076-.123.018-.042.084-.054.146-.026.062.027.097.083.076.124zm.418.36c-.04.036-.12.019-.174-.038-.055-.058-.066-.134-.025-.17.042-.037.119-.02.175.037.055.058.066.134.024.17zm.287.46c-.053.034-.138.002-.19-.071-.052-.073-.052-.16 0-.196.054-.035.137-.003.19.07.053.073.053.16 0 .196zm.485.532c-.047.05-.146.036-.219-.031-.074-.066-.095-.16-.048-.21.047-.05.147-.035.22.032.074.066.096.16.047.21zm.627.18c-.021.064-.117.093-.213.066-.096-.028-.159-.103-.14-.168.02-.065.117-.095.213-.066.096.028.16.103.14.168zm.713.076c.002.068-.08.124-.18.125-.102.002-.184-.052-.185-.119 0-.068.08-.124.181-.125.101-.002.184.052.184.12zm.701-.026c.012.066-.058.134-.159.152-.098.017-.19-.023-.202-.089-.012-.067.06-.135.158-.152.1-.017.19.022.203.09z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export function InfoIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 120 120"
      {...props}
    >
      <circle
        stroke="currentColor"
        strokeWidth={10}
        fill="none"
        cx={60}
        cy={60}
        r={54}
      />
      <circle
        stroke="none"
        strokeWidth={5}
        fill="currentColor"
        cx={60}
        cy={31}
        r={10}
      />
      <rect
        stroke="none"
        strokeWidth={5}
        fill="currentColor"
        width={20}
        height={48}
        x={50}
        y={50}
      />
    </svg>
  )
}
