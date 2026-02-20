import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Crm } from './pages/Crm';
import { Agents } from './pages/Agents';
import { Analytics } from './pages/Analytics';
import { EmailGen } from './pages/EmailGen';
import { Settings } from './pages/Settings';
import { Research } from './pages/Research';
import { ResearchHub } from './pages/ResearchHub';
import { Planner } from './pages/Planner';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="research" element={<ResearchHub />} />
          <Route path="research/:leadId" element={<Research />} />
          <Route path="planner" element={<Planner />} />
          <Route path="leads" element={<Leads />} />
          <Route path="crm" element={<Crm />} />
          <Route path="agents" element={<Agents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="email-generator" element={<EmailGen />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
