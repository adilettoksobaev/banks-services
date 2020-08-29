import React from 'react';
import { Grid } from '@material-ui/core';
import HistoryTable from '../bricks/HistoryTable';
import DateRange from '../bricks/DateRange';

type Props = {

}

const HistoryRequest:React.FC<Props> = () => {
    return (
        <div className="mainContent">
            <div className="topRow">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item>
                        <div className="title">История заявок</div>
                    </Grid>
                    <Grid item>
                        <DateRange />
                    </Grid>
                </Grid>
            </div>
            <HistoryTable />
        </div>    
    );
}

export default HistoryRequest;