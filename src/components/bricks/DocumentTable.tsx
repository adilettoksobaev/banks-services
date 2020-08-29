import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Paper } from '@material-ui/core';
import { ClientDocumentsAPI } from '../../api/ClientDocumentsAPI';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { IContract } from '../../store/Document/types';
import ContractModal from '../bricks/ContractModal';

type Props = ReturnType<typeof mapStateToProps> & {
    customerAccountId?: number
}

const DocumentTable:React.FC<Props> = ({ sessionId, customerAccountId, contractSuccess }) => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [documentId, setDocumentId] = useState('');
    const [contractOpen, setContractOpen] = useState(false);
    
    const contractClickOpen = (documentId: string) => {
        setContractOpen(true);
        setDocumentId(documentId)
    }

    const contractClickClose = () => {
        setContractOpen(false);
    }

    useEffect(() => {
        if(sessionId && customerAccountId) {
            ClientDocumentsAPI.getContracts(sessionId, customerAccountId).then(data => {
                setContracts(data);
            }).catch(({response}) =>  alert(response.data.message));
        }   
    }, [sessionId, customerAccountId, contractSuccess]);

    const signedPaymentOrders = contracts.filter(contract => contract.documentStatus === "Signed");

    return (
        <Paper>
            <TableContainer className="tableContainer clientsTable">
                <Table className="table" stickyHeader aria-label="sticky table">
                    <TableHead className="tableHead">
                        <TableRow>
                            <TableCell style={{width: 16}}>№</TableCell>
                            <TableCell align="left">Дата</TableCell>
                            <TableCell align="left">Документ</TableCell>
                            <TableCell align="right">Действие</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {signedPaymentOrders.map((contract, i) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell align="left"><Moment format="D MMMM YYYY">{contract.createdDate}</Moment></TableCell>
                                <TableCell component="th" scope="row">{contract.documentDescription}</TableCell>
                                <TableCell align="right">
                                    <Button color="primary" className="tableButton" onClick={() => contractClickOpen(contract.documentId)}>Просмотр</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ContractModal 
                contractOpen={contractOpen}
                contractClickClose={contractClickClose} 
                documentId={documentId} />
        </Paper>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    contractSuccess: state.document.contractSuccess,
    getUserInfo: state.auth.getUserInfo
});

export default connect(mapStateToProps)(DocumentTable);