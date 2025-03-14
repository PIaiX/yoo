import React, { useState, useEffect, memo } from "react";

const Loader = memo(({ mini = false }) => {
  const [show, setShow] = useState(false);

  const onClear = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 10000);
  }, []);

  if (mini) {
    return (
      <div className="loading-indicator mini">
        <div>
          <div className="position-relative">
            <div className="spinner"></div>
            <div className="delivery-loader">
              <img
                draggable="false"
                src="/imgs/delivery-loading.png"
                width="35"
              />
            </div>
          </div>
          {show && (
            <div className="d-flex flex-column mt-3 align-items-center">
              <p className="fs-08">
                Если загрузка не завершилась, попробуйте очистить кеш
              </p>
              <button draggable={false}  className="btn btn-light mt-2 btn-sm" onClick={onClear}>
                Очистить кеш
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="d-flex align-items-center justify-content-center">
      <div className="loading-indicator">
        <div>
          <div className="position-relative">
            <div className="spinner"></div>
            <div className="delivery-loader">
              <img
                draggable="false"
                src="/imgs/delivery-loading.png"
                width="35"
              />
            </div>
          </div>
          {show && (
            <div className="d-flex flex-column mt-3 align-items-center">
              <p className="fs-08">
                Если загрузка не завершилась, попробуйте очистить кеш
              </p>
              <button draggable={false}  className="btn btn-light mt-2 btn-sm" onClick={onClear}>
                Очистить кеш
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
});

export default Loader;
