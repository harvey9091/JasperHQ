import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';

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
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<PlaceholderPage title="Lead Research Module" />} />
          <Route path="crm" element={<PlaceholderPage title="CRM Pipeline" />} />
          <Route path="agents" element={<PlaceholderPage title="Agent Manager" />} />
          <Route path="analytics" element={<PlaceholderPage title="Analytics Suite" />} />
          <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
