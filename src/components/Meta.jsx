import { ClientJS } from "clientjs";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

const Meta = ({
  title = null,
  description = null,
  image = null,
  type = "website",
}) => {
  const client = new ClientJS();
  const options = useSelector((state) => state.settings.options);

  return (
    <Helmet
      htmlAttributes={{ lang: client.getLanguage() }}
      encodeSpecialCharacters={true}
    >
      <title>{title ?? process.env.REACT_APP_SITE_NAME}</title>
      {options.yandexVerifyId && (
        <meta name="yandex-verification" content={options.yandexVerifyId} />
      )}
      <meta name="og:type" content={type} />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content={title ?? process.env.REACT_APP_SITE_NAME}
      />
      <meta
        name="og:title"
        content={title ?? process.env.REACT_APP_SITE_NAME}
      />
      <meta
        name="description"
        content={description ? description.slice(0, 160) : null}
      />
      <meta
        name="og:description"
        content={description ? description.slice(0, 160) : null}
      />
      <meta
        name="twitter:description"
        content={description ? description.slice(0, 160) : null}
      />
      <meta name="og:image" content={image ?? null} />
    </Helmet>
  );
};

export default Meta;
