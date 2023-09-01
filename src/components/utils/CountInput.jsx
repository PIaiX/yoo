import React, { memo, useCallback } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";
import { NotificationManager } from "react-notifications";

const CountInput = memo(
  ({ dis, className, value, full, w100, onChange, isValid = true }) => {
    const onCount = useCallback((e) => {
      if (e > 100) return NotificationManager.error("Максимальное кол-во 100");
      if (e < 0) return;
      onChange && onChange(e);
    }, []);

    return (
      <div
        className={
          dis ? "countInput disabled " + className : "countInput " + className
        }
      >
        <button type="button" onClick={() => onCount(value - 1)}>
          <HiMinus />
        </button>
        <input type="number" value={value} readOnly={false} />
        <button type="button" onClick={() => onCount(value + 1)}>
          <HiPlus />
        </button>
      </div>
    );
  }
);

export default CountInput;
