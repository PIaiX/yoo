import React from 'react';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <main>
      <Container>
        <h1>404</h1>
        <h3>{t("Страница не найдена")}</h3>
      </Container>
    </main>
  );
};

export default NotFound;