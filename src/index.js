import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import "swiper/css";
import "swiper/css/navigation";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./helpers/i18n";
import App from "./App";
import moment from "moment";
import momentRu from "moment/locale/ru";
import { NotificationContainer } from "react-notifications";
moment.updateLocale("ru", momentRu);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <NotificationContainer />
    </PersistGate>
  </Provider>
);
