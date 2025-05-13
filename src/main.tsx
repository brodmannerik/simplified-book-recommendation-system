import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import BookDetails from "./pages/BookDetails.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import { store } from "./store/store.ts";

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
