import React from "react";

const PaymentItem = ({ data, active, onClick }) => {
  const images = {
    online: (
      <img
        src="/imgs/payment/online.svg"
        alt={data.title}
        className="payment-logo"
      />
    ),
    cash: (
      <img
        src="/imgs/payment/cash.svg"
        alt={data.title}
        className="payment-logo"
      />
    ),
    card: (
      <img
        src="/imgs/payment/card.svg"
        alt={data.title}
        className="payment-logo"
      />
    ),
  };
  return (
    <div
      className={"payment" + (active ? " active" : "")}
      onClick={() => onClick && onClick(data)}
    >
      {images[data.value] ?? null}
      <div className="payment-num">
        <span>{data.title}</span>
      </div>
    </div>
  );
};

export default PaymentItem;
