import moment from "moment";
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
  } else if (
    !type ||
    type == "product" ||
    type == "sale" ||
    type == "addition"
  ) {
    return "/imgs/empty-product-image.png";
  } else if (type == "story") {
    return "/imgs/story.jpg";
  } else if (type == "user") {
    return "/imgs/avatar-full.png";
  }
};

const convertColor = (color, opacity) => {
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

const weightTypes = [
  { title: "мл", value: "мл" },
  { title: "л", value: "л" },
  { title: "гр", value: "гр" },
  { title: "кг", value: "кг" },
  { title: "т", value: "т" },
  { title: "шт", value: "шт" },
  { title: "м", value: "м" },
  { title: "см", value: "см" },
  { title: "мм", value: "мм" },
  { title: "м2", value: "м2" },
  { title: "м3", value: "м3" },
];

const tagsData = [
  { name: "chicken", value: "/imgs/tags/chicken.png" },
  { name: "fish", value: "/imgs/tags/fish.png" },
  { name: "halal", value: "/imgs/tags/halal.png" },
  { name: "meat", value: "/imgs/tags/meat.png" },
  { name: "pepper", value: "/imgs/tags/pepper.png" },
  { name: "vegetarian", value: "/imgs/tags/vegetarian.png" },
];

const customWeight = ({ value, type = "г" }) => {
  if (!value) {
    return 0;
  }
  let typeData = weightTypes.find((e) => e.value == type)?.title ?? "г";

  value =
    Number(value) < 1 && typeData === 'г' ? Math.pow(10, value.toString().split(".")[1].length) * Number(value) : Number(value);
  value = value + typeData;

  return value;
};

const statusData = {
  processing: {
    icon: (
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M35.091 13H18.135a.406.406 0 0 0-.406.406v1.57h-1.57a.406.406 0 0 0-.407.407v17.929h-2.408a.407.407 0 0 0-.351.203c-.046.079-.09.143-.131.205-.255.38-.36.633-.36 1.624 0 .712.404 1.609 1.054 2.342.752.847 1.676 1.314 2.602 1.314h13.05c.865 0 1.67-.257 2.346-.697a4.316 4.316 0 0 0 3.943-4.295V13.406a.406.406 0 0 0-.406-.406ZM16.158 38.188c-.932 0-1.649-.652-1.993-1.041-.508-.573-.85-1.297-.85-1.803 0-.842.07-.945.221-1.17l.033-.05h12.192a3.65 3.65 0 0 0 1.151 4.063H16.159Zm10.207-2.844c0-.5.132-.992.38-1.422a.406.406 0 0 0-.35-.61h-9.83V15.789h16.143v18.898c0 1.93-1.57 3.5-3.5 3.5a2.846 2.846 0 0 1-2.843-2.843Zm8.32-1.336c0 1.36-.782 2.549-1.929 3.127.482-.696.765-1.54.765-2.448V15.383a.406.406 0 0 0-.406-.406H18.54v-1.165h16.144v20.196Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={0.8}
          d="M21.833 20.583H30.5m-8.667 3.792H30.5m-11.917 4.333H30.5"
        />
      </svg>
    ),
    image: false,
    text: 'Обработка',
    statusBg: '#666',
  },
  reservation: {
    icon: (
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M34.192 15.808A12.915 12.915 0 0025 12a12.915 12.915 0 00-9.192 3.808A12.915 12.915 0 0012 25c0 3.472 1.352 6.737 3.808 9.192A12.915 12.915 0 0025 38c3.472 0 6.737-1.352 9.192-3.808A12.915 12.915 0 0038 25c0-3.472-1.352-6.737-3.808-9.192zm-.538 17.846A12.158 12.158 0 0125 37.238a12.158 12.158 0 01-8.654-3.584A12.158 12.158 0 0112.762 25c0-3.269 1.273-6.342 3.584-8.654A12.158 12.158 0 0125 12.762c3.269 0 6.342 1.273 8.654 3.584A12.158 12.158 0 0137.238 25c0 3.269-1.273 6.342-3.584 8.654z"
          fill="currentColor"
        />
        <path
          d="M25 16.07a.38.38 0 00-.38.381v1.629a.38.38 0 10.761 0v-1.628a.38.38 0 00-.38-.381zm0 15.47a.38.38 0 00-.38.38v1.628a.38.38 0 10.761 0V31.92a.38.38 0 00-.38-.38zm8.549-6.92H31.92a.381.381 0 000 .76h1.629a.381.381 0 000-.76zm-15.47 0h-1.627a.38.38 0 000 .76h1.628a.381.381 0 000-.76zm.413-3.817l-.705-.407a.381.381 0 00-.38.66l.705.407a.382.382 0 00.52-.14.381.381 0 00-.14-.52zm14.102 8.141l-.705-.407a.38.38 0 00-.381.66l.705.407a.38.38 0 10.38-.66zm-3.13-11.677a.38.38 0 00-.52.14l-.407.704a.38.38 0 00.66.381l.407-.705a.381.381 0 00-.14-.52zm-8.14 14.101a.38.38 0 00-.52.14l-.408.705a.381.381 0 00.66.38l.407-.705a.381.381 0 00-.14-.52zm11.41-10.833a.38.38 0 00-.521-.14l-.705.408a.38.38 0 00.38.66l.706-.407a.381.381 0 00.14-.52zm-14.102 8.142a.38.38 0 00-.52-.14l-.705.407a.38.38 0 00.38.66l.706-.407a.38.38 0 00.139-.52zm2.83-10.566l-.406-.705a.38.38 0 00-.66.381l.407.705a.379.379 0 00.52.14.381.381 0 00.14-.52zm8.142 14.102l-.407-.705a.38.38 0 00-.66.38l.408.706a.38.38 0 10.66-.381zm1.064-8.085a.38.38 0 00-.434-.319l-4.173.642a1.196 1.196 0 00-1.592-.52l-4.084-4.085a.381.381 0 00-.539.538l4.084 4.085A1.196 1.196 0 0025 26.195c.59 0 1.08-.429 1.177-.99l4.173-.643a.381.381 0 00.318-.434zM25 25.433a.434.434 0 11.001-.867.434.434 0 010 .867z"
          fill="currentColor"
        />
        <path
          d="M31.843 16.963a10.522 10.522 0 00-7.24-2.512 10.518 10.518 0 00-7.068 3.084 10.517 10.517 0 00-3.084 7.069 10.523 10.523 0 002.513 7.239.38.38 0 10.58-.495 9.763 9.763 0 01-2.332-6.716 9.758 9.758 0 012.861-6.559 9.757 9.757 0 016.559-2.86 9.763 9.763 0 016.716 2.33.38.38 0 00.495-.58zm1.193 1.194a.381.381 0 00-.579.495 9.764 9.764 0 012.33 6.716 9.758 9.758 0 01-2.86 6.559 9.758 9.758 0 01-6.559 2.86 9.763 9.763 0 01-6.716-2.33.38.38 0 00-.495.58 10.518 10.518 0 007.24 2.512 10.517 10.517 0 007.068-3.084c1.89-1.89 2.985-4.4 3.084-7.069a10.524 10.524 0 00-2.513-7.239z"
          fill="currentColor"
        />
      </svg>
    ),
    image: false,
    text: 'Предзаказ',
    statusBg: '#ab41ff',
  },
  new: {
    icon: (
      <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path
          fill="currentColor"
          d="M35.091 13H18.135a.406.406 0 0 0-.406.406v1.57h-1.57a.406.406 0 0 0-.407.407v17.929h-2.408a.407.407 0 0 0-.351.203c-.046.079-.09.143-.131.205-.255.38-.36.633-.36 1.624 0 .712.404 1.609 1.054 2.342.752.847 1.676 1.314 2.602 1.314h13.05c.865 0 1.67-.257 2.346-.697a4.316 4.316 0 0 0 3.943-4.295V13.406a.406.406 0 0 0-.406-.406ZM16.158 38.188c-.932 0-1.649-.652-1.993-1.041-.508-.573-.85-1.297-.85-1.803 0-.842.07-.945.221-1.17l.033-.05h12.192a3.65 3.65 0 0 0 1.151 4.063H16.159Zm10.207-2.844c0-.5.132-.992.38-1.422a.406.406 0 0 0-.35-.61h-9.83V15.789h16.143v18.898c0 1.93-1.57 3.5-3.5 3.5a2.846 2.846 0 0 1-2.843-2.843Zm8.32-1.336c0 1.36-.782 2.549-1.929 3.127.482-.696.765-1.54.765-2.448V15.383a.406.406 0 0 0-.406-.406H18.54v-1.165h16.144v20.196Z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={0.8}
          d="M21.833 20.583H30.5m-8.667 3.792H30.5m-11.917 4.333H30.5"
        />
      </svg>
    ),
    text: 'Принят', statusBg: '#222'
  },
  preparing: {
    image: "/imgs/cooking.gif",
    text: 'Готовится',
    statusBg: '#3366ff',
  },
  prepared: {
    image: "/imgs/prepared.gif",
    text: 'На выдаче',
    statusBg: '#ffab00',
  },
  delivery: {
    image: "/imgs/delivery.gif",
    text: 'Доставка',
    statusBg: '#00b8d9',
  },
  done: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="12.5" stroke="currentColor" />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
          d="m17.91 25.246 4.652 4.188a1.083 1.083 0 0 0 1.49-.04l7.94-7.94"
        />
      </svg>
    ),
    text: 'Завершен', statusBg: '#00ab55'
  },
  canceled: {
    icon: (
      <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx={25} cy={25} r={12.5} stroke="currentColor" />
        <path
          d="M29 21l-8 7.92M21 21.08L29 29"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    ),
    image: false,
    text: 'Отменен',
    statusBg: '#ff5630',
  },
};

