import axios from "axios";
import {
  DADATA_URL_ADDRESS,
  DADATA_URL_STREET,
  DADATA_TOKEN,
} from "../config/api";

const getDadataStreets = async ({ query, city, locations }) => {
  let locationsData = locations || [];
  if (city && city.length > 0) {
    city.forEach((e) => locationsData.push({ city: e.toLowerCase() }));
  }
  return await axios.post(
    DADATA_URL_STREET,
    JSON.stringify({
      query,
      locations: locationsData,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + DADATA_TOKEN,
      },
    }
  );
};
const getDadataAddress = async (fiasId) => {
  return await axios.post(
    DADATA_URL_ADDRESS,
    JSON.stringify({ query: fiasId }),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + DADATA_TOKEN,
      },
    }
  );
};

export { getDadataStreets, getDadataAddress };
