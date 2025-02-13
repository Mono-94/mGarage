import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, } from '@mantine/core';
import App from './components/App';
import { LangProvider } from './utils/LangContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        components: {
          Input: {
            styles: (theme) => ({
              input: {
                '&:focus': {
                  borderColor: theme.colors.green[3],
                },
              },
            }),
          },
        }
      }}
    >
      <LangProvider>
        <App />
      </LangProvider>
    </MantineProvider>
  </React.StrictMode >
);
