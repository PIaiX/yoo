import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { HiXMark } from "react-icons/hi2";
import Trash from '../svgs/Trash';


const BankCard = () => {
  const [showDelConfirmation, setShowDelConfirmation] = useState(false);

  return (
    <div className="bankcard">
      <div className="d-flex justify-content-between align-items-center">

        <img src="imgs/tinkoff.jpg" alt="tinkoff" className="bankcard-logo" />
        <button
          type="button"
          onClick={() => setShowDelConfirmation(true)}
          className="d-flex"
        >
          <HiOutlineTrash />
        </button>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <img src="imgs/visa.jpg" alt="visa" className="bankcard-type" />
        <div className="bankcard-num">
          <span className="d-none d-sm-inline">**** **** ****</span>
          <span className="d-sm-none">* * * </span>

          <span>6789</span>
        </div>
      </div>


      <Modal
        show={showDelConfirmation}
        onHide={() => setShowDelConfirmation(false)}
      >
        <Modal.Body className="p-5">
          <button type="button" className="close">
            <HiXMark />
          </button>
          <h6 className="text-center">
            Вы уверены, что хотите удалить данную карту?
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
              onClick={() => setShowDelConfirmation(false)}
            >
              Да
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BankCard;