const deliveryData = {
  delivery: 'Доставка',
  pickup: 'Самовывоз',
  hall: 'В зале',
  feedback: 'Обратная связь',
}

const paymentData = {
  card: "Банковской картой",
  online: "Онлайн оплата",
  cash: "Наличными",
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
};
const setClassName = (name, value) => {
  // Проверяем, есть ли уже класс
  if (document.documentElement.classList.contains(name)) {
    // Если есть, удаляем его
    document.documentElement.classList.remove(name);
  }

  // Добавляем новый класс с нужным значением
  document.documentElement.classList.add(`${name}-${value}`);
};

const localeData = [
  {
    title: "Русский",
    image: require("../assets/imgs/country/russia.png"),
    lang: "ru",
  },
  {
    title: "Казахский",
    image: require("../assets/imgs/country/kazakhstan.png"),
    lang: "kk",
  },
  {
    title: "Английский",
    image: require("../assets/imgs/country/united-states.png"),
    lang: "en",
  },
];

const getLang = (value) => {
  let lang = localeData.find((e) => e.lang === value)
  return lang?.title;
};
const generateSeoText = ({ text, name, site }) => {
  const regexName = /\{\{name\}\}/;
  const regexSite = /\{\{site\}\}/;
  var replacedName = text.replace(/<[^>]+>/g, "").slice(0, 160);
  if (name) {
    replacedName = replacedName.replace(regexName, name);
  }
  if (site) {
    replacedName = replacedName.replace(regexSite, site);
  }
  return replacedName;
};
const isUpdateTime = (dateTime) => {
  if (!dateTime) {
    return true;
  }
  const targetDateTime = moment(dateTime);
  const now = moment();

  const timeDifference = now.diff(targetDateTime, "minutes");

  return timeDifference >= 1;
};
const childrenArray = (data, idProp, parentProp) => {
  const tree = Object.fromEntries(data.map(n => [n[idProp], { ...n, children: [] }]));

  return Object
    .values(tree)
    .filter(n => !(tree[n[parentProp]] && tree[n[parentProp]].children.push(n)));
}

const languageCode = (value) => {
  const normalizedLanguageCode = value.toLowerCase().replace(/_/g, "-");

  const mappedLanguageCode = {
    "ru": "ru",
    "ru-ru": "ru",
    "ru-RU": "ru",
    "ru_RU": "ru",
    "kk": "kk",
    "kk-kz": "kk",
    "kk-KZ": "kk",
    "kk_KZ": "kk",
    "en": "en",
    "en-us": "en",
    "en-US": "en",
    "en_US": "en",
  };

  return mappedLanguageCode[normalizedLanguageCode] || "ru";
};

export {
  isUpdateTime,
  generateSeoText,
  setCssColor,
  setClassName,
  customPrice,
  getImageURL,
  convertColor,
  customWeight,
  getLang,
  languageCode,
  localeData,
  statusData,
  deliveryData,
  paymentData,
  getCount,
  declination,
  childrenArray,
  tagsData,
};
