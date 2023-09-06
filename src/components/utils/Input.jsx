import React, { memo, useState } from "react";
import Eye from "../svgs/Eye";
import CloseEye from "../svgs/CloseEye";
import ReactInputMask from "react-input-mask";
// import CheckMark from '../svg/CheckMark'

const Input = memo(
  ({
    onFocus,
    onClick,
    onChange,
    required,
    type,
    label,
    className,
    mask = false,
    defaultValue,
    placeholder,
    name,
    autoFocus,
    register,
    readOnly,
    validation,
    minLength = 0,
    maxLength = 250,
    errors,
  }) => {
    const [visible, setVisibility] = useState(false);
    return (
      <>
        <div
          className={
            "labeled-input" +
            (className ? " " + className : "") +
            (errors && errors[name] ? " error" : "")
          }
        >
          {label && (
            <label className="mb-2 fs-09">
              <span>{label}</span>
              {required && <span class="ms-1 text-danger">*</span>}
            </label>
          )}
          {type === "password" ? (
            <div className="password">
              <input
                onClick={onClick}
                onFocus={onFocus}
                readOnly={readOnly}
                defaultValue={defaultValue}
                autoFocus={autoFocus}
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                minLength={minLength}
                maxLength={maxLength}
                required
                placeholder={placeholder}
                onChange={(e) =>
                  onChange && !register && onChange(e.target.value)
                }
                {...(register && { ...register(name, validation) })}
              />
              <button type="button" onClick={() => setVisibility(!visible)}>
                {visible ? <Eye /> : <CloseEye />}
              </button>
            </div>
          ) : mask ? (
            <ReactInputMask
              onClick={onClick}
              onFocus={onFocus}
              readOnly={readOnly}
              autoFocus={autoFocus}
              mask={mask}
              type={type}
              required
              defaultValue={defaultValue}
              placeholder={placeholder}
              onChange={(e) =>
                onChange && !register && onChange(e.target.value)
              }
              {...(register && { ...register(name, validation) })}
            />
          ) : (
            <input
              onClick={onClick}
              onFocus={onFocus}
              readOnly={readOnly}
              defaultValue={defaultValue}
              autoFocus={autoFocus}
              type={type}
              minLength={minLength}
              maxLength={maxLength}
              required
              placeholder={placeholder}
              onChange={(e) =>
                onChange && !register && onChange(e.target.value)
              }
              {...(register && { ...register(name, validation) })}
            />
          )}
        </div>
        {errors && (
          <p className="text-danger mt-1 fs-08">{errors[name]?.message}</p>
        )}
      </>
    );
  }
);

export default Input;
