import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import './assets/style.min.css';
import Loader from "./components/utils/Loader";
import AppRouter from "./routes/AppRouter";
import { checkAuth, logout } from "./services/auth";
import { setAuth, setUser } from "./store/reducers/authSlice";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (localStorage.getItem("token")) {
      checkAuth()
        .then((data) => {
          data && dispatch(setUser(data));
          data && dispatch(setAuth(true));
        })
        .catch(() => dispatch(logout()))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader full />;
  }

  return <AppRouter />;
}

export default App;
