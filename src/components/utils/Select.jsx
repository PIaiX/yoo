import React, { useCallback, useState, useLayoutEffect, memo } from "react";
import { Dropdown } from "react-bootstrap";
import { IoChevronDownOutline } from "react-icons/io5";
import Input from "./Input";

const Select = memo(
  ({ value, title, search, data, label, className, onClick, disabled }) => {
    const [searchData, setSearchData] = useState([]);
    const [localValue, setLocalValue] = useState(value ?? null);

    useLayoutEffect(() => {
      if (localValue != value) {
        setLocalValue(value);
      }
    }, [value]);

    const onSearch = useCallback(
      (text) => {
        if (text.length > 0) {
          let newArray = [];
          let newText = text.toLocaleLowerCase().trim();

          data.map((item) => {
            if (item.title.toLocaleLowerCase().trim().includes(newText)) {
              newArray.push(item);
            }
          });

          setSearchData(newArray);
        } else {
          setSearchData([]);
        }
      },
      [data]
    );

    const CustomToggle = React.forwardRef(({ onClick }, ref) => {
      let item = localValue?.id
        ? data.find(
            (e) => e.value.id === localValue?.id || e.id === localValue?.id
          )
        : localValue &&
          data.find((e) => e.value === localValue || e.title === localValue);

      let titleFind = item?.title ?? title ?? "Выберите элемент";

      return (
        <>
          {label && <label className="select-label mb-2">{label}</label>}
          <a
            disabled={disabled}
            ref={ref}
            onClick={(e) => {
              if (data?.length > 1) {
                e.preventDefault();
                onClick(e);
              }
            }}
            className={
              "d-flex align-items-center justify-content-between" +
              (className ? " " + className : "")
            }
          >
            <span
              className={
                "d-flex align-items-center flex-row " +
                (!item ? "text-muted" : "")
              }
            >
              {item?.image && (
                <img src={item.image} height={20} width={20} className="me-2" />
              )}
              {titleFind}
            </span>
            {data?.length > 1 && (
              <span className="ms-2">
                <IoChevronDownOutline size={18} />
              </span>
            )}
          </a>
        </>
      );
    });

    return (
      <Dropdown className="select">
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu className="select-options">
          {data && search && (
            <div className="mb-2 bg-body position-sticky top-0">
              <Input
                autofocus
                placeholder="Поиск..."
                onChange={(e) => onSearch(e)}
              />
            </div>
          )}
          {searchData.length > 0
            ? searchData.map((e, index) => (
                <Dropdown.Item
                  key={index}
                  active={
                    localValue?.id && e.value?.id
                      ? e.value.id === localValue.id
                      : e.value === localValue ??
                        e.title === localValue ??
                        e.main
                  }
                  onClick={() => {
                    onClick && onClick(e);
                    // setLocalValue(e?.value ?? e);
                  }}
                  className="d-flex align-items-center flex-row"
                >
                  {image && (
                    <img
                      src="/images/lang/fr.svg"
                      height={17}
                      width={24}
                      className="me-2"
                    />
                  )}
                  {e.title}
                </Dropdown.Item>
              ))
            : data.length > 0 &&
              data.map((e, index) => (
                <Dropdown.Item
                  key={index}
                  active={
                    localValue?.id && e.value?.id
                      ? e.value.id === localValue.id
                      : e.value === localValue ??
                        e.title === localValue ??
                        e.main
                  }
                  onClick={() => {
                    onClick && onClick(e);
                    // setLocalValue(e?.value ?? e);
                  }}
                  className="d-flex align-items-center flex-row"
                >
                  {e?.image && (
                    <img
                      src={e.image}
                      height={20}
                      width={20}
                      className="me-2"
                    />
                  )}
                  <div>
                    <p className={e.desc ? "fw-6" : ""}>{e.title}</p>
                    {e.desc && (
                      <p
                        className={
                          localValue?.id && e.value?.id
                            ? e.value.id === localValue.id
                            : e.value === localValue ??
                              e.title === localValue ??
                              e.main
                            ? "fs-08"
                            : "text-muted fs-08"
                        }
                      >
                        {e.desc}
                      </p>
                    )}
                  </div>
                </Dropdown.Item>
              ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
);

export default Select;
