import React, { memo, useState } from "react";
import Eye from "../svgs/Eye";
import CloseEye from "../svgs/CloseEye";
import ReactInputMask from "react-input-mask";
// import CheckMark from '../svg/CheckMark'

const Input = memo(
  ({
    onFocus,
    onClick,
    onKeyDown,
    onChange,
    inputMode,
    pattern,
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
    min = null,
    max = null,
    minLength = 0,
    maxLength = 250,
    errors,
  }) => {
    const [visible, setVisibility] = useState(false);
    return (
      <>
        <div
          className={
            (className ? className : "") +
            (errors && errors[name] ? " error" : "")
          }
        >
          {label && (
            <label htmlFor={"input-" + name} className="mb-2 fs-09">
              <span>{label}</span>
              {required && <span className="ms-1 text-danger">*</span>}
            </label>
          )}
          {type === "password" ? (
            <div className="password">
              <input
                id={"input-" + name}
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
                min={min}
                max={max}
              />
              <button
                draggable={false}
                type="button"
                onClick={() => setVisibility(!visible)}
              >
                {visible ? <Eye /> : <CloseEye />}
              </button>
            </div>
          ) : mask ? (
            <ReactInputMask
              id={"input-" + name}
              inputMode={inputMode}
              pattern={pattern}
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
              onKeyDown={onKeyDown}
              {...(register && { ...register(name, validation) })}
              min={min}
              max={max}
            />
          ) : (
            <input
              id={"input-" + name}
              inputMode={inputMode}
              pattern={pattern}
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
              onKeyDown={onKeyDown}
              {...(register && { ...register(name, validation) })}
              min={min}
              max={max}
            />
          )}
        </div>
        {name && errors && errors[name]?.message && (
          <p className="text-danger mt-1 fs-08">{errors[name]?.message}</p>
        )}
      </>
    );
  }
);

export default Input;
