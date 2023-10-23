import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const Callback = ({btnClass, btnText}) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <button type='button' className={btnClass} onClick={handleShow}>
                {btnText}
            </button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
            </Modal>
        </>
    );
};

export default Callback;