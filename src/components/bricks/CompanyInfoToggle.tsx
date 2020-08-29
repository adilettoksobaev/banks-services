import React, { useState } from 'react';
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import OfficialTable from '../bricks/OfficialTable';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import AddOfficial from '../bricks/AddOfficial';

const CompanyInfoToggle = () => {
    const [expanded, setExpanded] = useState<string | false>('INN');
    const [openOfficial, setOfficial] = useState(false)

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const officialClickOpen = () => {
        setOfficial(true);
    }

    const officialClickClose = () => {
        setOfficial(false);
    }

    return (
        <div className="companyInfoToggle">
            <ExpansionPanel className="expansionPanel" expanded={expanded === 'INN'} onChange={handleChange('INN')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}>
                    <div>
                        <div className="expansionPanel__title">ИНН</div>
                        <div className="expansionPanel__subTitle">23011198400286</div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="expansionPanel__details">
                        <div className="expansionPanel__label">Расчетные счета</div>
                        <div className="expansionPanel__item">
                            <p>KGS: 12098989729090999</p>
                            <p>USD: 12098989729090999</p>
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel className="expansionPanel" expanded={expanded === 'Document'} onChange={handleChange('Document')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}>
                    <div>
                        <div className="expansionPanel__title">Документы организации</div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="expansionPanel__details">
                        <div className="expansionPanel__square">
                            <div className="expansionPanel__square-item"></div>
                            <div className="expansionPanel__square-item"></div>
                            <div className="expansionPanel__square-item"></div>
                            <div className="expansionPanel__square-item"></div>
                            <div className="expansionPanel__square-item"></div>
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel className="expansionPanel" expanded={expanded === 'Position'} onChange={handleChange('Position')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}>
                    <div>
                        <div className="expansionPanel__title">Должностные лица</div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div className="expansionPanel__details">
                        <OfficialTable />
                        <Button onClick={officialClickOpen} className="officialAdd" color="primary" startIcon={<PersonAddOutlinedIcon />}>Добавить должностное лицо</Button>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <AddOfficial openOfficial={openOfficial} officialClickClose={officialClickClose} />
        </div>
    );
}

export default CompanyInfoToggle;