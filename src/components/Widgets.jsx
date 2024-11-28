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
import WidgetCategories from "./widget/WidgetCategories";
import WidgetText from "./widget/WidgetText";

const Widgets = memo(({ data }) => {
  return data?.length > 0
    ? data.map((e) =>
        e?.value == "services" ? (
          <WidgetServices key={0} {...e} />
        ) : e?.value == "hello" ? (
          <WidgetHello key={1} {...e} />
        ) : e?.value == "text" ? (
          <WidgetText key={2} {...e} />
        ) : e?.value == "stories" ? (
          <WidgetStories key={3} {...e} />
        ) : e?.value == "menu" ? (
          <Catalog key={4} data={e.items} />
        ) : e?.value == "projects" ? (
          <WidgetProjects key={5} {...e} />
        ) : e?.value == "about" ? (
          <WidgetAbout key={6} {...e} />
        ) : e?.value == "popular" ? (
          <WidgetPopular key={7} {...e} />
        ) : e?.value == "blogs" ? (
          <WidgetBlogs key={8} {...e} />
        ) : e?.value == "banners" ? (
          <WidgetBanners key={9} {...e} />
        ) : e?.value == "sales" ? (
          <WidgetSales key={10} {...e} />
        ) : e?.value == "categories" ? (
          <WidgetCategories key={11} {...e} />
        ) : null
      )
    : null;
});

export default Widgets;
