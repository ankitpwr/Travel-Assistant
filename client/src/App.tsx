import { BrowserRouter, Route, Routes } from "react-router";
import { ChatPage } from "./pages/ChatPage";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
