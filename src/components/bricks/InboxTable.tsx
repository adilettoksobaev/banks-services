import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CameraIcon } from '../../icons/icons';
import { ModerationApi } from '../../api/ModerationApi';
import { ActiveRequest } from '../../store/Moderation/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const InboxTable:React.FC<Props> = ({ sessionId, conferenceJoinLinkAction, activeRequestAction, requestIdAction }) => {
    let history = useHistory();
    const [activeRequest, setActiveRequest] = useState<ActiveRequest[]>([]);

    useEffect(() => {
        if(sessionId) {
            ModerationApi.getActiveRequests(sessionId).then(data => {
                setActiveRequest(data);
            });
            if(window.location.pathname === '/applications') {
                const setActiveRequestInterval = setInterval(() => {
                    ModerationApi.getActiveRequests(sessionId).then(data => {
                        setActiveRequest(data);
                    });
                }, 5000);
                return () => clearInterval(setActiveRequestInterval);
            }
        }
    }, [sessionId]);

    const startVideoCallClick = (activeRequest: ActiveRequest) => {
        if(sessionId) {
            ModerationApi.startVideoCall(sessionId, activeRequest.requestId).then(data => {
                conferenceJoinLinkAction(data.conferenceJoinLink);
                return history.push('/video-call');
            });
            activeRequestAction(activeRequest);
            requestIdAction(activeRequest.requestId);
        }
    }

    return (
        <TableContainer className="tableContainer">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell style={{width: 16}}>№</TableCell>
                        <TableCell align="left">Фамилия Имя Отчество</TableCell>
                        <TableCell align="left">Время ожидания</TableCell>
                        <TableCell align="right">Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activeRequest.map((item, i) => (
                        <TableRow key={'active' + item.requestId}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell component="th" scope="row">{item.userName}</TableCell>
                            <TableCell align="left">{item.waitingTime}</TableCell>
                            <TableCell align="right">
                                <Button className="tableLinkBlue" onClick={() => startVideoCallClick(item)}>
                                    {item.requestType === 'Guest' && 
                                        <span className="table__name">Гость</span>
                                    }
                                    {item.requestType === 'VideoCall' && 
                                        <><span className="table__icon"><CameraIcon /></span><span className="table__name">Видеозвонок</span></>
                                    }
                                    {item.requestType === 'VideoRegistration' && 
                                        <><span className="table__icon"><CameraIcon /></span><span className="table__name">Видеорегистрация</span></>
                                    }
                                    {item.requestType === 'Photo' && 
                                        <><span className="table__icon"><CameraIcon /></span><span className="table__name">Фото</span></>
                                    }
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    conferenceJoinLinkAction: (conferenceJoinLink: string) => dispatch(actions.moderation.conferenceJoinLinkAction(conferenceJoinLink)),
    activeRequestAction: (activeRequest: ActiveRequest) => dispatch(actions.moderation.activeRequestAction(activeRequest)),
    requestIdAction: (requestId: number) => dispatch(actions.moderation.requestIdAction(requestId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InboxTable);