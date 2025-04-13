// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import { DndContext } from "@dnd-kit/core";
import Playground from "./pages/Playground";
export default function App() {
  return (
    <DndContext>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DndContext>
  );
}