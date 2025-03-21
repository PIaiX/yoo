import { memo } from "react";

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
    type,
    className,
    validation,
  }) => {
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
          defaultValue={defaultValue}
          onChange={(e) => onChange && !register && onChange(e.target.value)}
          readOnly={!readOnly && "readonly"}
          {...(register && { ...register(name, validation) })}
        />

        {errors && errors[name]?.type === "required" && (
          <p className="error-text fs-07">{errors[name]?.message}</p>
        )}
      </div>
    );
  }
);

export default Textarea;
