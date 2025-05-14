import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { store } from "./store/store.ts";
import Login from "./Pages/Login.tsx";
import Home from "./Pages/Home.tsx";
import BookDetails from "./Pages/BookDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="book/:id" element={<BookDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);
