import { createApi } from "@reduxjs/toolkit/query/react";
import { apiRoutes } from "../config/api";
import { $api } from "./index";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: $api,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ["Categories", "Widgets"],
  endpoints: (build) => ({
    getHome: build.query({
      query: (params) => {
        return {
          url: apiRoutes.HOME,
          params,
        };
      },
      providesTags: (result) => {
        if (result) {
          return [
            ...result.categories.map((category) => ({
              type: "Categories",
              id: category.id,
            })),
            ...result.widgets.map((widget) => {
              if (widget.value === "banners") {
                return widget.items.map((item) => ({
                  type: "Banners",
                  id: item.id,
                }));
              } else if (widget.value === "stories") {
                return widget.items.map((item) => ({
                  type: "Stories",
                  id: item.id,
                }));
              }

              return [{ type: "Widgets", id: widget.value }];
            }),
          ];
        }
        return ["Categories", "Widgets"];
      },
    }),
    updateHome: build.mutation({
      query: (params) => {
        return {
          url: apiRoutes.HOME,
          params,
        };
      },
      invalidatesTags: ["Categories", "Widgets"],
    }),
    getBanners: build.query({
      query: () => apiRoutes.BANNERS,
    }),
    getCategories: build.query({
      query: (params) => {
        return {
          url: apiRoutes.CATEGORY_ALL,
          params,
        };
      },
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
  useUpdateHomeMutation,
} = homeApi;
