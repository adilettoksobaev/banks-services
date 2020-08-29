import React from 'react';
import { Grid, Tabs, Tab } from '@material-ui/core';
import InboxTable from '../bricks/InboxTable';
import MissingTable from '../bricks/MissingTable';
import HistoryTable from '../bricks/HistoryTable';
import DateRange from '../bricks/DateRange';

type Props = {

}

const Applications:React.FC<Props> = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div className="mainContent">
            <div className="topRow">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item>
                        <div className="title">Заявки</div>
                    </Grid>
                </Grid>
            </div>
            <Grid container spacing={3} justify="space-between" alignItems="center">
                <Grid item>
                    <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" className="tabs">
                        <Tab label="Входящие" {...a11yProps(0)} />
                        <Tab label="Пропущенные " {...a11yProps(1)} />
                        <Tab label="История" {...a11yProps(2)} />
                    </Tabs>
                </Grid>
                {value === 2 && 
                    <Grid item>
                        <DateRange />
                    </Grid>
                }
            </Grid>
            <TabPanel value={value} index={0}>
                <InboxTable />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <MissingTable />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <HistoryTable />
            </TabPanel>    
        </div>
    );
}

export default Applications;

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div className="tabPanel ">
            {children}
          </div>
        )}
      </div>
    );
}
  
function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}