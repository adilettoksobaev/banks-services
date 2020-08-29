import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { LogoIcon } from '../../icons/icons';
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { randomColor } from '../../utils/randomColor';
import { ExitIcon } from '../../icons/icons'
import { SessionAPI } from '../../api/SessionAPI';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Header:React.FC<Props> = ({ sessionId, getUserInfo, logoutAction }) => {
    let history = useHistory();
    const [logoutOpen, setLogoutOpen] = useState(false);

    const logoutClick = () => {
        if(sessionId) {
            SessionAPI.closeSession(sessionId);
            logoutAction();
            return history.push('/');
        }
    }
    const userName = getUserInfo ? getUserInfo.fullName : '';

    return (
        <>
        <AppBar position="fixed" className="header">
            <Toolbar className="header__toolbar">
                <LogoIcon />
                <Box className="header__profile-box">
                    <Box className="header__profile">
                        <Avatar alt="" src="/broken-image.jpg" style={{backgroundColor: randomColor()}}>
                            {userName.substr(0, 1)}
                        </Avatar>
                        <Typography>{userName}</Typography>
                    </Box>
                    <Button color="inherit" className="header__button" endIcon={<ExitIcon />} onClick={() => setLogoutOpen(true)}>Выйти</Button>
                </Box>
            </Toolbar>
        </AppBar>
            <Dialog
                open={logoutOpen}
                className="modal confirm">
                <DialogTitle>Выход из системы</DialogTitle>
                <DialogContent>
                <p className="modal__text">Вы уверены, что хотите выйти ?</p>
                </DialogContent>
                <DialogActions className="modal__actions">
                    <Button onClick={() => setLogoutOpen(false)} color="primary">Отмена</Button>
                    <Button 
                        variant="contained" 
                        color={"secondary"} 
                        disableElevation
                        onClick={logoutClick}>Выход</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    getUserInfo: state.auth.getUserInfo,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    logoutAction: () => dispatch(actions.auth.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);