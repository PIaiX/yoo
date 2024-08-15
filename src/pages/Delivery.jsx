import React, { useState, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Loader from "../components/utils/Loader";
import { getDocument } from "../services/document";
import { useTranslation } from "react-i18next";

const Delivery = () => {
  const { t } = useTranslation();

  const [document, setDocument] = useState({ loading: true, data: false });

  useLayoutEffect(() => {
    getDocument("delivery")
      .then((res) => setDocument({ loading: false, data: res }))
      .catch(() => setDocument((data) => ({ ...data, loading: false })));
  }, []);

  if (document?.loading) {
    return <Loader full />;
  }

  if (!document || !document?.data?.content) {
    return (
      <Empty
        text={t("В данный момент страница недоступна")}
        desc={t("Вернитесь на эту страницу чуть позже")}
        image={() => <EmptyWork />}
        button={
          <a
            className="btn-primary"
            onClick={() => {
              location.reload();
              return false;
            }}
          >
            {t("Обновить страницу")}
          </a>
        }
      />
    );
  }

  return (
    <main>
      <section className="sec-7 mb-5">
        <Container>
          {document?.data?.content && (
            <div dangerouslySetInnerHTML={{ __html: document.data.content }} />
          )}
        </Container>
      </section>
    </main>
  );
};

export default Delivery;
