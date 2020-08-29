import React, { Dispatch, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Tabs, Tab, TextField, Icon } from '@material-ui/core';
import { BackIcon, PrevIcon } from '../../icons/icons';
import ConfirmModal from '../bricks/ConfirmModal';
import ImageModal from '../bricks/ImageModal';
import { useHistory } from 'react-router-dom';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
// import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { ModerationApi } from '../../api/ModerationApi';
import { baseUrl } from '../../utils/baseUrl';
import { ClientAPI } from '../../api/ClientAPI';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DocumentModal from '../bricks/DocumentModal';
import { ShareIcon, DocIcon, DataIcon } from '../../icons/icons';
import Axios from 'axios';
import { IDepartment } from '../../api/AdminAPI';
import { InstanceHead } from '../../api/InstanceHead';
import { icons } from '../../utils/icons';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import { IPasswordInfo, MissingRequest, ActiveRequest } from '../../store/Moderation/types';
import PasswordData from '../bricks/PasswordData';
import BankAccounts from '../bricks/BankAccounts';
import CallTransferDialog from '../bricks/CallTransferDialog';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ClientRegistration from '../bricks/ClientRegistration';
import { StepRegistration } from '../../store/Admin/types';
import { sessionStorageRemoveItem } from '../../utils/storage';
import ProcessDialog from '../bricks/ProcessDialog';


