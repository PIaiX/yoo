
import React, { memo, useState } from "react";
import { HiOutlineMap, HiXMark, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { deleteAddress } from "../services/address";
import Map from './svgs/Map';
import Trash from './svgs/Trash';

const LiAddress = memo(({ data }) => {
  const [showDelConfirmation, setShowDelConfirmation] = useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <li className="d-flex flex-row align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <HiOutlineMap className="fs-15 main-color-60 me-3" />
          <div>
            {data?.title ? (
              <>
                <p className="fw-6 fs-09">{data.title}</p>
                <p className="fs-07 text-muted">{data.full}</p>
              </>
            ) : (
              <p className="fw-6">{data?.full}</p>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-end mt-2 mt-sm-0 ms-sm-4">
          <Link to={"/account/address/" + data.id} className="green fs-09">
            Изменить
          </Link>
          <button
            type="button"
            className="dark-gray fs-12 ms-4"
            onClick={() => setShowDelConfirmation(true)}
          >
            <HiOutlineTrash />
          </button>
        </div>
      </li>
      <Modal
        show={showDelConfirmation}
        onHide={() => setShowDelConfirmation(false)}
      >
        <Modal.Body className="p-5">
          <button type="button" className="close">
            <HiXMark />
          </button>
          <h6 className="text-center">
            Вы уверены, что хотите удалить данный адрес?
          </h6>
          <div className="d-flex">
            <button
              type="button"
              className="btn-secondary px-5 mx-auto mt-4"
              onClick={() => setShowDelConfirmation(false)}
            >
              Нет
            </button>
            <button
              type="button"
              className="btn-primary px-5 mx-auto mt-4"
              onClick={() => {
                dispatch(deleteAddress(data.id));
                setShowDelConfirmation(false);
              }}
            >
              Да
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
});

export default LiAddress;
