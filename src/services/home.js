import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../config/api";
import { $api } from "./index";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: $api,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 350,
  endpoints: (build) => ({
    getHome: build.query({
      query: () => apiRoutes.HOME,
    }),
    getBanners: build.query({
      query: () => apiRoutes.BANNERS,
    }),
    getCategories: build.query({
      query: () => apiRoutes.CATEGORY_ALL,
    }),
    getSales: build.query({
      query: () => apiRoutes.SALES_GET,
    }),
    getStories: build.query({
      query: () => apiRoutes.STORIES,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSalesQuery,
  useGetBannersQuery,
  useGetStoriesQuery,
  useGetHomeQuery,
} = homeApi;
