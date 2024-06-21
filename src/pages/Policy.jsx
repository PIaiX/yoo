import React, { useState, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Loader from "../components/utils/Loader";
import { getDocument } from "../services/document";
import { useSelector } from "react-redux";
import Meta from "../components/Meta";

const Policy = () => {
  const [document, setDocument] = useState({ loading: true, data: false });
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);

  useLayoutEffect(() => {
    getDocument("policy")
      .then((res) => setDocument({ loading: false, data: res }))
      .catch(() => setDocument((data) => ({ ...data, loading: false })));
  }, []);

  if (document?.loading) {
    return <Loader full />;
  }

  if (!document || !document?.data?.content) {
    return (
      <>
        <Meta
          title={`${
            selectedAffiliate?.title ?? options?.title
          } — Политика конфиденциальности`}
          description={`${
            selectedAffiliate?.title ?? options?.title
          } — Политика конфиденциальности`}
        />
        <Empty
          text="В данный момент страница недоступна"
          desc="Вернитесь на эту страницу чуть позже"
          image={() => <EmptyWork />}
          button={
            <a
              className="btn-primary"
              onClick={() => {
                location.reload();
                return false;
              }}
            >
              Обновить страницу
            </a>
          }
        />
      </>
    );
  }

  return (
    <main>
      <Meta
        title={`${
          selectedAffiliate?.title ?? options?.title
        } — Политика конфиденциальности`}
        description={`${
          selectedAffiliate?.title ?? options?.title
        } — Политика конфиденциальности`}
      />
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

export default Policy;
