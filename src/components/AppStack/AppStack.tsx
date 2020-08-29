import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from '../Header/Header';
import Personal from '../Personal/Personal';
import Applications from '../Applications/Applications';
import HistoryRequest from '../HistoryRequest/HistoryRequest';
import VideoCall from '../VideoCall/VideoCall';
import Authorization from '../Authorization/Authorization';
import Menu from '../Menu/Menu';
import Clients from '../Clients/Clients';
import ClientInfo from '../ClientInfo/ClientInfo';
import { SessionAPI } from '../../api/SessionAPI';
import { GetUserInfo } from '../../store/Auth/types';
import Spinner from '../Spinner/Spinner';
import Axios from 'axios';
import { ISettings } from '../../store/Admin/types';
import { InstanceHead } from '../../api/InstanceHead';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const AppStack:React.FC<Props> = (props) => {
    const { sessionId, isAuthorized, getUserInfoAction, loading, setLoaderAction, getUserInfo, settingsAction, logoutAction } = props;
    const { pathname } = window.location;

    useEffect(() => {
        const settingsUrl = `/companiesSettings/${window.location.hostname}/settings.json`;
        console.log('settingsUrl:', settingsUrl);
        const catchError = (response: any) => {
            if(response.status === 401) {
                logoutAction();
            }
            if(response.status === 400) {
                alert(response.message);
            }
            setLoaderAction(false);
        }
        Axios.get(settingsUrl).then(res => {
            settingsAction(res.data);
            InstanceHead.init(res.data.apiKey);
            SessionAPI.init(res.data.apiKey);
            if(sessionId) {
                setLoaderAction(true);
                SessionAPI.getUserInfo(sessionId).then(data => {
                    const getUserInfo = {
                        fullName: data.fullName,
                        inn: data.inn,
                        innOrganisation: data.innOrganisation,
                        roles: data.roles,
                    }
                    getUserInfoAction(getUserInfo, true);
                    setLoaderAction(false);
                }).catch(({response}) => catchError(response));
            }
        });
    }, [settingsAction, sessionId, getUserInfoAction, setLoaderAction, logoutAction]);

    // useEffect(() => {
    //     if(sessionId) {
    //         setLoaderAction(true);
    //         SessionAPI.getUserInfo(sessionId).then(data => {
    //             const getUserInfo = {
    //                 fullName: data.fullName,
    //                 inn: data.inn,
    //                 innOrganisation: data.innOrganisation,
    //                 roles: data.roles,
    //             }
    //             getUserInfoAction(getUserInfo, true);
    //             setLoaderAction(false);
    //         })
    //     }
    // }, [sessionId, getUserInfoAction, setLoaderAction]);

    if(loading) {
        return <Spinner fixed="fixed" />
    }

    if(!isAuthorized) {
        return <Authorization />
    }

    const companyAdmin = () => {
        if(getUserInfo && getUserInfo.roles === "CompanyAdmin") {
            return (
                <Switch>
                    <Route 
                        path="/" 
                        component={Personal}
                        exact />
                    <Route 
                        path="/history" 
                        component={HistoryRequest} />
                </Switch>
            )
        }
    }

    const moderator = () => {
        if(getUserInfo && getUserInfo.roles === "Moderator") {
            return (
                <Switch>
                    <Route 
                        path="/" 
                        render={() => <Redirect to="/applications" />} 
                        exact />
                    <Route 
                        path="/applications" 
                        component={Applications}  />
                    <Route 
                        path="/clients" 
                        component={Clients}
                        exact />
                    <Route 
                        path="/clients/:customerId" 
                        component={ClientInfo} />
                    <Route 
                        path="/history-request" 
                        component={HistoryRequest} />
                </Switch>
            )
        }
    }

    return (
        <>
        <Switch>
            <Route 
                path="/video-call" 
                component={VideoCall} />
        </Switch>
        <div className="mainContainer">
            <Spinner fixed="fixed" />
            {!pathname.match(/video-call/) && 
                <>
                    <Header />
                    <Menu />
                </>
            }
            {companyAdmin()}
            {moderator()}
        </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    isAuthorized: state.auth.isAuthorized,
    loading: state.auth.loading,
    getUserInfo: state.auth.getUserInfo
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getUserInfoAction: (getUserInfo: GetUserInfo, isAuthorized: boolean) => dispatch(actions.auth.getUserInfoAction(getUserInfo, isAuthorized)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    settingsAction: (settings: ISettings) => dispatch(actions.admin.settingsAction(settings)),
    logoutAction: () => dispatch(actions.auth.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStack);