import React, { useCallback, useState, memo } from "react";
import { Dropdown } from "react-bootstrap";
import { IoChevronDownOutline } from "react-icons/io5";
import Input from "./Input";

const Select = memo(
  ({ value, title, search, data, label, className, onClick, disabled }) => {
    const [searchData, setSearchData] = useState([]);

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
      let item = data.find((e) => e.value === value || e.title === value);
      let titleFind = item?.title ?? title ?? "Выберите элемент";

      return (
        <a
          disabled={disabled}
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
          className={
            "select d-flex align-items-center justify-content-between " +
            className
          }
        >
          {label && <span className="select-label">{label}</span>}
          <span
            className={
              "d-flex align-items-center flex-row " +
              (!data.find((e) => e.value === value || e.title === value)
                ? "text-muted"
                : "")
            }
          >
            {item?.image && (
              <img src={item.image} height={20} width={20} className="me-2" />
            )}
            {titleFind}
          </span>
          <span className="ms-2">
            <IoChevronDownOutline size={18} />
          </span>
        </a>
      );
    });

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu>
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
                  active={e.value === value ?? e.title === value ?? e.main}
                  onClick={() => onClick && onClick(e)}
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
                  active={e.value === value ?? e.title === value ?? e.main}
                  onClick={() => onClick && onClick(e)}
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
                  {e.title}
                </Dropdown.Item>
              ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
);

export default Select;
