import { createApi } from "@reduxjs/toolkit/query/react";
import { $authApi } from "./index";
import { apiRoutes } from "../config/api";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: $authApi,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 350,
  endpoints: (build) => ({
    getBanners: build.query({
      query: () => apiRoutes.BANNERS,
    }),
    getCategories: build.query({
      query: () => apiRoutes.CATEGORY_ALL,
    }),
    getSales: build.query({
      query: () => apiRoutes.SALES_GET,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetSalesQuery, useGetBannersQuery } =
  homeApi;
