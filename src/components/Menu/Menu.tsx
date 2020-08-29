import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { PersonalIcon, HistoryIcon } from '../../icons/icons';
import { NavLink } from 'react-router-dom';

type Props = ReturnType<typeof mapStateToProps>

const Menu: React.FC<Props> = (props) => {
    const { getUserInfo } = props;

    const companyAdmin = () => {
        if(getUserInfo && getUserInfo.roles === "CompanyAdmin") {
            return (
                <List>
                    <NavLink className="menuNav" to="/" exact>
                        <ListItem button>
                            <ListItemIcon>
                                <PersonalIcon />
                            </ListItemIcon>
                            <ListItemText primary="Персонал" />
                        </ListItem>
                    </NavLink>
                    <NavLink className="menuNav" to="/history">
                        <ListItem button>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="История" />
                        </ListItem>
                    </NavLink>
                </List>
            )
        }
    }

    const moderator = () => {
        if(getUserInfo && getUserInfo.roles === "Moderator") {
            return (
                <List>
                    <NavLink className="menuNav" to="/applications" exact>
                        <ListItem button>
                            <ListItemIcon>
                                <PersonalIcon />
                            </ListItemIcon>
                            <ListItemText primary="Заявки" />
                        </ListItem>
                    </NavLink>
                    <NavLink className="menuNav" to="/clients">
                        <ListItem button>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="Клиенты" />
                        </ListItem>
                    </NavLink>
                </List> 
            )
        }
    }

    return (
        <Drawer
            variant="permanent"
            className="menuDrawer">
            {companyAdmin()}
            {moderator()}
        </Drawer>
    )
}

const mapStateToProps = (state: RootState) => ({
    getUserInfo: state.auth.getUserInfo
});
  
export default connect(mapStateToProps)(Menu);