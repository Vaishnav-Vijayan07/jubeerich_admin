// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { SubStatusActionTypes } from "./constants";

const INIT_STATE = {
    subStatus: [],
    loading: false,
    error: {},
};

interface StatusData {
    id: string;
    status_id: string,
    next_status: string,
    updated_by: string,
}

export interface StatusActionType {
    type:
    | SubStatusActionTypes.API_RESPONSE_SUCCESS
    | SubStatusActionTypes.API_RESPONSE_ERROR
    | SubStatusActionTypes.GET_SUB_STATUS
    | SubStatusActionTypes.ADD_SUB_STATUS
    | SubStatusActionTypes.UPDATE_SUB_STATUS
    | SubStatusActionTypes.DELETE_SUB_STATUS;
    payload: {
        actionType?: string;
        data?: StatusData | {};
        error?: string;
    };
}

interface State {
    l?: StatusData | {};
    loading?: boolean;
    value?: boolean;
}

const SubStatus = (state: State = INIT_STATE, action: StatusActionType): any => {
    switch (action.type) {
        case SubStatusActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case SubStatusActionTypes.GET_SUB_STATUS: {

                    return {
                        ...state,
                        subStatus: action.payload.data,
                        loading: false,
                    };
                }

                case SubStatusActionTypes.ADD_SUB_STATUS: {
                    showSuccessAlert(action.payload.data);
                    return {
                        ...state,
                        loading: false,
                    };
                }
                case SubStatusActionTypes.UPDATE_SUB_STATUS: {
                    showSuccessAlert(action.payload.data);
                    return {
                        ...state,
                        loading: false,
                    };
                }
                case SubStatusActionTypes.DELETE_SUB_STATUS: {
                    showSuccessAlert(action.payload.data);
                    return {
                        ...state,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case SubStatusActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case SubStatusActionTypes.GET_SUB_STATUS: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                case SubStatusActionTypes.ADD_SUB_STATUS: {
                    showErrorAlert(action.payload.error);
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                case SubStatusActionTypes.UPDATE_SUB_STATUS: {
                    showErrorAlert(action.payload.error);
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                case SubStatusActionTypes.DELETE_SUB_STATUS: {
                    showErrorAlert(action.payload.error);
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                default:
                    return { ...state };
            }

        case SubStatusActionTypes.GET_SUB_STATUS:
            return { ...state, loading: true };
        case SubStatusActionTypes.ADD_SUB_STATUS:
            return { ...state, loading: true };
        case SubStatusActionTypes.UPDATE_SUB_STATUS:
            return { ...state, loading: true };
        default:
            return { ...state };
    }
};

export default SubStatus;
