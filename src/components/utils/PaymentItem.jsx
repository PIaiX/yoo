import React from "react";

const PaymentItem = ({ data, active, onClick }) => {
  return (
    <div
      className={"payment" + (active ? " active" : "")}
      onClick={() => onClick && onClick(data)}
    >
      <img src="/imgs/tinkoff.jpg" alt={data.title} className="payment-logo" />
      <div className="payment-num">
        <span>{data.title}</span>
      </div>
    </div>
  );
};

export default PaymentItem;
