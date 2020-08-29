import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { ModerationApi } from '../../api/ModerationApi';
import { CameraIcon } from '../../icons/icons';
import MissedVideoCallRoundedIcon from '@material-ui/icons/MissedVideoCallRounded';
import { useHistory } from 'react-router-dom';
import { MissingRequest } from '../../store/Moderation/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const MissingTable:React.FC<Props> = ({ sessionId, conferenceJoinLinkAction, missingRequestAction, requestIdAction }) => {
    let history = useHistory();
    const [missingRequest, setMissingRequest] = useState<MissingRequest[]>([]);

    useEffect(() => {
        if(sessionId) {
            ModerationApi.getMissingRequests(sessionId).then(data => {
                setMissingRequest(data);
            })
        }
    }, [sessionId]);

    const missingVideoCallClick = (missingRequest: MissingRequest) => {
        if(sessionId) {
            ModerationApi.startVideoCall(sessionId, missingRequest.requestId).then(data => {
                conferenceJoinLinkAction(data.conferenceJoinLink);
                missingRequestAction(missingRequest);
                requestIdAction(missingRequest.requestId);
                return history.push('/video-call');
            });
        }
    }

    return (
        <TableContainer className="tableContainer">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell style={{width: 16}}>№</TableCell>
                        <TableCell align="left">Фамилия Имя Отчество</TableCell>
                        <TableCell align="left">Дата и время заявки</TableCell>
                        <TableCell align="center">Номер телефона</TableCell>
                        <TableCell align="right">Действие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {missingRequest.map((item, i) => (
                        <TableRow key={'missing' + item.requestId}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell component="th" scope="row">{item.userName}</TableCell>
                            <TableCell align="left">{item.requestDate}</TableCell>
                            <TableCell align="center">{item.phone}</TableCell>
                            <TableCell align="right">
                                <Button className="tableLinkBlue" onClick={() => missingVideoCallClick(item)}>
                                    {item.requestType === 'Guest' && 
                                        <span className="table__name">Гость</span>
                                    }
                                    {item.requestType === 'VideoCall' && 
                                        <><span className="table__icon"><CameraIcon /></span><span className="table__name">Видеозвонок</span></>
                                    }
                                    {item.requestType === 'VideoRegistration' && 
                                        <><span className="table__icon"><MissedVideoCallRoundedIcon /></span><span className="table__name">Видеорегистрация</span></>
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
    missingRequestAction: (missingRequest: MissingRequest) => dispatch(actions.moderation.missingRequestAction(missingRequest)),
    requestIdAction: (requestId: number) => dispatch(actions.moderation.requestIdAction(requestId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MissingTable);