import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.tsx";
import Login from "./Pages/Login.tsx";
import Home from "./Pages/Home.tsx";
import BookDetails from "./Pages/BookDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route index element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="book/:id" element={<BookDetails />} />
    </Routes>
  </BrowserRouter>
);
