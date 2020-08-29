import { combineReducers } from 'redux';
import auth from './Auth/reducer';
import moderation from './Moderation/reducer';
import admin from './Admin/reducer';
import document from './Document/reducer';

const rootReducer = combineReducers({
    auth,
    moderation,
    admin,
    document
});


export default rootReducer;