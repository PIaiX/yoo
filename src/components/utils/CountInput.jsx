import React, { memo, useCallback } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { NotificationManager } from "react-notifications";

const CountInput = memo(
  ({ dis = false, className = "", value, full, onChange }) => {
    const onCount = useCallback((e) => {
      if (e > 100) return NotificationManager.error("Максимальное кол-во 100");
      if (e < 0) return;
      onChange && onChange(e);
    }, []);

    return (
      <div
        className={
          "countInput" +
          (className ? " " + className : "") +
          (full ? " full" : "") +
          (dis ? " disabled" : "")
        }
      >
        {!dis && (
          <button type="button" onClick={() => onCount(Number(value) - 1)}>
            <HiMinus />
          </button>
        )}
        <div className="d-flex px-2 fs-09">{value}</div>
        {!dis && (
          <button type="button" onClick={() => onCount(Number(value) + 1)}>
            <HiPlus />
          </button>
        )}
      </div>
    );
  }
);

export default CountInput;
