import React, { memo } from "react";
import { useSelector } from "react-redux";
import useIsMobile from "../hooks/isMobile";
import { useTotalCart } from "../hooks/useCart";
import { customPrice } from "../helpers/all";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const DeliveryBar = memo(() => {
  return null
  const { pathname } = useLocation();
  const isMobileLG = useIsMobile("991px");
  const delivery = useSelector((state) => state.checkout.delivery);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const zone = useSelector((state) => state.cart.zone);
  const { totalNoDelivery = 0 } = useTotalCart();
  const { t } = useTranslation();

  if (delivery != "delivery" || !isAuth || pathname.indexOf("account") != -1) {
    return null;
  }

  if (isMobileLG) {
    return (
      <div className="freeDeliveryBar">
        <div className="py-2 px-3">
          <p>
            {totalNoDelivery < zone?.data?.minPrice
              ? `${t("Минимальная сумма заказа")} ${customPrice(
                  zone.data.minPrice
                )}`
              : totalNoDelivery >= zone?.data?.minPrice &&
                totalNoDelivery < zone?.data?.priceFree
              ? `${t("Бесплатная доставка от")} ${customPrice(
                  zone.data.priceFree
                )}`
              : t("Бесплатная доставка")}
          </p>
          <div className="mobileBar">
            <div
              className="bar"
              data-state={
                totalNoDelivery == 0
                  ? "none"
                  : totalNoDelivery > 0 &&
                    totalNoDelivery < zone?.data?.priceFree
                  ? "half"
                  : "full"
              }
            ></div>
            <img draggable="false" src="/imgs/scooter.png" alt="delivery" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="freeDeliveryBar">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <rect
            x="10.0001"
            y="10"
            width="80"
            height="80"
            rx="40"
            fill="#637381"
            fillOpacity="0.2"
          />

          {totalNoDelivery == 0 ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99.0394 59.7545C97.273 68.6347 93.1319 76.8528 87.0784 83.544C86.1521 84.5679 84.564 84.5639 83.5877 83.5876C82.6114 82.6113 82.6171 81.0329 83.5377 80.0038C88.895 74.0157 92.562 66.6893 94.1355 58.7791C95.8718 50.0499 94.9806 41.0019 91.5747 32.7792C88.1688 24.5566 82.401 17.5285 75.0008 12.5839C67.6006 7.6392 58.9003 5 50.0001 5C41.1 5 32.3997 7.6392 24.9995 12.5839C17.5992 17.5285 11.8315 24.5566 8.42554 32.7792C5.01959 41.0019 4.12844 50.0499 5.86478 58.7791C7.43821 66.6893 11.1052 74.0157 16.4625 80.0038C17.3831 81.0328 17.3889 82.6113 16.4125 83.5876C15.4362 84.5639 13.8481 84.5679 12.9218 83.544C6.86829 76.8528 2.72724 68.6347 0.960849 59.7545C-0.968411 50.0555 0.0217564 40.0021 3.80614 30.8658C7.59052 21.7295 13.9991 13.9206 22.2216 8.42652C30.4441 2.93245 40.111 0 50.0001 0C59.8892 0 69.5562 2.93245 77.7786 8.42652C86.0011 13.9206 92.4097 21.7295 96.1941 30.8658C99.9785 40.0021 100.969 50.0555 99.0394 59.7545Z"
              fill="#637381"
              fillOpacity="0.4"
            />
          ) : totalNoDelivery > 0 && totalNoDelivery < zone?.data?.priceFree ? (
            <>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M99.0394 59.7545C97.273 68.6347 93.1319 76.8528 87.0784 83.544C86.1521 84.5679 84.564 84.5639 83.5877 83.5876C82.6114 82.6113 82.6171 81.0329 83.5377 80.0038C88.895 74.0157 92.562 66.6893 94.1355 58.7791C95.8718 50.0499 94.9806 41.0019 91.5747 32.7792C88.1688 24.5566 82.401 17.5285 75.0008 12.5839C67.6006 7.6392 58.9003 5 50.0001 5C41.1 5 32.3997 7.6392 24.9995 12.5839C17.5992 17.5285 11.8315 24.5566 8.42554 32.7792C5.01959 41.0019 4.12844 50.0499 5.86478 58.7791C7.43821 66.6893 11.1052 74.0157 16.4625 80.0038C17.3831 81.0328 17.3889 82.6113 16.4125 83.5876C15.4362 84.5639 13.8481 84.5679 12.9218 83.544C6.86829 76.8528 2.72724 68.6347 0.960849 59.7545C-0.968411 50.0555 0.0217564 40.0021 3.80614 30.8658C7.59052 21.7295 13.9991 13.9206 22.2216 8.42652C30.4441 2.93245 40.111 0 50.0001 0C59.8892 0 69.5562 2.93245 77.7786 8.42652C86.0011 13.9206 92.4097 21.7295 96.1941 30.8658C99.9785 40.0021 100.969 50.0555 99.0394 59.7545Z"
                fill="#637381"
                fillOpacity="0.4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M99.0394 59.7545C97.273 68.6347 93.1319 76.8528 87.0784 83.544C86.1521 84.5679 84.564 84.5639 83.5877 83.5876C82.6114 82.6113 82.6171 81.0329 83.5377 80.0038C88.895 74.0157 92.562 66.6893 94.1355 58.7791C95.8718 50.0499 94.9806 41.0019 91.5747 32.7792C88.1688 24.5566 82.401 17.5285 75.0008 12.5839C67.6006 7.6392 58.9003 5 50.0001 5C41.1 5 32.3997 7.6392 24.9995 12.5839C17.5992 17.5285 11.8315 24.5566 8.42554 32.7792C5.01959 41.0019 4.12844 50.0499 5.86478 58.7791C7.43821 66.6893 11.1052 74.0157 16.4625 80.0038C17.3831 81.0328 17.3889 82.6113 16.4125 83.5876C15.4362 84.5639 13.8481 84.5679 12.9218 83.544C6.86829 76.8528 2.72724 68.6347 0.960849 59.7545C-0.968411 50.0555 0.0217564 40.0021 3.80614 30.8658C7.59052 21.7295 13.9991 13.9206 22.2216 8.42652C30.4441 2.93245 40.111 0 50.0001 0C59.8892 0 69.5562 2.93245 77.7786 8.42652C86.0011 13.9206 92.4097 21.7295 96.1941 30.8658C99.9785 40.0021 100.969 50.0555 99.0394 59.7545Z"
                fill="url(#paint0_linear_1_59)"
              />
            </>
          ) : (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M99.0394 59.7545C97.273 68.6347 93.1319 76.8528 87.0784 83.544C86.1521 84.5679 84.564 84.5639 83.5877 83.5876C82.6114 82.6113 82.6171 81.0329 83.5377 80.0038C88.895 74.0157 92.562 66.6893 94.1355 58.7791C95.8718 50.0499 94.9806 41.0019 91.5747 32.7792C88.1688 24.5566 82.401 17.5285 75.0008 12.5839C67.6006 7.6392 58.9003 5 50.0001 5C41.1 5 32.3997 7.6392 24.9995 12.5839C17.5992 17.5285 11.8315 24.5566 8.42554 32.7792C5.01959 41.0019 4.12844 50.0499 5.86478 58.7791C7.43821 66.6893 11.1052 74.0157 16.4625 80.0038C17.3831 81.0328 17.3889 82.6113 16.4125 83.5876C15.4362 84.5639 13.8481 84.5679 12.9218 83.544C6.86829 76.8528 2.72724 68.6347 0.960849 59.7545C-0.968411 50.0555 0.0217564 40.0021 3.80614 30.8658C7.59052 21.7295 13.9991 13.9206 22.2216 8.42652C30.4441 2.93245 40.111 0 50.0001 0C59.8892 0 69.5562 2.93245 77.7786 8.42652C86.0011 13.9206 92.4097 21.7295 96.1941 30.8658C99.9785 40.0021 100.969 50.0555 99.0394 59.7545Z"
              fill="#02B54C"
              fillOpacity="1"
            />
          )}

          <image
            x="11"
            y="16"
            width="80"
            height="80"
            xlinkHref="/imgs/scooter.png"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1_59"
              x1="9.50009"
              y1="75"
              x2="50.0001"
              y2="84.3159"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#02B54C" />
              <stop offset="1" stopColor="#C2C2C2" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div>
          {totalNoDelivery < zone?.data?.minPrice
            ? `${t("Минимальная сумма заказа")} ${customPrice(
                zone.data.minPrice
              )}`
            : totalNoDelivery >= zone?.data?.minPrice &&
              totalNoDelivery < zone?.data?.priceFree
            ? `${t("Бесплатная доставка от")} ${customPrice(
                zone.data.priceFree
              )}`
            : t("Бесплатная доставка")}
        </div>
      </div>
    );
  }
});

export default DeliveryBar;
