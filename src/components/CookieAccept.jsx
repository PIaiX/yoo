import { memo, useState } from "react";

const CookieAccept = memo(() => {
  const [status, setStatus] = useState(localStorage.getItem("cookiesAccepted"));
  const onYes = () => {
    localStorage.setItem("cookiesAccepted", "yes");
    setStatus("yes");
  };

  return (
    !status && (
      <div className="cookie">
        <p className="fs-09 fw-5">
          Находясь на данном сайте, вы соглашаетесь на использование файлов
          cookie. Более подробную информацию можно найти в{" "}
          <a className="text-main" href="/policy-cookie" target="_blank">
            Политике cookie файлов
          </a>
        </p>
        <div className="d-flex flex-row mt-2">
          <button className="btn btn-primary btn-sm" onClick={() => onYes()}>
            Принять
          </button>
        </div>
      </div>
    )
  );
});

export default CookieAccept;
