import React, { useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import Input from "../utils/Input";
import { useForm } from "react-hook-form";
import Textarea from "../utils/Textarea";
import { Col, Row } from "react-bootstrap";
import { createFeedback } from "../../services/order";
import { NotificationManager } from "react-notifications";

const Callback = ({ show = false, setShow, type, page, product, ip }) => {
  const options = useSelector((state) => state.settings.options);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      type,
      page,
      product,
      ip,
    },
  });

  const onSubmit = useCallback(async (data) => {
    await createFeedback(data)
      .then(() => {
        NotificationManager.success("Заявка успешно отправлена");
        reset();
        handleClose();
      })
      .catch((err) => {
        NotificationManager.error(
          err?.response?.data?.error ?? "Ошибка при отправке"
        );
      });
  }, []);

  return (
    <Modal show={show} onHide={setShow} centered>
      <Modal.Header closeButton className="fw-7">
        {options?.feedback?.title ?? "Обратная связь"}
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Input
              label="Имя"
              name="name"
              errors={errors}
              register={register}
              validation={{ required: "Обязательное поле" }}
            />
          </Col>
          {!options?.feedback?.type || options?.feedback?.type == "phone" ? (
            <Col md={6}>
              <Input
                mask="7(999)999-99-99"
                label="Номер телефона"
                name="phone"
                errors={errors}
                register={register}
                validation={{ required: "Обязательное поле" }}
              />
            </Col>
          ) : (
            <Col md={6}>
              <Input
                label="Email"
                name="email"
                errors={errors}
                register={register}
                validation={{ required: "Обязательное поле" }}
              />
            </Col>
          )}
          <Col md={12}>
            <Textarea
              label="Комментарий"
              name="comment"
              placeholder="Введите комментарий"
              errors={errors}
              register={register}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            disabled={!isValid}
            onClick={handleSubmit(onSubmit)}
            className="btn-success mt-4 d-block d-md-flex w-xs-100"
          >
            Отправить
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Callback;
