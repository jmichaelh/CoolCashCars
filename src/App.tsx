import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FinancePage from './pages/FinancePage';
import PurchasePage from './pages/PurchasePage';
import ARTestDrivePage from './pages/ARTestDrivePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/finance/:id" element={<FinancePage />} />
        <Route path="/purchase/:id" element={<PurchasePage />} />
        <Route path="/ar-test-drive/:id" element={<ARTestDrivePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
