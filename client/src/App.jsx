import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./App.css";
import useLenis from "./hooks/useLenis";
import Header from "./common/Header/Header";
import Footer from "./common/Footer/Footer";
import Home from "./pages/Home/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";

function App() {
  useLenis();

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
