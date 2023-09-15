import React, { memo } from "react";

const Loader = memo(
  ({ className, full = false, size = 35, color, speed = "1s" }) => {
    const Icon = (props) => {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="eHUFWA2qhQM1"
          strokeLinejoin="round"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          viewBox="0 0 334.81 334.41"
          {...props}
        >
          <style>
            {
              "@keyframes eHUFWA2qhQM3_tr__tr{0%{transform:translate(167.405395px,167.205002px) rotate(0deg)}60%{transform:translate(167.405395px,167.205002px) rotate(360deg)}to{transform:translate(167.405395px,167.205002px) rotate(720deg)}}@keyframes eHUFWA2qhQM4_to__to{0%,50%,to{transform:translate(85.855176px,167.209999px)}60%,93.333333%{transform:translate(43.421618px,167.209999px)}}@keyframes eHUFWA2qhQM4_c_o{0%,53.333333%,to{opacity:1}60%,93.333333%{opacity:0}}@keyframes eHUFWA2qhQM24_to__to{0%,40%,93.333333%,to{transform:translate(97.365003px,248.529999px)}50%,86.666667%{transform:translate(80.75px,288.859107px)}}@keyframes eHUFWA2qhQM24_c_o{0%,43.333333%,93.333333%,to{opacity:1}50%,86.666667%{opacity:0}}@keyframes eHUFWA2qhQM40_to__to{0%,30%,86.666667%,to{transform:translate(236.795006px,248.144997px)}40%,80%{transform:translate(268.721733px,280.759994px)}}@keyframes eHUFWA2qhQM40_c_o{0%,33.333333%,86.666667%,to{opacity:1}40%,80%{opacity:0}}@keyframes eHUFWA2qhQM57_to__to{0%,20%,80%,to{transform:translate(248.955216px,167.470001px)}30%,73.333333%{transform:translate(291.923206px,167.470001px)}}@keyframes eHUFWA2qhQM57_c_o{0%,23.333333%,80%,to{opacity:1}30%,73.333333%{opacity:0}}@keyframes eHUFWA2qhQM75_to__to{0%,10%,73.333333%,to{transform:translate(236.795006px,86.394996px)}20%,66.666667%{transform:translate(254.414741px,55.705003px)}}@keyframes eHUFWA2qhQM75_c_o{0%,13.333333%,73.333333%,to{opacity:1}20%,66.666667%{opacity:0}}@keyframes eHUFWA2qhQM94_to__to{0%,66.666667%,to{transform:translate(97.080004px,85.900002px)}10%,60%{transform:translate(79.63px,50.347123px)}}@keyframes eHUFWA2qhQM94_c_o{0%,3.333333%,66.666667%,to{opacity:1}10%,60%{opacity:0}}"
            }
          </style>
          <g
            style={{
              animation:
                "eHUFWA2qhQM3_tr__tr 3000ms linear infinite normal forwards",
            }}
          >
            <g
              style={{
                animation:
                  "eHUFWA2qhQM4_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM4_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="m27.76 246.57 137.45-79.36-137.5-79.38c-28.28 49.142-28.28 109.618 0 158.76l137.5-79.38"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M27.71 246.59c-28.28-49.142-28.28-109.618 0-158.76"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(56.39 189.63)"
                />
                <circle
                  r={14.11}
                  fill="#f8ac1f"
                  transform="translate(66.64 199.48)"
                />
                <circle
                  r={14.11}
                  fill="#f8ac1f"
                  transform="translate(39.15 130.58)"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(119.88 160.6)"
                />
                <circle
                  r={6.37}
                  fill="#f8ac1f"
                  transform="translate(126.64 166.97)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(76.84 148.28)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(48.58 197.83)"
                />
                <path
                  fill="#009843"
                  d="M49.26 119a23.55 23.55 0 0 0-2.8 6.83c-.16.68.84.9 1.31.84a1.74 1.74 0 0 0 1.61-1.11 21.48 21.48 0 0 1 2.62-6.29c.37-.6-.32-1.07-.85-1.1a2.07 2.07 0 0 0-1.89.86ZM33.26 147.41l.39 2.71c0 .26.37.43.58.49a2 2 0 0 0 1.09 0c.55-.16 1.32-.56 1.22-1.24l-.38-2.71c0-.26-.38-.43-.59-.49a2.12 2.12 0 0 0-1.09 0c-.55.16-1.32.56-1.22 1.24ZM46.76 150.21a20.55 20.55 0 0 0 2.56 8.68c.35.63 1.45.55 2 .27s1-.92.66-1.58a18.44 18.44 0 0 1-2.27-7.58 1.16 1.16 0 0 0-1.36-1c-.56 0-1.64.48-1.59 1.22ZM33.7 172.57V178c0 .2.42.29.53.3.36.042.724.008 1.07-.1.46-.13 1.29-.39 1.29-1v-5.42c0-.2-.42-.29-.53-.3a2.57 2.57 0 0 0-1.07.1c-.46.13-1.29.39-1.29 1ZM87 183.62l13.46-9.81c.49-.35.29-.83-.25-.93a2.84 2.84 0 0 0-2 .55l-13.46 9.8c-.49.36-.29.84.25.94a2.84 2.84 0 0 0 2-.55ZM101.44 156.31a104.14 104.14 0 0 0 10.1 12.92c.49.54 3.18-.49 2.73-1a102.41 102.41 0 0 1-9.93-12.71c-.47-.72-3.14.41-2.9.78ZM41.72 220.75l-.36 4.25c0 .62.81.64 1.24.57a2.87 2.87 0 0 0 1.1-.37c.19-.12.53-.33.56-.58l.36-4.26c.05-.62-.81-.64-1.24-.58a3 3 0 0 0-1.1.37c-.19.13-.53.33-.56.59ZM95.11 187.6l-2.74 10.74c-.12.46.93.25 1.14.21a5.26 5.26 0 0 0 1.11-.33c.17-.08.55-.23.6-.42L98 187.07c.12-.47-.93-.26-1.15-.22a4.83 4.83 0 0 0-1.1.34c-.17.07-.55.22-.6.41ZM74.83 194.79l-2.2 10.4c-.28 1.3 2.67.89 2.92-.28l2.2-10.39c.28-1.3-2.67-.9-2.92.27ZM128.31 168.13a83 83 0 0 1 11.22-2.62c.6-.1 1.51-.4 1.61-1.13s-.79-.94-1.32-.86a88.05 88.05 0 0 0-12 2.77c-.52.16-1.39.62-1.2 1.31s1.18.69 1.69.53Z"
                />
              </g>
            </g>
            <g
              style={{
                animation:
                  "eHUFWA2qhQM24_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM24_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="M166.11 327.86V169.15L28.62 248.53c28.417 49.063 80.792 79.302 137.49 79.38V169.15"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M166.11 327.91c-56.698-.078-109.073-30.317-137.49-79.38"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(121.98 219.79)"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(128.18 225.6)"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(127.36 284.08)"
                />
                <circle
                  r={10.06}
                  fill="#f8ac1f"
                  transform="translate(133.56 289.89)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(136.92 233.71)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(79.63 250.35)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(139.63 297.58)"
                />
                <path
                  fill="#009843"
                  d="m98.08 228.7 7 13.55c.39.76 3.16-.25 2.9-.77l-7-13.56c-.39-.75-3.16.26-2.89.78ZM141.1 198.38a23.14 23.14 0 0 1-6.17 7.88c-.52.43.46.55.7.53a3.51 3.51 0 0 0 1.94-.71 24.25 24.25 0 0 0 6.4-8.19c.24-.5-1-.36-1.17-.33-.5.09-1.44.29-1.7.82ZM121.45 263.79a153.42 153.42 0 0 0 16.19-.3 2.75 2.75 0 0 0 1.93-.73c.37-.51-.32-.64-.72-.61a144.25 144.25 0 0 1-15.56.31 3.23 3.23 0 0 0-2.05.55c-.4.32-.42.76.21.78ZM107 275.54a79.86 79.86 0 0 0 .64 13.56c.11.76 3 .14 2.9-.78a79.81 79.81 0 0 1-.64-13.56c0-.65-2.86-.21-2.9.78ZM75.26 271.58c-3.19-1-6.34-2.07-9.43-3.33a2.3 2.3 0 0 0-2 .25c-.37.24-.91.93-.24 1.2 3.26 1.33 6.59 2.5 10 3.52a2.36 2.36 0 0 0 2-.55c.47-.45.3-.92-.29-1.09ZM158.07 276.46v8.9c0 .67.73.85 1.3.78s1.62-.4 1.62-1.08v-8.9c0-.67-.73-.85-1.29-.78s-1.63.41-1.63 1.08Z"
                />
              </g>
            </g>
            <g
              style={{
                animation:
                  "eHUFWA2qhQM40_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM40_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="m305.49 248.12-137.44-79.36v158.77c56.702-.076 109.079-30.32 137.49-79.39l-137.49-79.38"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M305.54 248.14c-28.411 49.07-80.788 79.314-137.49 79.39"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={16.82}
                  ry={11.36}
                  transform="translate(191.84 209.09)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={16.82}
                  ry={11.36}
                  transform="translate(202.19 215.64)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={16.82}
                  ry={11.36}
                  transform="translate(200.83 281.65)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={16.82}
                  ry={11.36}
                  transform="translate(211.18 288.2)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(213.48 221.71)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(203.02 289.06)"
                />
                <path
                  fill="#009843"
                  d="M184.78 197.47a27 27 0 0 1-1.16 8.13.7.7 0 0 0 .34.67 1.59 1.59 0 0 0 1 .2 1.78 1.78 0 0 0 1.61-1.13 26.6 26.6 0 0 0 1.15-8.13c0-.68-.71-.93-1.32-.86s-1.61.42-1.6 1.12ZM181.77 232.47h4.64a3.42 3.42 0 0 0 1.14-.24 2.1 2.1 0 0 0 .79-.49c.4-.53-.35-.63-.72-.63H183a3.19 3.19 0 0 0-1.13.25 1.91 1.91 0 0 0-.8.49c-.39.52.35.62.73.62ZM192.91 245a164.73 164.73 0 0 0-9.1 16.32c-.32.64.29 1.15.89 1.23a1.9 1.9 0 0 0 1.88-.89 162.81 162.81 0 0 1 9.11-16.32c.39-.61-.35-1.16-.89-1.23a2 2 0 0 0-1.89.89ZM203.55 258.26a121.57 121.57 0 0 0 23.19 1.24c1.61-.06 2.27-2.09.29-2a117.93 117.93 0 0 1-22.45-1.24c-1.37-.21-3 1.71-1 2ZM245.58 233.72a120.2 120.2 0 0 1 4.66 14.71c.21.86 3.11.11 2.9-.77a120.2 120.2 0 0 0-4.66-14.66c-.34-.88-3.2 0-2.9.77ZM241.88 274.28l-5.94 11.55c-.32.63.3 1.11.88 1.17a2 2 0 0 0 1.89-.87l5.93-11.55c.33-.63-.29-1.11-.87-1.17a2 2 0 0 0-1.89.87ZM183.2 302.07a40.45 40.45 0 0 0-.73 7.53c0 .65 2.9.19 2.9-.78a38.79 38.79 0 0 1 .71-7.2c.1-.57-.88-.48-1.2-.43a3.61 3.61 0 0 0-1.11.36c-.19.11-.52.28-.57.52ZM267.44 257.54a74.27 74.27 0 0 0 10-5.64 1 1 0 0 0 .14-1.58 1.86 1.86 0 0 0-2.09.15 69.37 69.37 0 0 1-9.35 5.24c-.56.26-1.09 1-.67 1.57a1.66 1.66 0 0 0 2 .26Z"
                />
              </g>
            </g>
            <g
              style={{
                animation:
                  "eHUFWA2qhQM57_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM57_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="m307 88.12-137.4 79.35 137.49 79.38c28.294-49.138 28.294-109.622 0-158.76L169.6 167.47"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M307.09 88.09c28.294 49.138 28.294 109.622 0 158.76"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={7.74}
                  ry={10.06}
                  transform="rotate(-81.29 248.351 -79.868)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.85}
                  ry={14.11}
                  transform="rotate(-81.29 250.153 -89.376)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.85}
                  ry={14.11}
                  transform="rotate(-81.29 220.585 -42.618)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={7.74}
                  ry={10.06}
                  transform="rotate(-81.29 207.038 -93.775)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={4.9}
                  ry={6.37}
                  transform="rotate(-81.29 208.149 -99.996)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(213.82 166.74)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(258.72 147.77)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(287.36 198.48)"
                />
                <path
                  fill="#009843"
                  d="M245.21 176.92a34.47 34.47 0 0 0 1.11 12.17c.23.8 3.13 0 2.9-.78a33.55 33.55 0 0 1-1.14-11.84c0-.57-.83-.48-1.2-.42s-1.63.34-1.67.87ZM257.78 183.37c3.19-2.09 7-2.84 10.64-3.74a34 34 0 0 0 10.63-4.12c.49-.33.31-.67-.2-.75a3.25 3.25 0 0 0-2.05.55c-3.19 2.09-7 2.85-10.64 3.75a33.74 33.74 0 0 0-10.63 4.11c-.5.33-.32.67.2.74a3.32 3.32 0 0 0 2-.54ZM291.41 150.86a193.83 193.83 0 0 1 8.43 23.49c.32 1.13 3.21.34 2.89-.77a193.32 193.32 0 0 0-8.42-23.5c-.48-1.1-3.34-.24-2.9.78ZM280 114.47a89.39 89.39 0 0 0 .43 10.35c.08.73 1.22.79 1.73.65a1.39 1.39 0 0 0 1.17-1.42 86.26 86.26 0 0 1-.39-9.78c0-.72-.71-1-1.35-1s-1.58.47-1.59 1.2ZM235.56 140.44l-.85 8.9c-.14 1.41 2.81 1 2.93-.26l.85-8.89c.13-1.42-2.81-1-2.93.25ZM282.29 222.23l7.31 4.71c.316.13.664.165 1 .1a2.78 2.78 0 0 0 1.09-.38c.44-.28.83-.75.26-1.11l-7.31-4.71a1.75 1.75 0 0 0-1-.09 2.62 2.62 0 0 0-1.09.37c-.44.29-.83.75-.26 1.11ZM306.47 198.89a13.44 13.44 0 0 1-3.45 8.29.8.8 0 0 0 .36 1.36 2.08 2.08 0 0 0 2.05-.55 15.36 15.36 0 0 0 4-9.34c.08-1.46-2.86-1-2.93.24Z"
                />
              </g>
            </g>
            <g
              style={{
                animation:
                  "eHUFWA2qhQM75_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM75_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="M168.05 7.08v158.71l137.49-79.38C277.13 37.335 224.755 7.084 168.05 7v158.79"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M168.05 7c56.705.084 109.08 30.335 137.49 79.41"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.06}
                  ry={7.74}
                  transform="rotate(-57.97 179.182 -120.154)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={14.11}
                  ry={10.85}
                  transform="rotate(-57.97 191.214 -115.2)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={14.11}
                  ry={10.85}
                  transform="rotate(-57.97 137.692 -166.824)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.06}
                  ry={7.74}
                  transform="rotate(-57.97 208.725 -170.774)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={6.37}
                  ry={4.9}
                  transform="rotate(-57.97 216.593 -167.607)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(205.73 110.99)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(206.51 48.28)"
                />
                <path
                  fill="#009843"
                  d="M180.57 124.45a87.54 87.54 0 0 1-1.66 14.7c-.25 1.29 2.69.87 2.92-.29a86.38 86.38 0 0 0 1.65-14.69c0-1.38-2.88-.87-2.91.28ZM178.6 87.54v16.64c0 .47 2.9.06 2.9-.78V86.76c0-.47-2.9-.06-2.9.78ZM198.09 88.08a149.33 149.33 0 0 1 16.66-.33 2 2 0 0 0 1.9-.85c.29-.61-.26-1.08-.85-1.1a153.2 153.2 0 0 0-17.41.33c-.59 0-1.53.42-1.61 1.11s.79.88 1.31.84ZM183.54 47.05l-1.13 11.61c-.12 1.24 2.8.72 2.91-.33l1.13-11.61c.12-1.24-2.8-.73-2.91.33ZM234.88 62.15a67.17 67.17 0 0 1 17.79-3c.6 0 1.53-.44 1.62-1.11s-.8-.87-1.32-.85a70.2 70.2 0 0 0-18.58 3.13c-.53.17-1.37.61-1.2 1.3s1.2.68 1.69.53ZM235.89 82.12a198 198 0 0 0 .71 20.52c.05.53 3 0 2.9-.78a197.88 197.88 0 0 1-.71-20.52c0-.45-2.89-.06-2.9.78ZM261.44 88.25l19.84-7.08c.36-.13 1.17-.58.8-1s-1.5-.11-1.9 0l-19.84 7.08c-.36.13-1.18.58-.81 1s1.5.11 1.91 0ZM260.65 69.1V78c0 .67.73.86 1.3.79s1.62-.41 1.62-1.08v-8.9c0-.67-.72-.86-1.29-.79s-1.63.41-1.63 1.08ZM175.39 18.64a38.35 38.35 0 0 0 4.06 14.28c.4.79 3.19-.21 2.9-.78a38.16 38.16 0 0 1-4.06-14.28c-.06-.65-3-.1-2.9.78Z"
                />
              </g>
            </g>
            <g
              style={{
                animation:
                  "eHUFWA2qhQM94_to__to 3000ms linear infinite normal forwards",
              }}
            >
              <g
                style={{
                  animation:
                    "eHUFWA2qhQM94_c_o 3000ms linear infinite normal forwards",
                }}
                transform="matrix(.79563 0 0 .79563 34.212 34.17)"
              >
                <path
                  fill="#fecc49"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  d="m28.36 86 137.49 79.27-.1-158.77C109.044 6.617 56.685 36.903 28.31 86l137.54 79.3"
                />
                <path
                  fill="none"
                  stroke="#cb8635"
                  strokeMiterlimit={10}
                  strokeWidth={13}
                  d="M28.31 86C56.685 36.903 109.044 6.617 165.75 6.5"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={7.74}
                  ry={10.06}
                  transform="rotate(-26.22 301.13 -193.689)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.85}
                  ry={14.11}
                  transform="rotate(-26.22 318.35 -215.51)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={10.85}
                  ry={14.11}
                  transform="rotate(-26.22 180.986 -135.703)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={7.74}
                  ry={10.06}
                  transform="rotate(-26.22 214.407 -283.956)"
                />
                <ellipse
                  fill="#f8ac1f"
                  rx={4.9}
                  ry={6.37}
                  transform="rotate(-26.22 225.476 -298.311)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(135.04 107)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(82.4 83)"
                />
                <circle
                  r={13.18}
                  fill="#ec612d"
                  transform="translate(137.75 42.75)"
                />
                <path
                  fill="#009843"
                  d="M98.91 45.32a9.11 9.11 0 0 0-1.06 9.75 9.43 9.43 0 0 0 8.51 4.85l-1.35-1v1.09c0 .72.67 1 1.35 1s1.62-.48 1.59-1.19v-1.09c0-.76-.67-1-1.35-1a7 7 0 0 1-6.08-3.93 7.31 7.31 0 0 1 .83-7.59.89.89 0 0 0-.39-1.45 2 2 0 0 0-2 .55ZM129.75 65.75a56.05 56.05 0 0 0 15.33 4.76 2 2 0 0 0 1.9-.85c.33-.65-.3-1-.85-1.07A52 52 0 0 1 132 64.18a2.11 2.11 0 0 0-2.06.21c-.41.29-.86 1-.2 1.36ZM111.21 101a31.94 31.94 0 0 0 .4 11.24c.11.53 3-.16 2.89-.78a32.16 32.16 0 0 1-.39-11.24c0-.35-1.42 0-1.55 0-.38.1-1.28.3-1.35.78ZM130.16 126.56a31.2 31.2 0 0 0 6.86 4 2 2 0 0 0 2-.55.83.83 0 0 0-.38-1.39 26.44 26.44 0 0 1-3.18-1.62 30 30 0 0 1-3.12-2.12 1.89 1.89 0 0 0-2.08.18c-.49.4-.73 1-.15 1.49ZM111.18 73.58l.47 11.22c0 .72.69 1 1.35 1s1.62-.46 1.59-1.17l-.48-11.23c0-.71-.68-1-1.34-1s-1.62.47-1.59 1.18ZM58.76 75.68a52.6 52.6 0 0 1-6.53 8.95.85.85 0 0 0 .38 1.37 2 2 0 0 0 2-.55A55.72 55.72 0 0 0 61.54 76c.35-.62-.32-1.17-.89-1.23a1.94 1.94 0 0 0-1.89.89Z"
                />
              </g>
            </g>
          </g>
        </svg>
      );
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 38 38"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur={speed}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      );
    };
    if (full) {
      return (
        <main className="d-flex align-items-center justify-content-center">
          <div className="loader">
            <Icon />
          </div>
        </main>
      );
    }
    return <Icon />;
  }
);

export default Loader;
