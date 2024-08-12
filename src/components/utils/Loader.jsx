import React, { useState, useEffect } from "react";

function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Эмулируем загрузку данных (замените это на ваш реальный код)
    const delay = 2000; // Задержка в миллисекундах
    setTimeout(() => {
      setIsLoading(false);
    }, delay);
  }, []);

  return (
    <div className={`loading-indicator ${isLoading ? "active" : ""}`}>
      <div className="position-relative">
        <div className="spinner"></div>
        <div className="delivery-loader">
          <img src="/imgs/delivery-loading.png" width="35" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
