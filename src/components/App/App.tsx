import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Route, Switch, withRouter } from 'react-router-dom'
import './App.scss';
import AppStack from '../AppStack/AppStack';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Provider } from 'react-redux';
import store from '../../store';

const theme = createMuiTheme({
    typography: {
      fontFamily: 'Open Sans, sans-serif',
    },
    palette: {
      primary: { main: '#2290E0', contrastText: '#fff' }
    }
});

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Switch>
                    <Route path="/" component={AppStack} />
                    </Switch>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default withRouter(App);