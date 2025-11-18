import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <BrowserRouter>
      <AppStateProvider>{ui}</AppStateProvider>
    </BrowserRouter>
  );

export * from '@testing-library/react';
export { renderWithProviders };
