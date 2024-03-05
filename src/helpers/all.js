import { useSelector } from "react-redux";
import { FILE_URL } from "../config/api";

const customPrice = (value, currency = true) => {
  if (!value) {
    return 0 + "\u00A0₽";
  }
  value = parseInt(value).toLocaleString();
  if (currency) {
    return value + "\u00A0₽";
  }
  return value;
};

const getImageURL = ({ path = "", size = "mini", type = "product" }) => {
  if (path && Array.isArray(path) && path?.length > 0) {
    if (size == "mini") {
      return FILE_URL + "/" + type + "/mini/" + path[0].media;
    } else {
      return FILE_URL + "/" + type + "/" + path[0].media;
    }
  } else if (path && path?.length > 0) {
    if (size == "mini") {
      return FILE_URL + "/" + type + "/mini/" + path;
    } else {
      return FILE_URL + "/" + type + "/" + path;
    }
  } else if (!type || type == "product" || type == "sale") {
    return "/imgs/empty-product-image.png";
  } else if (type == "user") {
    return "/imgs/avatar-full.png";
  }
};

const convertColor = (color, opacity) => {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

const convert = (value) => (value > 0 && value < 1 ? Math.round(Number(value) * 1000) : value);

const customWeight = (value) => {
  if (!value) {
    return null;
  }

  value = convert(value);

  let weight = value > 1000 ? (value / 1000) + "кг" : value + "г";

  return weight;
};

const statusData = {
  processing: {
    text: "Обработка",
    statusBg: "rgba(0,0,0,0.05)",
  },
  reservation: {
    text: "Предзаказ",
    statusBg: "rgba(0,0,0,0.05)",
  },
  new: { text: "Принят", statusBg: "rgba(0,0,0,0.05)" },
  preparing: {
    text: "Готовится",
  },
  prepared: {
    text: "Готов к выдаче",
  },
  delivery: {
    text: "Доставляется",
  },
  done: { text: "Завершен", statusBg: "rgba(0,0,0,0.05)" },
  canceled: { statusBg: "transparent", text: "Отменен" },
};

const deliveryData = {
  delivery: "Доставка",
  pickup: "Самовывоз",
};

const paymentData = {
  card: "Банковской картой",
  online: "Онлайн оплата",
  cash: "Наличными",
};

const getSettings = (name) => {
  const settings = useSelector((state) => state?.settings?.options);
  let option = settings ? settings[name] ?? false : false;
  return option;
};

const getCount = (cart) => {
  if (cart && cart.length > 0) {
    let value = 0;
    cart.map((item) => item?.cart?.count && (value += Number(item.cart.count)));
    return value;
  }
};

const declination = (value, data, view = true) => {
  value = Number(Math.abs(Number(value)) % 100);
  var num = value % 10;
  if (value > 10 && value < 20) return view ? value + " " + data[2] : data[2];
  if (num > 1 && num < 5) return view ? value + " " + data[1] : data[1];
  if (num == 1) return view ? value + " " + data[0] : data[0];
  return view ? value + " " + data[2] : data[2];
};

const setCssColor = (name, value) => {
  document.documentElement.style.setProperty(name, value);
}

export {
  setCssColor,
  customPrice,
  getImageURL,
  convertColor,
  customWeight,
  statusData,
  deliveryData,
  paymentData,
  getSettings,
  getCount,
  declination,
};
