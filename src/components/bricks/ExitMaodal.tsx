import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Link } from '@material-ui/core';

type Props = {
    exitOpen: boolean;
    exitClickClose: () => void;
}

const ExitMaodal:React.FC<Props> = ({ exitOpen, exitClickClose }) => {
    return (
        <Dialog
            open={exitOpen}
            className="modal confirm"
        >
            <DialogTitle>Выйти из системы?</DialogTitle>
            <DialogContent>
                <p className="modal__text">Вы уверены, что хотите выйти из своей учетной записи?</p>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={exitClickClose} color="primary">Отмена</Button>
                <Link href="/" className="link"><Button variant="contained" color="primary" disableElevation>Завершить</Button></Link>
            </DialogActions>
        </Dialog>
    );
}

export default ExitMaodal;