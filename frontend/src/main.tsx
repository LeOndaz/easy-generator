import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient.ts';
import { UserProvider } from './contexts/UserContext.tsx';
import { App as AntApp } from 'antd';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AntApp>
          <App />
        </AntApp>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
