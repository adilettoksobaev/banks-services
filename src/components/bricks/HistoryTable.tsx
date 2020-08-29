import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { ModerationApi } from '../../api/ModerationApi';
import { IHistoryResult } from '../../store/Moderation/types';
import Pagination from '@material-ui/lab/Pagination';

type Props = ReturnType<typeof mapStateToProps>;

const HistoryTable:React.FC<Props> = ({ sessionId, startDate, endDate }) => {

    const [historyResult, setHistoryResult] = useState<IHistoryResult[]>([]);
    const [foundRequests, setFoundRequests] = useState(0);
    const [page, setPage] = React.useState(1);
    const limit = 10;
    const min = (page -1) * limit;

    // const history: ISearchHistory = {
    //     dateFrom: startDate,
    //     dateTo: endDate,
    //     maxShowRequest: limit,
    //     skipRequest: min
    // }

    useEffect(() => {
        if(sessionId) {
            ModerationApi.searchHistory(sessionId, {dateFrom: startDate, dateTo: endDate, maxShowRequest: limit, skipRequest: min}).then(data => {
                setHistoryResult(data.requests);
                setFoundRequests(data.foundRequests);
            })
        }
    }, [sessionId, page, startDate, endDate, min]);

    const paginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    let currentCount = (foundRequests - (foundRequests % limit)) / limit;
    if (foundRequests % limit > 0) {
        currentCount = currentCount + 1;
    }

    return (
        <>
        <TableContainer className="tableContainer">
            <Table className="table">
                <TableHead className="tableHead">
                    <TableRow>
                        <TableCell style={{width: 16}}>№</TableCell>
                        <TableCell align="left">Фамилия Имя Отчество</TableCell>
                        <TableCell align="left">Дата и время заявки</TableCell>
                        <TableCell align="center">Статус заявки</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {historyResult.map((item, i) => (
                        <TableRow key={'history-' + item.requestId}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell component="th" scope="row">{item.userName}</TableCell>
                            <TableCell align="left">{item.requestDate}</TableCell>
                            {item.moderationResult ?
                                <TableCell align="center" className="tableLink tableLinkGreen">Принята</TableCell>
                                :
                                <TableCell align="center" className="tableLink tableLinkRed">Отклонена</TableCell>
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <div className="justify-center">
            {foundRequests > 9 && 
                <Pagination count={currentCount} page={page} onChange={paginationChange} shape="rounded" className="paginations" />
            }
        </div>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    startDate: state.moderation.startDate,
    endDate: state.moderation.endDate
});

export default connect(mapStateToProps)(HistoryTable);