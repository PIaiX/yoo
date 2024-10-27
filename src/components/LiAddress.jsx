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

const LiAddress = memo(({ data }) => {
  const [showDelConfirmation, setShowDelConfirmation] = useState(false);
  const dispatch = useDispatch();

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
          <button
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
        onHide={() => setShowDelConfirmation(false)}
        centered
      >
        <Modal.Body className="p-5">
          <button type="button" className="close m-2">
            <HiXMark size={30} />
          </button>
          <h6 className="text-center">
            Вы уверены, что хотите удалить данный адрес?
          </h6>
          <div className="d-flex">
            <button
              type="button"
              className="btn-primary px-5 mx-auto mt-3"
              onClick={() => {
                dispatch(deleteAddress(data.id));
                setShowDelConfirmation(false);
              }}
            >
              Да
            </button>
            <button
              type="button"
              className="btn mx-auto px-5 mt-3"
              onClick={() => setShowDelConfirmation(false)}
            >
              Нет
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default LiAddress;
