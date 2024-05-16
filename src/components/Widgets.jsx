import React, { memo } from "react";
import WidgetBlogs from "./widget/WidgetBlogs";
import WidgetProjects from "./widget/WidgetProjects";
import WidgetServices from "./widget/WidgetServices";
import WidgetAbout from "./widget/WidgetAbout";
import WidgetPopular from "./widget/WidgetPopular";
import WidgetHello from "./widget/WidgetHello";
import WidgetStories from "./widget/WidgetStories";
import WidgetSales from "./widget/WidgetSales";
import WidgetBanners from "./widget/WidgetBanners";
import Catalog from "./Catalog";

const Widgets = memo(({ data }) => {
  console.log(data);
  return data?.length > 0
    ? data.map((e) =>
        e?.value == "services" ? (
          <WidgetServices {...e} />
        ) : e?.value == "hello" ? (
          <WidgetHello {...e} />
        ) : e?.value == "stories" ? (
          <WidgetStories {...e} />
        ) : e?.value == "menu" ? (
          <Catalog data={e.items} />
        ) : e?.value == "projects" ? (
          <WidgetProjects {...e} />
        ) : e?.value == "about" ? (
          <WidgetAbout {...e} />
        ) : e?.value == "popular" ? (
          <WidgetPopular {...e} />
        ) : e?.value == "blogs" ? (
          <WidgetBlogs {...e} />
        ) : e?.value == "banners" ? (
          <WidgetBanners {...e} />
        ) : e?.value == "sales" ? (
          <WidgetSales {...e} />
        ) : null
      )
    : null;
});

export default Widgets;
