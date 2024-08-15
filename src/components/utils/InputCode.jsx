import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

const allowedCharactersValues = ["alpha", "numeric", "alphanumeric"];

const propsMap = {
  alpha: {
    type: "text",
    inputMode: "text",
    pattern: "[a-zA-Z]{1}",
  },

  alphanumeric: {
    type: "text",
    inputMode: "text",
    pattern: "[a-zA-Z0-9]{1}",
  },

  numeric: {
    type: "tel",
    inputMode: "numeric",
    pattern: "[0-9]{1}",
    min: "0",
    max: "9",
  },
};

const InputCode = forwardRef(
  (
    {
      allowedCharacters = "alphanumeric",
      ariaLabel,
      autoFocus = false,
      containerClassName,
      disabled,
      inputClassName,
      isPassword = false,
      length = 6,
      placeholder,
      onChange,
    },
    ref
  ) => {
    if (isNaN(length) || length < 1) {
      throw new Error("Length should be a number and greater than 0");
    }

    if (!allowedCharactersValues.some((value) => value === allowedCharacters)) {
      throw new Error(
        "Invalid value for allowedCharacters. Use alpha, numeric, or alphanumeric"
      );
    }

    const inputsRef = useRef([]);
    const inputProps = propsMap[allowedCharacters];

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputsRef.current) {
          inputsRef.current[0].focus();
        }
      },
      clear: () => {
        if (inputsRef.current) {
          for (let i = 0; i < inputsRef.current.length; i++) {
            inputsRef.current[i].value = "";
          }
          inputsRef.current[0].focus();
        }
        sendResult();
      },
    }));

    useEffect(() => {
      if (autoFocus) {
        inputsRef.current[0].focus();
      }
    }, []);

    const sendResult = () => {
      const res = inputsRef.current.map((input) => input.value).join("");
      onChange && onChange(res);
    };

    const handleOnChange = (e) => {
      const {
        target: { value, nextElementSibling },
      } = e;
      if (value.length > 1) {
        e.target.value = value.charAt(0);
        if (nextElementSibling !== null) {
          nextElementSibling.focus();
        }
      } else {
        if (value.match(inputProps.pattern)) {
          if (nextElementSibling !== null) {
            nextElementSibling.focus();
          }
        } else {
          e.target.value = "";
        }
      }
      sendResult();
    };

    const handleOnKeyDown = (e) => {
      const { key } = e;
      const target = e.target;
      if (key === "Backspace") {
        if (target.value === "") {
          if (target.previousElementSibling !== null) {
            const t = target.previousElementSibling;
            t.value = "";
            t.focus();
            e.preventDefault();
          }
        } else {
          target.value = "";
        }
        sendResult();
      }
    };

    const handleOnFocus = (e) => {
      e.target.select();
    };

    const handleOnPaste = (e) => {
      const pastedValue = e.clipboardData.getData("Text");

      let currentInput = 0;

      for (let i = 0; i < pastedValue.length; i++) {
        const pastedCharacter = pastedValue.charAt(i);
        const currentValue = inputsRef.current[currentInput].value;
        if (pastedCharacter.match(inputProps.pattern)) {
          if (!currentValue) {
            inputsRef.current[currentInput].value = pastedCharacter;
            if (inputsRef.current[currentInput].nextElementSibling !== null) {
              inputsRef.current[currentInput].nextElementSibling.focus();
              currentInput++;
            }
          }
        }
      }
      sendResult();

      e.preventDefault();
    };

    const inputs = [];
    for (let i = 0; i < length; i++) {
      inputs.push(
        <input
          key={i}
          placeholder={placeholder ?? "__"}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onFocus={handleOnFocus}
          onPaste={handleOnPaste}
          {...inputProps}
          type={isPassword ? "password" : inputProps.type}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          maxLength={1}
          className={inputClassName}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={
            ariaLabel
              ? `${ariaLabel}. Character ${i + 1}.`
              : `Character ${i + 1}.`
          }
          disabled={disabled}
        />
      );
    }

    return <div className={"input-code " + containerClassName}>{inputs}</div>;
  }
);

export default InputCode;
