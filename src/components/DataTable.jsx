import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import EmptyCatalog from "./empty/catalog";
import { useSearchParams } from "react-router-dom";
import Empty from "./Empty";

const DataTable = React.memo(
  ({
    columns,
    data,
    header,
    classNameHeader,
    footer,
    statusBackground,
    selectable,
    onChange,
    pagination,
    lite,
    headClassName = "",
    paramsValue,
    emptyText = false,
    renderItem = false,
  }) => {
    const [selected, setSelected] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams(paramsValue);

    const isSelected = (index) => !!selected.find((e) => e.index === index);

    const onSelected = useCallback(
      ({ index, item }) => {
        if (isSelected(index)) {
          let newSelected = selected.filter((e) => e.index != index);
          setSelected(newSelected);
          onChange && onChange(newSelected);
        } else {
          let newSelected = [...selected, { index, item }];
          setSelected(newSelected);
          onChange && onChange(newSelected);
        }
      },
      [selected]
    );
    const onSelectedAll = useCallback(() => {
      if (data.length === selected.length) {
        setSelected([]);
        onChange && onChange([]);
      } else {
        let newSelected = data.map((item, index) => ({
          index,
          item,
        }));
        setSelected(newSelected);
        onChange && onChange(newSelected);
      }
    }, [selected, data]);

    useEffect(() => {
      setSelected([]);
    }, [data]);

    const footerView = useMemo(() => {
      return footer ? (
        <Card.Footer>{footer}</Card.Footer>
      ) : (
        pagination && (
          <Card.Footer className="px-2 w-100 border-top pt-4 fs-08 d-flex justify-content-center align-items-center sticky pagination">
            <button
              className="me-2 px-2 btn btn-light"
              onClick={() => setSearchParams(searchParams.delete("page"))}
            >
              <HiChevronDoubleLeft
                size={16}
                className={
                  Number(pagination.currentPage) <= 1
                    ? "text-muted"
                    : "text-dark"
                }
              />
            </button>
            <button
              className="px-2 btn btn-light"
              onClick={() => {
                if (Number(pagination.currentPage) >= 3) {
                  searchParams.set("page", Number(pagination.currentPage) - 1);
                } else {
                  searchParams.delete("page");
                }
                setSearchParams(searchParams);
              }}
            >
              <HiChevronLeft
                size={16}
                className={
                  Number(pagination.currentPage) <= 1
                    ? "text-muted"
                    : "text-dark"
                }
              />
            </button>
            <span className="mx-3">
              {pagination.currentPage} из {pagination.totalPages}
            </span>
            <button
              className="me-2 px-2 btn btn-light"
              onClick={() => {
                if (
                  Number(pagination.currentPage) < Number(pagination.totalPages)
                ) {
                  searchParams.set("page", Number(pagination.currentPage) + 1);
                  setSearchParams(searchParams);
                }
              }}
            >
              <HiChevronRight
                size={16}
                className={
                  Number(pagination.currentPage) >=
                  Number(pagination.totalPages)
                    ? "text-muted"
                    : "text-dark"
                }
              />
            </button>
            <button
              className="px-2 btn btn-light"
              onClick={() => {
                if (
                  Number(pagination.currentPage) < Number(pagination.totalPages)
                ) {
                  searchParams.set("page", pagination.totalPages);
                  setSearchParams(searchParams);
                }
              }}
            >
              <HiChevronDoubleRight
                size={16}
                className={
                  Number(pagination.currentPage) >=
                  Number(pagination.totalPages)
                    ? "text-muted"
                    : "text-dark"
                }
              />
            </button>
          </Card.Footer>
        )
      );
    }, [pagination]);

    if (renderItem) {
      const body = useMemo(() => {
        console.log(data);
        if (!data || data?.length === 0) {
          return (
            <Empty
              mini
              text="Ничего нет"
              desc="Контент уже скоро появится"
              image={() => <EmptyCatalog />}
            />
          );
        }
        return data && data.map((item, index) => renderItem(item, index));
      }, [data]);

      return (
        <>
          {body}
          {footerView}
        </>
      );
    }

    const head = useMemo(() => {
      return (
        <Row className={"head gx-0 " + headClassName}>
          {selectable && (
            <Col className="col-auto px-2">
              <Form.Check
                aria-label="all"
                onChange={() => onSelectedAll()}
                checked={data.length === selected.length}
              />
            </Col>
          )}
          {columns.map(({ name = "", size, width, align }, index) => {
            let optionAlign =
              align == "right"
                ? "d-flex text-right justify-content-end align-items-center"
                : align == "center"
                ? "text-center"
                : "";
            return (
              <Col
                style={width && { maxWidth: width }}
                md={size}
                className={["px-2", size == "auto" && "col-auto", optionAlign]}
                key={index}
              >
                {name}
              </Col>
            );
          })}
        </Row>
      );
    }, [selected, data]);

    const headerView = useMemo(() => {
      return (
        header && (
          <Card.Header className={classNameHeader}>{header}</Card.Header>
        )
      );
    }, [classNameHeader, selected, header]);

    const body = useMemo(() => {
      const List = memo(({ item, index }) => {
        index++;
        const [open, setOpen] = useState({ show: false, data: false });
        return (
          <div key={index} className="item">
            <Row
              className={[
                "gx-0",
                statusBackground,
                item.status && "status-" + item.status,
                isSelected(index) && "active",
              ]}
            >
              {selectable && (
                <Col className="col-auto px-2">
                  <Form.Check
                    checked={isSelected(index)}
                    aria-label={index}
                    onChange={() => onSelected({ index, item })}
                  />
                </Col>
              )}
              {columns.map(
                ({ selector = "", cell, align, size, width, openDesc }) => {
                  let optionAlign =
                    align == "right"
                      ? "d-flex text-right justify-content-end align-items-center"
                      : align == "center"
                      ? "text-center"
                      : "";
                  return (
                    <Col
                      md={size}
                      style={width && { maxWidth: width }}
                      className={[
                        "px-2",
                        size == "auto" && "col-auto",
                        optionAlign,
                      ]}
                    >
                      {openDesc ? (
                        <a
                          onClick={() =>
                            setOpen({ show: !open.show, data: openDesc })
                          }
                        >
                          <span>
                            {cell ? cell(item, index) : item[selector]}
                          </span>
                          <span className="ms-2">
                            {open.show ? (
                              <IoChevronUpOutline size={15} />
                            ) : (
                              <IoChevronDownOutline size={15} />
                            )}
                          </span>
                        </a>
                      ) : cell ? (
                        cell(item, index)
                      ) : (
                        item[selector]
                      )}
                    </Col>
                  );
                }
              )}
            </Row>
            {open.show && open.data && open.data(item)}
          </div>
        );
      });

      return (
        data &&
        data.map((item, index) => (
          <List key={index} item={item} index={index} />
        ))
      );
    }, [data, selected]);

    return (
      <Card className={"custom-table" + (lite ? " lite" : "")}>
        {headerView}
        <Card.Body className="p-0">
          <Container className="px-0" fluid>
            {columns && (
              <>
                {head}
                {body}
              </>
            )}
          </Container>
        </Card.Body>
        {footerView}
      </Card>
    );
  }
);
export default DataTable;
