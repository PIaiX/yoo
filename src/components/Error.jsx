import { memo } from "react";
import { useTranslation } from "react-i18next";

const Error = memo(() => {
  const onClear = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };
  const { t } = useTranslation();

  return (
    <main
      className={
        "empty d-flex flex-column align-items-center justify-content-center"
      }
    >
      <div>
        <p className="text-center h4">{t("Произошла ошибка")}</p>
        <p className="text-center text-muted">
          {t("У вас старая версия сайта. Очистите кеш чтобы обновить данные.")}
        </p>

        <div className="d-flex justify-content-center mt-4">
          <button onClick={() => onClear()}>{t("Очистить кеш")}</button>
        </div>
      </div>
    </main>
  );
});
export default Error;
