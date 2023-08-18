import { Helmet } from "react-helmet";

const Meta = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title ?? process.env.REACT_APP_SITE_NAME}</title>
      <meta
        property="title"
        content={title ?? process.env.REACT_APP_SITE_NAME}
      />
      <meta
        property="og:title"
        content={title ?? process.env.REACT_APP_SITE_NAME}
      />
      <meta property="keywords" content="yooapp" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Russian" />

      {image && <meta property="og:image" content={image} />}
      {description && <meta property="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
};

export default Meta;
