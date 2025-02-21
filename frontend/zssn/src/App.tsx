import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SurvivorForm from "./components/SurvivorForm";
import SurvivorList from "./components/SurvivorList";
import SurvivorDetailPage from "./pages/SurvivorDetailsPage";
import UpdateLocationPage from "./pages/UpdateLocationPage";
import TradeInterfacePage from "./pages/TradeInterfacePage";
import TradeSelectionPage from "./pages/TradeSelectionPage";
import ReportSelectionPage from "./pages/ReportSelectionPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/survivors" element={<SurvivorList />} />
        <Route path="/survivors/:id" element={<SurvivorDetailPage />} />
        <Route path="/update-location/:id" element={<UpdateLocationPage />} />
        <Route path="/trade/select" element={<TradeSelectionPage />} />
        <Route path="/trade/:id" element={<TradeInterfacePage />} />
        <Route path="/report/select" element={<ReportSelectionPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/create-survivor" element={<SurvivorForm />} />
      </Routes>
    </Router>
  );
}

export default App;
