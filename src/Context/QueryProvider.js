import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configura o Query Client
const queryClient = new QueryClient();

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
