import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartomantePage } from './pages/CartomantePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        theme="dark"
        richColors
        closeButton={false}
        duration={4000}
        toastOptions={{
          style: {
            background: 'rgba(19, 24, 37, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            color: '#E8ECF4',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px -5px rgba(232, 168, 50, 0.18)',
            padding: '14px 18px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<CartomantePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
