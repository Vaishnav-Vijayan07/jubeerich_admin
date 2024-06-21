import { showErrorAlert, showSuccessAlert } from "../../constants";
import { OfficeTypesActionTypes } from "./constants";

const INIT_STATE = {
  officeTypes: [],
  officeById: null,
  loading: false,
  initialLoading: false,
  error: null,
};

interface OfficeData {
  id: string;
  office_type_name: string;
  office_type_description: string;
  updated_by: string;
}

interface OfficeTypesActionType {
  type:
    | OfficeTypesActionTypes.API_RESPONSE_SUCCESS
    | OfficeTypesActionTypes.API_RESPONSE_ERROR
    | OfficeTypesActionTypes.GET_OFFICE_TYPE
    | OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID
    | OfficeTypesActionTypes.ADD_OFFICE_TYPE
    | OfficeTypesActionTypes.UPDATE_OFFICE_TYPE
    | OfficeTypesActionTypes.DELETE_OFFICE_TYPE;
  payload: {
    actionType?: string;
    data?: OfficeData | {};
    error?: string;
  };
}

const OfficeTypes = (
  state: any = INIT_STATE,
  action: OfficeTypesActionType
) => {
  switch (action.type) {
    case OfficeTypesActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case OfficeTypesActionTypes.GET_OFFICE_TYPE: {
          return {
            ...state,
            officeTypes: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID: {
          return {
            ...state,
            officeById: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case OfficeTypesActionTypes.ADD_OFFICE_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case OfficeTypesActionTypes.UPDATE_OFFICE_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case OfficeTypesActionTypes.DELETE_OFFICE_TYPE: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case OfficeTypesActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case OfficeTypesActionTypes.GET_OFFICE_TYPE: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case OfficeTypesActionTypes.ADD_OFFICE_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case OfficeTypesActionTypes.UPDATE_OFFICE_TYPE: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case OfficeTypesActionTypes.DELETE_OFFICE_TYPE: {
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

    case OfficeTypesActionTypes.GET_OFFICE_TYPE:
      return { ...state, loading: true, initialLoading: true };
    case OfficeTypesActionTypes.GET_OFFICE_TYPE_BY_ID:
      return { ...state, loading: true, initialLoading: true };
    case OfficeTypesActionTypes.ADD_OFFICE_TYPE:
      return { ...state, loading: true };
    case OfficeTypesActionTypes.UPDATE_OFFICE_TYPE:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default OfficeTypes;
