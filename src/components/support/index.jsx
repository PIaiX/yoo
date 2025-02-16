import { memo } from "react";
import { IoSend } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import { getImageURL } from "../../helpers/all";
import Input from "../utils/Input";
import SupportItem from "./SupportItem";
import { useTranslation } from "react-i18next";

const SupportForm = memo(
  ({
    support = false,
    data,
    form,
    input = true,
    placeholder = "Введите сообщение",
    emptyText = "Нет сообщений",
    onChange,
    onSubmit,
  }) => {
    // const user = useSelector((state) => state.auth.user);
    // const image = getImageURL({ path: user, type: "user", size: "mini" });
    const {t} = useTranslation()

    return (
      <div className="support">
        <div className="support-top">
          <h6 className="mb-0">{t("Чат с поддержкой")}</h6>
        </div>

        {data.length > 0 ? (
          <div className="support-chat">
            <div className="chat">
              {data.map((item) => (
                <SupportItem support={support} {...item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-100 chat-body custom-scroll py-5 text-center text-muted fs-09 d-flex flex-column align-items-center justify-content-center">
            {emptyText}
          </div>
        )}
        {input && (
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
                className={
                  form?.text?.length > 0 ? "text-success" : "text-muted"
                }
              />
            </a>
          </form>
        )}
      </div>
    );
  }
);

export default SupportForm;
