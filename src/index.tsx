import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; 

const theme = createMuiTheme({
     palette: {
       type: 'dark',

        background: {
          default: "#282a36",
        },
        primary: {
             main: '#282a36',
        },
        secondary: {
            main: '#44475a',
        },
        info:{
            main: '#fcfdff',
        },

    }
});



ReactDOM.render(
  <MuiThemeProvider theme = { theme} >
          <App className = "main" />
  </MuiThemeProvider>, 
  document.getElementById('root')
);

