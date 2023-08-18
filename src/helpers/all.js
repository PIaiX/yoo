// value - цена, currency - выводить валюту (true|false))
import { LiaRubleSignSolid } from "react-icons/lia";
import { FILE_URL } from "../config/api";

const customPrice = (value, currency = true) => {
  if (!value) {
    return 0 + "\u00A0₽";
  }
  value = parseInt(value).toLocaleString();
  if (currency) {
    value = (
      <>
        {value}
        <LiaRubleSignSolid className="ruble ms-2" />
      </>
    );
  }
  return value;
};

const getImageURL = ({ path = "", size = "mini", type = "product" }) => {
  if (path && path.length > 0) {
    if (size == "mini") {
      return FILE_URL + "/" + type + "/mini/" + path[0].media;
    } else {
      return FILE_URL + "/" + type + "/" + path[0].media;
    }
  } else {
    return "/imgs/user2.jpg";
  }
};

export { customPrice, getImageURL };
