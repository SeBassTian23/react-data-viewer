import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Plot from "./pages/Plot";
import Map from "./pages/Map";
import Spreadsheet from "./pages/Spreadsheet";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

export default function RenderRoutes(props) {
  const location = useLocation();
  return (
    <Suspense fallback={<h1>Loading Content…</h1>}>
      <Routes>
        <Route path="/" exact element={<Dashboard key={location.pathname} {...props} />} />
        <Route path="/plot" exact element={<Plot {...props} />} />
        <Route path="/map" exact element={<Map {...props} />} />
        <Route path="/spreadsheet" exact element={<Spreadsheet {...props} />} />
        <Route path="/documentation" element={<Documentation {...props} />} />
        <Route path="*" element={<NotFound {...props} />}  />
      </Routes>
    </Suspense>
  );
}