type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const VideoCall:React.FC<Props> = (props) => {
    const { sessionId, conferenceJoinLink, activeRequest, registerUserText, settings, stepRegistrationAction, stepRegistration, 
            missingRequest, requestId, missingRequestAction, activeRequestAction, registerUserTextAction } = props;
    let history = useHistory();

    const [openConfirm, setOpenConfirm] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [passwordInfo, setPasswordInfo] = useState<IPasswordInfo | null>(null);
    const [tabValue, setTabValue] = React.useState(0);
    const [modalOpen, setModalOpen] = useState({
        password: false,
        document: false,
    });
    const heightEl = useRef<HTMLDivElement | null>(null);
    const redirectList = useRef<HTMLDivElement | null>(null);
    const [fixedHeight, setFixedHeight] = useState<number>(0);
    const [redirectListHeight, setRedirectListHeight] = useState<number>(0);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [disabled, setDisabled] = useState(true);
    const [callOpen, setCallOpen] = useState(false);
    const [department, setDepartment] = useState<IDepartment | null>(null);
    const [clientRegOpen, setclientRegOpen] = useState(false);
    const [processOpen, setProcessOpen] = useState(false);

    const processClickClose = () => {
        setProcessOpen(false)
    }

    const clientRegClickOpen = () => {
        if(stepRegistration === "") {
            setclientRegOpen(true)
        } else {
            setProcessOpen(true) 
        }
    }

    const clientRegClickClose = () => {
        setclientRegOpen(false)
    }

    const documentModalClose = () => {
        setModalOpen(prevState => ({...prevState, document: false}))
    }

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabValue(newValue);
    };

    const callClickClose = () => {
        setCallOpen(false);
    }

    const confirmClickOpen = () => {
        setOpenConfirm(true);
        if(sessionId && requestId && passwordInfo) {
            ModerationApi.changePassportInfo(sessionId, parseInt(requestId), passwordInfo).then(data => {
                console.log(data);
            }).catch(({response}) => alert(response.data.message));
        }
    }

    const confirmClickClose = () => {
        setOpenConfirm(false);
    }

    const rejectClickOpen = () => {
        setOpenReject(true);
    }

    const rejectClickClose = () => {
        setOpenReject(false);
    }

    const imageClickOpen = () => {
        setOpenImage(true); 
    }

    const imageClickClose = (value: boolean) => {
        setOpenImage(value); 
    }

    const redirectVideoCall = (department: IDepartment) => {
        setDepartment(department);
        setCallOpen(true);
    }

    // const getVideoCallStatus = () => {
    //     if(sessionId && activeRequest) {
    //         ClientAPI.getVideoCallStatus(sessionId, activeRequest.requestId).then(data => {
    //             if(data.status === 'responseTimeout') {
    //                 history.push('/applications');
    //             }
    //             stepRegistration(data.action);
    //             getVideoCallStatus();
    //         }).catch(({response}) => alert(response.data.message));
    //     }
    // }

    // useEffect(() => {
    //     getVideoCallStatus();
    // }, [])
    

    useEffect(() => {
        if(sessionId && requestId) {
            ModerationApi.getPassportInfo(sessionId, parseInt(requestId)).then(data => {
                setPasswordInfo(data);
            });
            if(window.location.pathname === '/video-call') {
                const getVideoModerationStatusInterval = setInterval(() => {
                    ClientAPI.getVideoCallStatus(sessionId, parseInt(requestId)).then(data => {
                        if(data.status === 'responseTimeout') {
                            history.push('/applications');
                            return () => clearInterval(getVideoModerationStatusInterval);
                        }
                        if(data.action) {
                            stepRegistrationAction(data.action);
                        } else {
                            stepRegistrationAction("");
                        }
                        // if(data.action === "registration_WaitModeration") {
                        //     ModerationApi.getPassportInfo(sessionId, parseInt(requestId)).then(data => {
                        //         setPasswordInfo(data);
                        //     });
                        // }
                        ModerationApi.getPassportInfo(sessionId, parseInt(requestId)).then(data => {
                            setPasswordInfo(data);
                        });
                    }).catch(({response}) => alert(response.data.message));
                }, 1500);
                return () => clearInterval(getVideoModerationStatusInterval);
            }
        }
    }, [sessionId, requestId, history, stepRegistrationAction, missingRequest]);

    useEffect(() => {
        const settingsUrl = `/companiesSettings/${window.location.hostname}/settings.json`;
        Axios.get(settingsUrl).then(res => {
            InstanceHead.init(res.data.apiKey);
            if(sessionId) {
                ClientAPI.getDepartments(sessionId).then(data => {
                    setDepartments(data);
                }).catch(({response}) => alert(response));
            }
        });
    }, [sessionId]);

    const monitorHeight = document.documentElement.clientHeight;
    useEffect(() => {
        setTimeout(() => {
            if(heightEl.current) {
                setFixedHeight(heightEl.current.scrollHeight);
            }
            if(redirectList.current) {
                setRedirectListHeight(redirectList.current.scrollHeight);
            }
        }, 700)
    }, [fixedHeight]);
    
    const addScroll = fixedHeight > monitorHeight;
    const addRedirectScroll = redirectListHeight > 600;

    const goBackClick = () => {
        sessionStorageRemoveItem('missingRequest');
        sessionStorageRemoveItem('activeRequest');
        missingRequestAction(null);
        activeRequestAction(null);
        registerUserTextAction("");
        return history.goBack();
    }

    const guestGoBackClick = () => {
        sessionStorageRemoveItem('activeRequest');
        activeRequestAction(null);
        stepRegistrationAction("");
        return history.goBack();
    }

    const regSidebarView = () => {
        if(passwordInfo) {
            if((activeRequest && activeRequest.requestType === 'VideoRegistration') || (!activeRequest && missingRequest) || stepRegistration === "registration_WaitModeration") {
                return (
                    <div className="password" ref={heightEl} style={addScroll ? {height: monitorHeight, overflowY: 'scroll'} : {overflowY: 'scroll'}}>
                        <div className="password__back" onClick={goBackClick}>
                            <BackIcon />
                            <span>Входящие заявки</span>
                        </div>
                        <div className="password__content">
                            <Button 
                                color="primary" 
                                className="password__edit"
                                startIcon={<EditIcon />}
                                onClick={() => setDisabled(false)}>Редактировать</Button>
                            <div className="passwordData">
                                <TextField 
                                    fullWidth 
                                    label="Ф.И.О." 
                                    disabled={disabled}
                                    value={passwordInfo.userName} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, userName: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Персональный номер" 
                                    disabled={disabled}
                                    value={passwordInfo.userInn} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, userInn: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Паспорт серия №" 
                                    disabled={disabled}
                                    value={passwordInfo.passportNumber} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, passportNumber: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Дата рождения" 
                                    disabled={disabled}
                                    value={passwordInfo.dateBirth} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, dateBirth: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Дата выдачи паспорта" 
                                    disabled={disabled}
                                    value={passwordInfo.dateIssue} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, dateIssue: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Орган, выдавший паспорт" 
                                    disabled={disabled}
                                    value={passwordInfo.authority} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, authority: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Дата окончания срока действия" 
                                    disabled={disabled}
                                    value={passwordInfo.dateExpiry} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, dateExpiry: event.target.value})} />
                                <TextField 
                                    fullWidth 
                                    label="Адрес проживания" 
                                    disabled={disabled}
                                    value={passwordInfo.registrationAddress} 
                                    onChange={(event) => setPasswordInfo({...passwordInfo, registrationAddress: event.target.value})} />
                            </div>
                            <div className="password__imgRow">
                                <div className="password__title">Документы</div>
                                <div className="password__imgItem">
                                    {sessionId && requestId &&
                                        <>
                                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${requestId}/photo/142CF319-BD63-4B4C-A4E3-28F2430E477B`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${requestId}/passportFront/142CF319-BD63-4B4C-A4E3-28F2430E477B`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                                            <img src={`${baseUrl()}api/Moderation/GetUserPhoto/${sessionId}/${requestId}/passportBack/142CF319-BD63-4B4C-A4E3-28F2430E477B`} alt={passwordInfo.userName} onClick={imageClickOpen} />
                                        </>
                                    }
                                </div>
                            </div>
                            {/* <div className="dataMatches error">
                                <CheckCircleIcon />
                                <span>Данные совпадают с ГРС</span>
                            </div> */}
                        </div>
                        <div className="btnRow">
                        {registerUserText !== '' ? 
                            <div className="registerUserText">{registerUserText}</div> : 
                            <>
                                <Button onClick={rejectClickOpen} variant="contained" color="secondary" disableElevation>Отклонить</Button>
                                <Button onClick={confirmClickOpen} variant="contained" color="primary" disableElevation>Подтвердить</Button>
                            </>
                            }
                        </div>
                    </div> 
                )
            }
        }
    }

    return (
        <div className="videoContainer">
            {activeRequest && activeRequest.requestType === 'VideoCall' && 
            <>
                <div className="authClientData">
                    <div className="authClientData__back" onClick={goBackClick}>
                        <BackIcon />
                        <span>Входящие заявки</span>
                    </div>
                    <div className="clientInfo">
                        {sessionId && settings &&  
                            <Avatar className="profile__avatar" src={`${baseUrl()}api/Client/GetUserPhoto/${sessionId}/${activeRequest.customerAccountId}/photo/${settings.apiKey}`}>{activeRequest.userName.substr(0, 1)}</Avatar>
                        }
                        <div className="clientInfo__content">
                            <div className="clientInfo__span">Клиент банка</div>
                            <div className="clientInfo__name">{activeRequest.userName}</div>
                        </div>
                    </div>
                    <List className="clientList">
                        <ListItem button onClick={() => setModalOpen({document: false, password: !modalOpen.password})}>
                            <ListItemAvatar>
                                <DataIcon />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Личные данные"
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end">
                                    {modalOpen.password ? <span className="prevIcon"><PrevIcon /></span> : 
                                        <ArrowForwardIosIcon onClick={() => setModalOpen({document: false, password: true})} /> }
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem button onClick={() => setModalOpen({document: !modalOpen.document, password: false})}>
                            <ListItemAvatar>
                                <DocIcon />
                            </ListItemAvatar>
                            <ListItemText
                                primary="Документы"
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end">
                                    {modalOpen.document ? <span className="prevIcon"><PrevIcon /></span> : 
                                        <ArrowForwardIosIcon onClick={() => setModalOpen({document: true, password: false})} /> }
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <div className="callTransfer" ref={redirectList} style={addRedirectScroll ? {maxHeight: '60vh', overflowY: 'scroll'} : {}}>
                        <div className="callTransfer__title"><div className="callTransfer__icon"><ShareIcon /></div>Перевод звонка</div>
                        <List className="callTransferList">
                            {departments.map(department => {
                                const currentIcon = icons.find(icon => icon.id === department.iconId);
                                return (
                                    <ListItem button key={department.departmentId} onClick={() => redirectVideoCall(department)}>
                                        <ListItemAvatar>
                                            <Icon className="clientVideoCall__icon">{currentIcon ? currentIcon.name : <PanoramaFishEyeIcon />}</Icon>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={department.departmentName}
                                        />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </div>
                </div>
                <div className="passwordModal" style={modalOpen.password ? {display: 'block'} : {display: 'none'}}>
                    <IconButton className="modalClose" onClick={() => setModalOpen(prevState => ({...prevState, password: false}))}>
                        <CloseIcon />
                    </IconButton>
                    <div className="passwordModal__header">
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className="passwordModal__header"
                            >
                            <Tab label="Паспортные данные" {...a11yProps(0)} />
                            <Tab label="Банковские данные" {...a11yProps(1)} />
                        </Tabs>
                    </div>
                    <TabPanel value={tabValue} index={0}>
                        {passwordInfo &&
                            <PasswordData 
                                passwordInfo={passwordInfo} 
                                imageClickOpen={imageClickOpen} 
                                customerId={activeRequest.requestId} />
                        }
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <BankAccounts customerAccountId={activeRequest.customerAccountId} />
                    </TabPanel>
                </div>
                <DocumentModal 
                    modalOpen={modalOpen.document} 
                    documentModalClose={documentModalClose} 
                    customerAccountId={activeRequest.customerAccountId}/>
            </>
            }
            {activeRequest && activeRequest.requestType === 'Guest' &&
                <div className="authClientData">
                    <div className="authClientData__back" onClick={guestGoBackClick}>
                        <BackIcon />
                        <span>Входящие заявки</span>
                    </div>
                    <div className="clientInfo">
                        <Avatar>{activeRequest.userName.substr(0, 1)}</Avatar>
                        <div className="clientInfo__content">
                            <div className="clientInfo__span">Гость</div>
                            <div className="clientInfo__name">{activeRequest.userName}</div>
                        </div>
                    </div>
                    <div className="registrationBtn">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            disableElevation
                            startIcon={<AccountBoxIcon fontSize="large" />}
                            fullWidth
                            onClick={clientRegClickOpen}
                            >Регистрация клиента</Button>
                    </div>
                    <ClientRegistration 
                        clientRegOpen={clientRegOpen}
                        clientRegClickClose={clientRegClickClose} />
                    <ProcessDialog 
                        processOpen={processOpen}
                        processClickClose={processClickClose} />
                </div>
            }
            {regSidebarView()}
            <div className="iframe">
                {conferenceJoinLink && 
                    <iframe src={conferenceJoinLink} allow="camera;microphone" className="iframeContent" title="video call"></iframe>
                }
                {/* <div className="iframePreview">
                    <img src={PreviewImg} alt=""/>
                </div>
                <div className="iframe__icons">
                    <span><MicrophoneIcon /></span>
                    <span><VideoIcon /></span>
                    <span><CallIcon /></span>
                </div> */}
                {requestId && settings && 
                    <ImageModal 
                        openImage={openImage} 
                        imageClickClose={(value: boolean) => imageClickClose(value)} 
                        sessionId={sessionId}
                        apiKey={settings.apiKey}
                        customerId={parseInt(requestId)} />
                }
            </div>
            <ConfirmModal 
                openConfirm={openConfirm}
                confirmClickClose={confirmClickClose}
                text="Вы уверены, что хотите подтвердить личность клиента?"
                buttonText="Подтвердить" 
                cinfirm={true} />
            <ConfirmModal 
                openConfirm={openReject}
                confirmClickClose={rejectClickClose}
                text="Вы уверены, что хотите отклонить заявку клиента?"
                buttonText="Да" 
                cinfirm={false} />
            {department && 
                <CallTransferDialog 
                    callOpen={callOpen} 
                    callClickClose={callClickClose}
                    department={department} />
            }
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
          <div className="passwordModal__content">{children}</div>
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
    conferenceJoinLink: state.moderation.conferenceJoinLink,
    activeRequest: state.moderation.activeRequest,
    missingRequest: state.moderation.missingRequest,
    registerUserText: state.moderation.registerUserText,
    settings: state.admin.settings,
    stepRegistration: state.admin.stepRegistration,
    requestId: state.moderation.requestId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    stepRegistrationAction: (stepRegistration: StepRegistration | string) => dispatch(actions.admin.stepRegistrationAction(stepRegistration)),
    missingRequestAction: (missingRequest: MissingRequest | null) => dispatch(actions.moderation.missingRequestAction(missingRequest)),
    activeRequestAction: (activeRequest: ActiveRequest | null) => dispatch(actions.moderation.activeRequestAction(activeRequest)),
    registerUserTextAction: (registerUserText: string) => dispatch(actions.moderation.registerUserTextAction(registerUserText)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall);