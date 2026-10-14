import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import "./App.css";
import useLenis from "./hooks/useLenis";
import Header from "./common/Header/Header";
import Footer from "./common/Footer/Footer";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "./apis/apis";
import { setUser } from "./redux/authSlice";

function App() {
  useLenis();
  const dispatch = useDispatch();

  // restore the logged-in user from the cookie after a page refresh
  useEffect(() => {
    axios
      .get(`${USER_API_END_POINT}/me`, { withCredentials: true })
      .then((res) => dispatch(setUser(res.data.data.user)))
      .catch(() => dispatch(setUser(null)));
  }, [dispatch]);

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/product" element={<Product />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        theme="colored"
      />
    </div>
  );
}

export default App;
