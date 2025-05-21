import React, { useState, useLayoutEffect, memo } from "react";
import { ListGroup, Container } from "react-bootstrap";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Loader from "../components/utils/Loader";
import { getDocument, getDocuments } from "../services/document";
import { useSelector } from "react-redux";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";
import { IoChevronForward } from "react-icons/io5";

const Documents = memo(() => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState({
    loading: true,
    items: [],
    pagination: {},
  });

  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const options = useSelector((state) => state.settings.options);

  useLayoutEffect(() => {
    getDocuments()
      .then(
        (res) =>
          res?.documents?.items &&
          setDocuments({
            loading: false,
            items: res.documents.items,
            pagination: res.documents.pagination,
          })
      )
      .catch(() => setDocuments({ ...documents, loading: false }));
  }, []);

  if (documents?.loading) {
    return <Loader full />;
  }

  if (!documents || documents?.items?.length === 0) {
    return (
      <>
        <Meta
          title={`${
            selectedAffiliate?.title ? selectedAffiliate?.title : options?.title
          } - ${t("Правовая информация")}`}
          description={`${
            selectedAffiliate?.title ? selectedAffiliate?.title : options?.title
          } - ${t("Правовая информация")}`}
        />
        <Empty
          text={t("Нет информации")}
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
      </>
    );
  }

  return (
    <main>
      <Meta
        title={`${
          selectedAffiliate?.title ? selectedAffiliate?.title : options?.title
        } - ${t("Правовая информация")}`}
        description={`${
          selectedAffiliate?.title ? selectedAffiliate?.title : options?.title
        } - ${t("Правовая информация")}`}
      />

      <Container>
        <h3 className="fs-bold">{t("Правовая информация")}</h3>
        <ListGroup className="mt-4">
          {documents?.items?.map((e) => (
            <ListGroup.Item
              active={false}
              action
              href={"/document/" + e.link}
              className="d-flex flex-row align-items-center p-3 justify-content-between"
            >
              <div>{e.title}</div>
              <div>
                <IoChevronForward color="#999" size={20} />
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    </main>
  );
});

export default Documents;
