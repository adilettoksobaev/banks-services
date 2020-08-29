import React, { Dispatch, useState } from 'react';
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
    newDepartmentOpen: boolean;
    newDepartmentToggle: () => void;
}

const NewDepartment:React.FC<Props> = ({ newDepartmentOpen, newDepartmentToggle, sessionId, positionSuccessAction, positionSuccess }) => {
    const [department, setDepartment] = useState<IDepartment>({
        departmentId: 0,
        departmentName: '',
        clientRegistration: false,
        colorId: 0,
        iconId: 0,
    });
    const [notification, setNotification] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDepartment({...department, clientRegistration: event.target.checked});
    };

    const iconModalClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const iconModalClose = () => {
        setAnchorEl(null);
    };

    const iconClick = (id: number) => {
        setDepartment(prevState => ({...prevState, iconId: id}));
    }

    const colorClick = (id: number) => {
        setDepartment(prevState => ({...prevState, colorId: id}));
    }

    const saveDepartment = () => {
        if(sessionId) {
            AdminAPI.setDepartments(sessionId, department).then(data => {
                if(data.success) {
                    positionSuccessAction(!positionSuccess);
                    setNotification(true);
                    newDepartmentToggle();
                    setDepartment({
                        departmentId: 0,
                        departmentName: '',
                        clientRegistration: false,
                        colorId: 0,
                        iconId: 0,
                    });
                }
            }).catch(({response}) => alert(response.data.message));
        }
    }

    const openIcon = Boolean(anchorEl);
    const currentIconFind = icons.find(item => item.id === department.iconId);
    
    return (
        <>
        <Dialog open={newDepartmentOpen} onClose={newDepartmentToggle} className="positionModal" fullWidth scroll="body">
            <IconButton className="modalClose" onClick={newDepartmentToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="positionModal__content">
                <div className="positionModal__title">Новый отдел</div>
                <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth className="positionModal__formControl">
                        <InputLabel shrink>Название нового отдела - Пункт меню в клиентском web-приложении</InputLabel>
                        <Input
                            value={department.departmentName}
                            onChange={(event) => setDepartment({...department, departmentName: event.target.value})}
                            autoFocus
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setDepartment({...department, departmentName: ''})}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText></FormHelperText>
                    </FormControl>
                    <FormControlLabel
                        className="positionModal__checkbox"
                        control={<Checkbox checked={department.clientRegistration} onChange={checkedChange} color="primary"/>}
                        label="Регистрация клиентов"
                    />
                    <div className="colorGroup">
                        <div className="colorGroup__title">Цвет отдела</div>
                        <div className="colorGroup__content">
                            {colors.map(color => (
                                <Fab key={color.id} style={{backgroundColor: color.name}} onClick={() => colorClick(color.id)}>{color.id === department.colorId && <CheckCircleOutlineIcon className="activeColor" />}</Fab>
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
                                    <Icon key={icon.id} className={`icon ${icon.id === department.iconId && "active"}`} onClick={() => iconClick(icon.id)}>{icon.name}</Icon>
                                ))}
                            </div>
                            <div className="iconModal__row">
                                <Button variant="outlined" color="primary" onClick={iconModalClose}>Закрыть</Button>
                            </div>
                        </Popover>
                    </div>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={newDepartmentToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveDepartment}>Сохранить</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <SnackbarAlert 
            notification={notification}
            setNotification={setNotification} 
            message="Вы успешно добавили должность!"
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

export default connect(mapStateToProps, mapDispatchToProps)(NewDepartment);