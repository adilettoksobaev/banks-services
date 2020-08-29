import React from 'react';
import { Grid } from '@material-ui/core';
import Search from '../bricks/Search';
import ClientsTable from '../bricks/ClientsTable';

const Clients = () => {
    return (
        <div className="mainContent">
            <div className="topRow">
                <Grid container spacing={3}>
                    <Grid item>
                        <div className="title">Клиенты</div>
                    </Grid>
                    <Grid item>
                        <Search />
                    </Grid>
                </Grid>
            </div>
            <ClientsTable />    
        </div>
    );
}

export default Clients;