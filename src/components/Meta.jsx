import { Helmet } from "react-helmet";

const Meta = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="title" content={title} />
      <meta property="og:title" content={title} />
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
