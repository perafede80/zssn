import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SurvivorForm from "./components/SurvivorForm";
import SurvivorList from "./components/SurvivorList";
import SurvivorDetail from "./pages/SurvivorDetails";
import UpdateLocation from "./pages/UpdateLocation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-survivor" element={<SurvivorForm />} />
        <Route path="/survivors" element={<SurvivorList />} />
        <Route path="/survivors/:id" element={<SurvivorDetail />} />
        <Route path="/update-location/:id" element={<UpdateLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
