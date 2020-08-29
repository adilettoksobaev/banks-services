import { StateType } from 'typesafe-actions';
import rootReducer from './root-reducer';


import * as AuthActions from './Auth/actions';
import * as ModerationActions from './Moderation/actions';
import * as AdminionActions from './Admin/actions';
import * as DocumentActions from './Document/actions';

export { default } from './store';
export { default as rootReducer } from './root-reducer';

export const actions = {
    auth: AuthActions,
    moderation: ModerationActions,
    admin: AdminionActions,
    document: DocumentActions,
}

export type RootState = StateType<typeof rootReducer>;
