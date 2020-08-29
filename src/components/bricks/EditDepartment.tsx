import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, FormControl, Input, InputAdornment, Box, Button, InputLabel, FormHelperText, FormControlLabel, Checkbox, Fab, Popover } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AdminAPI, IDepartment } from '../../api/AdminAPI';
import SnackbarAlert from './SnackbarAlert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Icon from '@material-ui/core/Icon';
import { icons } from '../../utils/icons';
import { colors } from '../../utils/colors';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    editDepartmentOpen: boolean;
    editDepartmentClickClose: () => void;
    department: IDepartment;
}

const EditDepartment:React.FC<Props> = ({ editDepartmentOpen, editDepartmentClickClose, sessionId, positionSuccessAction, positionSuccess, department }) => {
    const [departmentState, setDepartmentState] = useState<IDepartment>({
        departmentId: 0,
        departmentName: '',
        clientRegistration: false,
        colorId: 0,
        iconId: 0,
    });
    const [notification, setNotification] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        setDepartmentState(department);
    }, [department]);

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDepartmentState({...departmentState, clientRegistration: event.target.checked});
    };

    const iconModalClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const iconModalClose = () => {
        setAnchorEl(null);
    };

    const iconClick = (id: number) => {
        setDepartmentState(prevState => ({...prevState, iconId: id}));
    }

    const colorClick = (id: number) => {
        setDepartmentState(prevState => ({...prevState, colorId: id}));
    }

    const saveDepartment = () => {
        if(sessionId) {
            AdminAPI.setDepartments(sessionId, departmentState).then(data => {
                if(data.success) {
                    positionSuccessAction(!positionSuccess);
                    setNotification(true);
                    editDepartmentClickClose();
                }
            }).catch(({response}) => alert(response.data.message));
        }
    }

    const openIcon = Boolean(anchorEl);
    const currentIconFind = icons.find(item => item.id === departmentState.iconId);
    
    return (
        <>
        <Dialog open={editDepartmentOpen} onClose={editDepartmentClickClose} className="positionModal" fullWidth scroll="body">
            <IconButton className="modalClose" onClick={editDepartmentClickClose}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="positionModal__content">
                <div className="positionModal__title">Новый отдел</div>
                <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth className="positionModal__formControl">
                        <InputLabel shrink>Название нового отдела - Пункт меню в клиентском web-приложении</InputLabel>
                        <Input
                            value={departmentState.departmentName}
                            onChange={(event) => setDepartmentState({...departmentState, departmentName: event.target.value})}
                            autoFocus
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setDepartmentState({...departmentState, departmentName: ''})}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText></FormHelperText>
                    </FormControl>
                    <FormControlLabel
                        className="positionModal__checkbox"
                        control={<Checkbox checked={departmentState.clientRegistration} onChange={checkedChange} color="primary"/>}
                        label="Регистрация клиентов"
                    />
                    <div className="colorGroup">
                        <div className="colorGroup__title">Цвет отдела</div>
                        <div className="colorGroup__content">
                            {colors.map(color => (
                                <Fab key={color.id} style={{backgroundColor: color.name}} onClick={() => colorClick(color.id)}>{color.id === departmentState.colorId && <CheckCircleOutlineIcon className="activeColor" />}</Fab>
                            ))}
                        </div>
                    </div>
                    <div className="iconGroup">
                        <div className="iconGroup__title">Иконка отдела</div>
                        <div className="iconGroup__content">
                            <Button className="iconGroup__select" variant="outlined" color="default" onClick={iconModalClick}>
                                <Icon>{currentIconFind ? currentIconFind.name : ''}</Icon>
                                <ArrowDropDownIcon className="downIcon" />
                            </Button>
                            <div className="iconGroup__label">Нажмите чтобы выбрать</div>
                        </div>
                        <Popover
                            open={openIcon}
                            anchorEl={anchorEl}
                            onClose={iconModalClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            className="iconModal"
                        >
                            <IconButton className="modalClose" onClick={iconModalClose}>
                                <CloseIcon />
                            </IconButton>
                            <div className="iconModal__title">Выберите иконку</div>
                            <div className="iconModal__content">
                                {icons.map(icon => (
                                    <Icon key={icon.id} className={`icon ${icon.id === departmentState.iconId && "active"}`} onClick={() => iconClick(icon.id)}>{icon.name}</Icon>
                                ))}
                            </div>
                            <div className="iconModal__row">
                                <Button variant="outlined" color="primary" onClick={iconModalClose}>Закрыть</Button>
                            </div>
                        </Popover>
                    </div>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={editDepartmentClickClose}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveDepartment}>Сохранить</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <SnackbarAlert 
            notification={notification}
            setNotification={setNotification} 
            message="Вы успешно отредактировали должность!"
            severity="success" 
            vertical="top" 
            horizontal="center" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    positionSuccess: state.admin.positionSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    positionSuccessAction: (positionSuccess: boolean) => dispatch(actions.admin.positionSuccessAction(positionSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDepartment);