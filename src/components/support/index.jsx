import { memo } from "react";
import { IoSend } from "react-icons/io5";
import Input from "../utils/Input";
import SupportItem from "./SupportItem";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { isWork, weekday } from "../../helpers/all";

const SupportForm = memo(
  ({
    data,
    form,
    className = false,
    placeholder = "Введите сообщение",
    emptyText = "Нет сообщений",
    onChange,
    onSubmit,
  }) => {
    const { t } = useTranslation();
    // const supportVisible = useSelector((state) => state.settings.options.supportVisible)
    const affiliate = useSelector((state) => state.affiliate.items);
    const zone = useSelector((state) => state.cart.zone);
    const checkout = useSelector((state) => state.checkout);
    const selectedAffiliate =
      affiliate?.length > 0
        ? affiliate.find(
            (e) =>
              (checkout?.delivery === "delivery" &&
                e.id === zone?.data?.affiliateId) ||
              (checkout?.delivery === "pickup" && e.main)
          )
        : false;
    const time =
      selectedAffiliate?.options?.work &&
      selectedAffiliate.options.work[weekday]?.end &&
      selectedAffiliate.options.work[weekday]?.start &&
      selectedAffiliate?.status !== 0 ? (
        isWork(
          selectedAffiliate.options.work[weekday].start,
          selectedAffiliate.options.work[weekday].end
        ) ? (
          <span className="text-success">{t("Онлайн")}</span>
        ) : (
          `${t("Мы работаем с")} ${
            selectedAffiliate.options.work[weekday].start
          } ${t("до")} ${selectedAffiliate.options.work[weekday].end}`
        )
      ) : (
        t("Оффлайн")
      );
    return (
      <div className={`support${className ? " " + className : ""}`}>
        <div className="support-top">
          <h6 className="mb-0">{t("Чат с поддержкой")}</h6>
          {time && <p className="text-muted fs-07">{time}</p>}
        </div>

        {data.length > 0 ? (
          <div className="support-chat">
            <div className="chat">
              {data.map((item) => (
                <SupportItem {...item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-100 chat-body custom-scroll py-5 text-center text-muted fs-09 d-flex flex-column align-items-center justify-content-center">
            {emptyText}
          </div>
        )}

        <form className="support-form">
          <div className="w-100 pe-3">
            <Input
              value={form.text}
              placeholder={placeholder}
              onChange={(e) => onChange(e)}
            />
          </div>
          <a onClick={() => onSubmit()} className="">
            <IoSend
              size={22}
              className={form?.text?.length > 0 ? "text-main" : "text-muted"}
            />
          </a>
        </form>
      </div>
    );
  }
);

export default SupportForm;
