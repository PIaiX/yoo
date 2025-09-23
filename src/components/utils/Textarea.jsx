import { memo } from "react";
import { getNestedError } from "../../helpers/all";

const Textarea = memo(
  ({
    name,
    label,
    placeholder,
    defaultValue,
    register,
    errors,
    required,
    rows = 4,
    onChange,
    readOnly = true,
    minLength = 0,
    maxLength = 5000,
    type,
    className,
    validation,
  }) => {
    const error = getNestedError(errors, name);
    return (
      <div
        className={
          (className ? " " + className : "") +
          (errors && errors[name] ? " error" : "")
        }
      >
        {label && (
          <label className="mb-2 fs-09" htmlFor={"textarea-" + name}>
            <span>{label}</span>
            {required && <span className="ms-1 text-danger">*</span>}
          </label>
        )}
        <textarea
          id={"textarea-" + name}
          name={name}
          type={type}
          placeholder={placeholder}
          rows={rows}
          minLength={minLength}
          maxLength={maxLength}
          defaultValue={defaultValue}
          onChange={(e) => onChange && !register && onChange(e.target.value)}
          readOnly={!readOnly && "readonly"}
          {...(register && { ...register(name, validation) })}
        />

        {name && errors && error?.message && (
          <p className="text-danger mt-1 fs-08">{error.message}</p>
        )}
      </div>
    );
  }
);

export default Textarea;
