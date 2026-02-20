import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Crm } from './pages/Crm';
import { Agents } from './pages/Agents';

// Placeholder pages for later implementation
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <h1 className="text-3xl font-display font-bold text-white mb-2">{title}</h1>
    <p className="text-gray-400">Module currently under development.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="crm" element={<Crm />} />
          <Route path="agents" element={<Agents />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics Suite" />} />
          <Route path="email-generator" element={<PlaceholderPage title="Email Generator" />} />
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
