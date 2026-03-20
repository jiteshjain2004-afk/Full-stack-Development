import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { createTheme, ThemeProvider } from '@mui/material';
import App from './App';

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
  },
  palette: {
    primary: { main: '#e63946' },
    error:   { main: '#e63946' },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
