import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormGroup, FormControlLabel, Radio } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { StepRegistration } from '../../store/Admin/types';

type Props = ReturnType<typeof mapStateToProps> & {
    processOpen: boolean;
    processClickClose: () => void;
}

const ProcessDialog:React.FC<Props> = ({ processOpen, processClickClose, stepRegistration }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    useEffect(() => {
        if(stepRegistration) {
            formControlLabel.forEach((item, index) => item.stepRegistration === stepRegistration && setCurrentStep(index))
        } else {
            setCurrentStep(0);
        }
        const timer = setTimeout(() => {
            if(stepRegistration === StepRegistration.registration_ConfirmUserRegistrationInfo) {
                processClickClose();
            }
        }, 700);
        return () => clearTimeout(timer);
    }, [stepRegistration, processClickClose]);
    
    return (
        <Dialog
            open={processOpen}
            className="modal processModal"
        >
            <DialogTitle>Процесс регистраци клиента</DialogTitle>
            <DialogContent>
                <FormGroup>
                    {
                        formControlLabel.map((item, index) => (
                            <FormControlLabel
                                control={<Radio checked={stepRegistration === item.stepRegistration || index < currentStep} color="primary" checkedIcon={<CheckCircleIcon />} />}
                                label={item.label}
                            />
                        ))
                    }
                </FormGroup>
            </DialogContent>
            <DialogActions className="modal__actions">
                <Button onClick={processClickClose} variant="outlined" color="default">Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
}

interface FormControlLabel {
    label: string,
    stepRegistration: StepRegistration
}

const formControlLabel: FormControlLabel[] = [
    {
        label: "Ввод номера телефона",
        stepRegistration: StepRegistration.registration_StartRegistration,
    },
    {
        label: "Подтверждение номера телефона по смс",
        stepRegistration: StepRegistration.registration_CheckSmsCode
    },
    {
        label: "Добавление фото лица клиента",
        stepRegistration: StepRegistration.registration_UploadUserPhoto
    },
    {
        label: "Добавление фото паспорта - лицевая сторона",
        stepRegistration: StepRegistration.registration_UploadPassportFront
    },
    {
        label: "Добавление фото паспорта - оборотная сторона",
        stepRegistration: StepRegistration.registration_UploadPassportBack
    },
    {
        label: "Потверждение паспортных данных",
        stepRegistration: StepRegistration.registration_UploadUserPhotoWithPassport
    },
    {
        label: "Принятие юридических условий клиентом",
        stepRegistration: StepRegistration.registration_ConfirmUserRegistrationInfo
    }
]

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    activeRequest: state.moderation.activeRequest,
    stepRegistration: state.admin.stepRegistration,
});

export default connect(mapStateToProps)(ProcessDialog);