import "bootstrap/dist/css/bootstrap.min.css";
import React, { useLayoutEffect, useState } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./assets/style.min.css";
import Loader from "./components/utils/Loader";
import { convertColor, setCssColor } from "./helpers/all";
import AppRouter from "./routes/AppRouter";
import { checkAuth, logout } from "./services/auth";
import { getOptions } from "./services/option";
import { updateAddresses } from "./store/reducers/addressSlice";
import { updateAffiliate } from "./store/reducers/affiliateSlice";
import { updateCartAll } from "./store/reducers/cartSlice";
import { updateOptions } from "./store/reducers/settingsSlice";
import { getFavorites } from "./services/favorite";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const options = useSelector((state) => state.settings.options);
  const cart = useSelector((state) => state.cart.items);
  const favorite = useSelector((state) => state.favorite.items);

  const updateColor = useCallback(
    (options) => {
      if (options.colorMain) {
        setCssColor("--main-color", options.colorMain);
        setCssColor(
          "--main-color-active",
          convertColor(options.colorMain, 0.9)
        );
        setCssColor(
          "--main-color-outline",
          convertColor(options.colorMain, 0.1)
        );
      }
    },
    [options]
  );

  useLayoutEffect(() => {
    (async () => {
      updateColor(options);
      await getOptions()
        .then(async (res) => {
          if (res?.options) {
            dispatch(updateOptions(res.options));
            updateColor(res.options);
          }

          dispatch(updateAffiliate(res.affiliates));

          if (localStorage.getItem("token")) {
            await checkAuth()
              .then(async (data) => {
                dispatch(updateAddresses(data.addresses));

                favorite.length === 0 && dispatch(getFavorites());
              })
              .catch(async (err) => {
                if (
                  err?.response?.status == 404 ||
                  err?.response?.status == 403
                ) {
                  dispatch(logout());
                }
              });
          }
        })
        .finally(() => setLoading(false));
    })();
  }, []);

  if (loading) {
    return <Loader full />;
  }

  return <AppRouter />;
}

export default App;
