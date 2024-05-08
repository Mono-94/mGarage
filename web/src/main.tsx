import React from 'react';
import ReactDOM from 'react-dom/client';
import { VisibilityProvider } from './providers/visible';
import Garage from './components/garage';
import Menu from './components/menu';
import { MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider  theme={{colorScheme:'dark'}}>
      <VisibilityProvider componentName="Menu">
        <Menu />
      </VisibilityProvider>
      <VisibilityProvider componentName="Garage">
        <Garage />
      </VisibilityProvider>
    </MantineProvider>

  </React.StrictMode>
);
