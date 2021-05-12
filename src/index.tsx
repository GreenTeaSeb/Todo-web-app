import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';  import './index.css'
import CssBaseline from "@material-ui/core/CssBaseline";


const theme = createMuiTheme({
     palette: {
       type: 'dark',

        background: {
          default: "#e4f0e2",
        },
        primary: {
             main: '#7d30c0',
        },
        secondary: {
            main: '#11cb5f',
        },
        info:{
            main: '#8d74d5',
        },
    }
});



ReactDOM.render(
  <MuiThemeProvider theme = { theme} >
          <App className = "main" />
  </MuiThemeProvider>, 
  document.getElementById('root')
);

