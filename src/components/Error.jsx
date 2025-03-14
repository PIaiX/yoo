import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";

const Error = memo(() => {
  const error = useRouteError();
  const { t } = useTranslation();

  const onClear = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  // Определяем тип ошибки
  const getErrorMessage = (error) => {
    if (error.status === 404) {
      return t("Страница не найдена");
    }
    if (error.status === 500) {
      return t("Ошибка сервера");
    }
    return error.message || error.toString();
  };

  return (
    <main className="empty d-flex flex-column align-items-center justify-content-center">
      <div>
        <p className="text-center h4">{t("Произошла ошибка")}</p>
        <p className="text-center text-muted">
          {t("У вас старая версия сайта. Очистите кеш чтобы обновить данные.")}
        </p>

        {error && (
          <div className="text-center text-danger mt-3">
            <strong>{t("Ошибка")}:</strong> {getErrorMessage(error)}
          </div>
        )}

        <div className="d-flex justify-content-center mt-4">
          <button draggable={false}  onClick={onClear}>{t("Очистить кеш")}</button>
        </div>
      </div>
    </main>
  );
});

export default Error;
