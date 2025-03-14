import React, { memo, useState } from "react";
import {
  HiOutlineMap,
  HiXMark,
  HiOutlineTrash,
  HiPencil,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../services/address";
import { useTranslation } from "react-i18next";

const LiAddress = memo(({ data }) => {
  const [showDelConfirmation, setShowDelConfirmation] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <>
      <li className="d-flex flex-row align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Link to={"/account/addresses/" + data.id}>
            <HiOutlineMap className="fs-15 main-color-60 me-3" />
          </Link>
          <Link to={"/account/addresses/" + data.id}>
            {data?.title ? (
              <>
                <p className="fw-6 fs-09">{data.title}</p>
                <p className="fs-07 text-muted">{data.full}</p>
              </>
            ) : (
              <p className="fw-6">{data?.full}</p>
            )}
          </Link>
        </div>
        <div className="d-flex align-items-center justify-content-end mt-2 mt-sm-0 ms-sm-4">
          <Link to={"/account/addresses/" + data.id} className="fs-09">
            <HiPencil size={18} />
          </Link>
          <button draggable={false} 
            type="button"
            className="text-danger fs-12 ms-4"
            onClick={() => setShowDelConfirmation(true)}
          >
            <HiOutlineTrash size={22} />
          </button>
        </div>
      </li>
      <Modal
        show={showDelConfirmation}
        onHide={setShowDelConfirmation}
        centered
      >
        <Modal.Header className="h5" closeButton>
          {t("Подтверждение")}
        </Modal.Header>
        <Modal.Body>
          {t(" Вы уверены, что хотите удалить данный адрес?")}
        </Modal.Body>
        <Modal.Footer>
          <button draggable={false} 
            onClick={() => {
              setShowDelConfirmation(false);
            }}
            className="btn btn-light"
          >
            {t("Отмена")}
          </button>
          <button draggable={false} 
            onClick={() => {
              dispatch(deleteAddress(data.id));
              setShowDelConfirmation(false);
            }}
            className="btn btn-danger"
          >
            {t("Да, удалить")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default LiAddress;
