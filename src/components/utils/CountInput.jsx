import React from "react";
import { HiPlus, HiMinus } from "react-icons/hi";

const CountInput = ({ dis, defaultValue = 1, className }) => {
  return (
    <div
      className={
        dis ? "countInput disabled " + className : "countInput " + className
      }
    >
      <button type="button">
        <HiMinus />
      </button>
      <input type="number" defaultValue={defaultValue} />
      <button type="button">
        <HiPlus />
      </button>
    </div>
  );
};

export default CountInput;
