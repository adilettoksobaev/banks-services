import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Grid, Tabs, Tab } from '@material-ui/core';
import PaymentOrderTable from '../bricks/PaymentOrderTable';
import { useRouteMatch } from 'react-router-dom';
import { ClientAPI } from '../../api/ClientAPI';
import { IPasswordInfo } from '../../store/Moderation/types';
import DocumentTable from '../bricks/DocumentTable';
import BankAccounts from '../bricks/BankAccounts';
import ImageModal from '../bricks/ImageModal';
import PasswordData from '../bricks/PasswordData';

type Props = ReturnType<typeof mapStateToProps>;

const ClientInfo:React.FC<Props> = ({ sessionId, settings }) => {
    const match = useRouteMatch();
    //@ts-ignore
    const customerId = parseInt(match.params.customerId);
    const [customer, setCustomer] = useState<IPasswordInfo | null>(null);
    const [tabValue, setTabValue] = React.useState(0);
    const [tabCustomer, setTabCustomer] = React.useState(0);
    const [openImage, setOpenImage] = useState(false);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    const tabCustomerChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabCustomer(newValue);
    };

    const imageClickOpen = () => {
        setOpenImage(true); 
    }

    const imageClickClose = (value: boolean) => {
        setOpenImage(value); 
    }

    useEffect(() => {
        if(sessionId) {
            ClientAPI.getPassportInfo(sessionId, customerId).then(data => {
                setCustomer(data);
            }).catch(({response}) => console.log(response.data.message));
        }
    }, [sessionId, customerId, setCustomer]);

    return (
        <div className="mainContent">
            {customer && 
                <div className="topRow">
                    <Grid container spacing={3} justify="space-between" alignItems="center">
                        <Grid item>
                            <div className="title">{customer.userName}</div>
                        </Grid>
                    </Grid>
                </div>
            }
            {customer && settings &&
                <div className="passwordModal clientInfo">
                    <div className="passwordModal__header">
                        <Tabs
                            value={tabCustomer}
                            onChange={tabCustomerChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="passwordModal__header"
                            >
                            <Tab label="Паспортные данные" {...a11yProps(0)} />
                            <Tab label="Банковские данные" {...a11yProps(1)} />
                        </Tabs>
                    </div>
                    <TabPanel value={tabCustomer} index={0}>
                        <div className="passwordModal__content">
                            <PasswordData 
                                passwordInfo={customer} 
                                imageClickOpen={imageClickOpen} 
                                customerId={customerId} 
                                clientInfo={true} />
                        </div>
                    </TabPanel>
                    <TabPanel value={tabCustomer} index={1}>
                        <div className="passwordModal__content">
                            <BankAccounts customerAccountId={customerId} />
                        </div>
                    </TabPanel>
                    <ImageModal 
                        openImage={openImage} 
                        imageClickClose={(value: boolean) => imageClickClose(value)} 
                        sessionId={sessionId}
                        customerId={customerId} 
                        apiKey={settings.apiKey}
                        clientInfo={true} />
                </div>
            }
            <div className="tableTop">
                <Grid container spacing={3} alignItems="center">
                    <Grid item><div className="title">Документы</div></Grid>
                    <Grid item>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="tabs"
                            >
                            <Tab label="Платежные поручения" {...a11yProps(0)} />
                            <Tab label="Договоры" {...a11yProps(1)} />
                        </Tabs>
                    </Grid>
                </Grid>
            </div>
            <TabPanel value={tabValue} index={0}>
                <PaymentOrderTable customerAccountId={customerId} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <DocumentTable customerAccountId={customerId} />
            </TabPanel>
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
    settings: state.admin.settings,
    activeRequest: state.moderation.activeRequest,
});

export default connect(mapStateToProps)(ClientInfo);