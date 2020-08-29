import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Button, IconButton, Grid, Tabs, Tab, FormControlLabel, Radio } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PaymentOrderTable from '../bricks/PaymentOrderTable';
import PaymentOrderModal from '../bricks/PaymentOrderModal';
import DocumentTable from './DocumentTable';
import { ContractIcon } from '../../icons/icons';
import { ClientDocumentsAPI } from '../../api/ClientDocumentsAPI';
import SnackbarAlert from './SnackbarAlert';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    modalOpen: boolean,
    documentModalClose: () => void,
    customerAccountId: number,
}

const DocumentModal: React.FC<Props> = (props) => {
    const { modalOpen, documentModalClose, customerAccountId, sessionId, contractSuccess, contractSuccessAction } = props;
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const [contractChecked, setContractChecked] = useState(false);
    const [notification, setNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        error: false,
        message: '',
    });

    const catchError = (message: string) => {
        setNotification(true);
        setErrorMessage({error: true, message});
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };
    
    const paymentClickOpen = () => {
        setPaymentOpen(true);
    }

    const paymentClickClose = () => {
        setPaymentOpen(false);
    }

    const sendClientContract = () => {
        if(sessionId) {
            ClientDocumentsAPI.sendClientContract(sessionId, customerAccountId).then(data => {
                if(data.success === true) {
                    contractSuccessAction(!contractSuccess);
                    setNotification(true);
                    setErrorMessage({error: false, message: 'Вы успешно отправили документ!'});
                    setContractChecked(false);
                }
            }).catch(({response}) => catchError(response.data.message));
        }
    }

    return (
        <div className="documentModal" style={modalOpen ? {display: 'block'} : {display: 'none'}}>
            <IconButton className="modalClose" onClick={documentModalClose}>
                <CloseIcon />
            </IconButton>
            <div className="tableTop">
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <div className="tableTop__title">Документы</div>
                    </Grid>
                    <Grid item>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="documentModal__tabs"
                            >
                            <Tab label="Платежные поручения" {...a11yProps(0)} />
                            <Tab label="Договоры" {...a11yProps(1)} />
                        </Tabs>
                    </Grid>
                </Grid>
            </div>
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3} justify="flex-end" alignItems="center">
                    <Grid item>
                        <Button onClick={paymentClickOpen} variant="contained" color="primary" disableElevation>Платежное поручение</Button>
                    </Grid>
                </Grid>
                <br />
                <PaymentOrderTable customerAccountId={customerAccountId} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <div className="contract">
                    <FormControlLabel
                        className="contract__item"
                        control={
                            <Radio
                                checked={contractChecked}
                                onChange={(event) => setContractChecked(event.target.checked)}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label={
                            <>
                                <div className="contract__icon"><ContractIcon /></div>
                                <div className="contract__title">Клиентский договор</div>
                            </>
                        }
                    />
                </div>
                <Button
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    disabled={!contractChecked}
                    onClick={sendClientContract}>
                    Отправить клиенту
                </Button>
                <div className="documentHistory">
                    <div className="documentHistory__title">История договоров</div>
                    <DocumentTable customerAccountId={customerAccountId} />
                </div>
            </TabPanel>
            <PaymentOrderModal 
                paymentOpen={paymentOpen} 
                paymentClickClose={paymentClickClose} 
                customerAccountId={customerAccountId} />
            <SnackbarAlert 
                notification={notification}
                setNotification={setNotification} 
                message={errorMessage.message}
                severity={errorMessage.error ? "error" : "success"}
                vertical="top" 
                horizontal="center" />
        </div>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}
  
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        {...other}
      >
        {value === index && (
          <div>{children}</div>
        )}
      </div>
    );
}
  
function a11yProps(index: any) {
    return {
      'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    paymentOrderSuccess: state.document.paymentOrderSuccess,
    contractSuccess: state.document.contractSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    contractSuccessAction: (contractSuccess: boolean) => dispatch(actions.document.contractSuccessAction(contractSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentModal);