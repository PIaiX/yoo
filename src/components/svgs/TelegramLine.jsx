import React from "react";

const TelegramLine = ({ className = "" }) => {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_95_4107)">
        <circle cx="10" cy="10" r="9.25" stroke="currentColor" stroke-width="1.5" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0446 5.89002C13.1778 5.83954 13.3235 5.82213 13.4668 5.8396C13.61 5.85707 13.7453 5.90879 13.8588 5.98936C13.9723 6.06994 14.0597 6.17643 14.112 6.29775C14.1642 6.41907 14.1794 6.55078 14.156 6.67919L12.9335 13.3561C12.8149 14.0001 12.0302 14.3695 11.3742 14.0486C10.8255 13.7802 10.0105 13.3667 9.27746 12.9353C8.91093 12.7193 7.78819 12.0277 7.92617 11.5355C8.04475 11.1147 9.93127 9.53349 11.0093 8.59338C11.4324 8.22404 11.2394 8.01097 10.7398 8.35071C9.49899 9.19424 7.50683 10.477 6.84816 10.8381C6.26712 11.1565 5.96419 11.2108 5.60198 11.1565C4.94116 11.0575 4.32832 10.9041 3.82812 10.7172C3.15221 10.4649 3.18509 9.62813 3.82758 9.38449L13.0446 5.89002Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_95_4107">
          <rect width="20" height="20" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>

  );
};

export default TelegramLine;
