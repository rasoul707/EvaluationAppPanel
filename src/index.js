import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './redux/store';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



const theme = createTheme({
  palette: {
    primary: {
      main: "#009688"
    },
    // secondary: {
    //   main: "#000000"
    // }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={5}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <App />
          </LocalizationProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

reportWebVitals();
