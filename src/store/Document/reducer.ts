import { Reducer } from "redux";
import { DocumentState } from "./types";
import { DocumentActions } from "./actions";
import { DocumentActionsTypes } from "./types";

const defaultState: DocumentState = {
    paymentOrderSuccess: false,
    contractSuccess: false,
};

export const DocumentReducer: Reducer<DocumentState, DocumentActions> = (state = defaultState, action) => {

    switch (action.type) {
        case DocumentActionsTypes.PAYMENT_ORDER_SUCCESS:
            return {
                ...state,
                paymentOrderSuccess: action.paymentOrderSuccess
            };
        case DocumentActionsTypes.CONTRACT_SUCCESS:
            return {
                ...state,
                contractSuccess: action.contractSuccess
            };
        default:
            return state;
    }
};

export default DocumentReducer;