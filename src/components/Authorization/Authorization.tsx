import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { TextField, Button, CircularProgress, InputAdornment } from '@material-ui/core';
import { AuthAPI } from '../../api/AuthAPI';
import SnackbarAlert from '../bricks/SnackbarAlert';
import ReactCodeInput from 'react-code-input';
import './Authorization.scss';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Authorization: React.FC<Props> = (props) => {
    const { employeePinConfirmAction, settings } = props;
    const [innEmployee, setInnEmployee] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState('');
    const [helperText, setHelperText] = useState('');
    const [further, setFurther] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loader, setLoader] = useState(false);
    const [employeeFullName, setEmployeeFullName] = useState('');

    const innOrganisation = settings ? settings.organizationInn : "";

    const catchError = (message: string) => {
        setMessage(message);
        setNotification(true);
        setFurther(false);
        setLoader(false);
    }

    const errorInn = (data: any) => {
        if(data.code === 429) {
            setFurther(true);
        } else {
            setFurther(false);
        }
        setMessage(data.message);
        setNotification(true);
        setLoader(false);
    }

    useEffect(() => {
        if(innEmployee.length === 14) {
            AuthAPI.getNameByInn(innOrganisation).then(res => {
                if(res.statusText === 'OK') {
                    setFurther(true);
                }
                setNotification(false);
            }).catch(({response}) => catchError(response.data.message));
            AuthAPI.getNameByInn(innEmployee).then(res => {
                if(res.statusText === 'OK') {
                    setFurther(true);
                }
                setNotification(false);
                setHelperText(res.data.name);
            }).catch(({response}) => catchError(response.data.message));
        } else {
            setHelperText('');
            setFurther(false);
        }
    }, [innEmployee, innOrganisation]);

    const innEmployeeClick = () => {
        setLoader(true);
        if(further) {
            AuthAPI.employeeCheck(innOrganisation, innEmployee).then(data => {
                setTimeout(() => {
                    setSuccess(data.success);
                    setEmployeeFullName(data.employeeFullName);
                    setLoader(false);
                }, 700)
            }).catch(({response}) => errorInn(response.data));
            setHelperText('');
        }
    }

    const pinCodeClick = () => {
        setLoader(true);
        AuthAPI.employeePinConfirm(pinCode, innOrganisation, innEmployee).then(data => {
            if(data.approve === true) {
                setNotification(false);
                employeePinConfirmAction(data.sessionId, true);
                setLoader(false);
            } else {
                setMessage('Вы ввели неправильный пинкод');
                setNotification(true);
                setLoader(false);
            }
        }).catch(({response}) => catchError(response.data.message));
    }

    const onKeyDownInnEmployee = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            innEmployeeClick();
        }
    }

    const innEmployeeView = () => {
        return (
            <div className="authorization__form">
                <div className="textField">
                    <TextField 
                        inputProps={{
                            maxLength: 14,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        label="Введите ИНН Сотрудника" 
                        value={innEmployee} 
                        onChange={(event) => setInnEmployee(event.target.value)} 
                        error={notification}
                        helperText={helperText} 
                        onKeyDown={onKeyDownInnEmployee} 
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <span className="count">{innEmployee.length} / 14</span>
                              </InputAdornment>
                            ),
                        }}/>
                </div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={innEmployeeClick}
                    disableElevation
                    disabled={further && innEmployee.length === 14 ? false : true} >
                    {loader ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
                </Button>
            </div>
        )
    }

    const pinCodeView = () => {
        return (
            <div className="authorization__form">
                <div className="textField">
                    <div className="textField__label">{employeeFullName}</div>
                    <ReactCodeInput 
                        type='password' 
                        fields={4} 
                        value={pinCode} 
                        onChange={(event: any) => setPinCode(event)} 
                        name="pinCode" 
                        inputMode="numeric"/>
                </div>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={pinCodeClick}
                    disableElevation
                    disabled={pinCode.length === 4 ? false : true} >
                    {loader ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
                </Button>
            </div>
        )
    }

    return (
        <div className="authorization">
            <div className="authorization__content">
                <div className="bankLogo">{settings && <img src={settings.logo} alt={settings.name} />}</div>
                {/* <div className="authorization__logo">
                    <LogoAuthorizationIcon />
                </div> */}
                {/* <div className="authorization__text">Надежная система авторизации и идентификации</div> */}
                <div className="authorization__title">Вход в систему</div>
                {success ? pinCodeView() : innEmployeeView()}
            </div>
            <SnackbarAlert 
                notification={notification}
                setNotification={setNotification} 
                message={message}
                severity="error" 
                vertical="top" 
                horizontal="center" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    settings: state.admin.settings
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    employeePinConfirmAction: (sessionId: string, isAuthorized: boolean) => dispatch(actions.auth.employeePinConfirmAction(sessionId, isAuthorized)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);