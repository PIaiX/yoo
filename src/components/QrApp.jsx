import { memo } from "react";
import AppStore from "../assets/imgs/appstore.svg";
import GooglePlay from "../assets/imgs/googleplay.svg";
import Phone from "../assets/imgs/phone.png";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";

const QrApp = memo(() => {
  const options = useSelector((state) => state.settings.options);
  return (
    <section className="sec-app">
      <div className="d-flex align-items-center mb-4">
        <button
          type="button"
          className="btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3"
        >
          В приложении
        </button>
      </div>
      <h3 className="mb-5">Заказывать еще удобнее</h3>
      <div className="d-flex flex-row align-items-center ">
        <div className="pe-5">
          <div className="bg-white p-3 rounded-11 shadow-sm">
            <QRCode
              size={180}
              fgColor="#000000"
              bgColor="#ffffff"
              value={"https://" + window.location.hostname + "/redirect/app"}
              viewBox={`0 0 180 180`}
            />
          </div>
        </div>
        <div className="d flex flex-column">
          {options.app?.accountApple && options.app?.titleIos && (
            <div className="mb-4">
              <a
                target="_blank"
                href={
                  "https://apps.apple.com/ru/app/" +
                  (options.app?.titleIos?.length > 0
                    ? options.app.titleIos
                    : options.app?.nameIos?.length > 0
                    ? options.app.nameIos
                    : options.app.name) +
                  (options.app?.accountApple
                    ? "/id" + options.app.accountApple
                    : "")
                }
              >
                <img width={220} src={AppStore} alt="App Store" />
              </a>
            </div>
          )}
          <div>
            <a
              target="_blank"
              href={
                "https://play.google.com/store/apps/details?id=" +
                (options.app?.nameAndroid?.length > 0
                  ? options.app.nameAndroid
                  : options.app.name)
              }
            >
              <img width={220} src={GooglePlay} alt="Google Play" />
            </a>
          </div>
        </div>
      </div>
      <img src={Phone} alt="Phone" className="phone" />
    </section>
  );
});
export default QrApp;
