import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import BookDetails from "./pages/BookDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="book/:id" element={<BookDetails />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  </Provider>
);
