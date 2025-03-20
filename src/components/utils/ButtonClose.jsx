import { memo } from "react";
import { IoClose } from "react-icons/io5";

const ButtonClose = memo(({ onClick, size = 24 }) => {
  return (
    <button
      type="button"
      className="btn-close"
      aria-label="Close"
      draggable="false"
      onClick={(e) => onClick && onClick(e)}
    >
      <IoClose size={size} />
    </button>
  );
});

export default ButtonClose;
