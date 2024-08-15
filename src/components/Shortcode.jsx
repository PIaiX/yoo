import React from "react";

const Shortcode = ({ text, data }) => {
  // Регулярное выражение для поиска шорткодов вида {код}
  const shortcodeRegex = /\{(.*?)\}/g;

  // Функция для замены шорткодов на данные
  const replaceShortcodes = (match, code) => {
    // Находим значение в данных по коду
    const value = data[code];

    // Возвращаем значение или пустую строку, если код не найден
    return value || "";
  };

  // Заменяем все шорткоды в тексте
  const renderedText = text.replace(shortcodeRegex, replaceShortcodes);

  return <span>{renderedText}</span>;
};

export default Shortcode;
