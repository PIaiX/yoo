import { memo } from "react";
import AppStore from "../assets/imgs/appstore.svg";
import GooglePlay from "../assets/imgs/googleplay.svg";
import Phone from "../assets/imgs/phone.png";
import QRCode from "react-qr-code";

const QrApp = memo(() => {
  return (
    <section class="sec-4">
      <div class="d-flex align-items-center mb-4">
        <button
          type="button"
          class="btn-2 fs-20 py-2 px-3 px-lg-4 me-2 me-md-3"
        >
          В приложении
        </button>
      </div>
      <h3 className="mb-5">Заказывать еще удобнее</h3>
      <div class="d-flex flex-row align-items-center ">
        <div className="pe-5">
          <div className="bg-white p-3 rounded-11 shadow-sm">
            <QRCode
              size={180}
              fgColor="#000000"
              bgColor="#ffffff"
              value={"https://" + window.location.hostname + "/redirectapp"}
              viewBox={`0 0 180 180`}
            />
          </div>
        </div>
        <div class="d flex flex-column">
          <div className="mb-4">
            <a href="/">
              <img width={220} src={AppStore} alt="App Store" />
            </a>
          </div>
          <div>
            <a href="/">
              <img width={220} src={GooglePlay} alt="Google Play" />
            </a>
          </div>
        </div>
      </div>
      <img src={Phone} alt="Phone" class="phone" />
    </section>
  );
});
export default QrApp;
