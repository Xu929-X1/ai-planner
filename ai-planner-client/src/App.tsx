// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/home";
import Planner from "./pages/planner";
import "./App.css";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}