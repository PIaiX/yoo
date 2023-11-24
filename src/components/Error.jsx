import { memo } from "react";

const Error = memo(() => {
  const onClear = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  return (
    <main
      className={
        "empty d-flex flex-column align-items-center justify-content-center"
      }
    >
      <div>
        <p className="text-center h4">Произошла ошибка</p>
        <p className="text-center text-muted">
          У вас старая версия сайта. Очистите кеш чтобы обновить данные.
        </p>

        <div className="d-flex justify-content-center mt-4">
          <button onClick={() => onClear()}>Очистить кеш</button>
        </div>
      </div>
    </main>
  );
});
export default Error;
