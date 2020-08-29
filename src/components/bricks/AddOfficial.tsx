import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField} from '@material-ui/core';

type Props = {
    openOfficial: boolean;
    officialClickClose: () => void;
}

const AddOfficial:React.FC<Props> = ({ openOfficial, officialClickClose }) => {
    const [state, setState] = useState({
        pin: '20908199600276',
        fullName: 'Сталбеков Мират Асылбекович',
        position: '',
    });
    
    return (
        <Dialog
            open={openOfficial}
            className="modal"
        >
            <DialogTitle>Добавление нового сотрудника</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <TextField 
                        required 
                        label="ПИН"
                        value={state.pin} 
                        onChange={(event) => setState({...state, pin: event.target.value})} />
                    <TextField  
                        fullWidth
                        label="Ф.И.О."
                        value={state.fullName} 
                        onChange={(event) => setState({...state, fullName: event.target.value})} />
                    <TextField 
                        fullWidth
                        required 
                        label="Должность"
                        value={state.position} 
                        onChange={(event) => setState({...state, position: event.target.value})} />
                </form>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={officialClickClose} color="primary">Отмена</Button>
                <Button onClick={officialClickClose} variant="contained" color="primary" disableElevation>Добавить</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddOfficial;