// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Listing from "./pages/listingpage/Listing"

const App: React.FC = () => {
  return (
    <div>
      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
      </Routes>
    </div>
  );
};

export default App;
