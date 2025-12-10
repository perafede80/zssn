import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SurvivorForm from './components/SurvivorForm';
import SurvivorList from './components/SurvivorList';
import LandingPage from './pages/LandingPage';
import ReportPage from './pages/ReportPage';
import ReportSelectionPage from './pages/ReportSelectionPage';
import SurvivorDetailPage from './pages/SurvivorDetailsPage';
import TradeInterfacePage from './pages/TradeInterfacePage';
import TradeSelectionPage from './pages/TradeSelectionPage';
import UpdateLocationPage from './pages/UpdateLocationPage';

function App() {
  return (
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
  );
}

export default App;
