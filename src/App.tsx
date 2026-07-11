import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrandProvider } from "./BrandContext";
import Layout from "./Layout";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Financing from "./pages/Financing";
import Locations from "./pages/Locations";

function App() {
  return (
    <BrandProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services/:serviceId" element={<ServiceDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="financing" element={<Financing />} />
            <Route path="locations" element={<Locations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  );
}

export default App;
