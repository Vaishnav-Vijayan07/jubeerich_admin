// constants
import { showSuccessAlert } from "../../constants";
import { KYCActionTypes } from "./constants";

const INIT_STATE = {
  KYCSPending: [],
  loading: false,
  initialloading: false,
  error: null,
  success: false,
  message: false,
};

interface CategoryData {
  id: number;
  name: string;
  description: string;
}

interface KYCActionType {
  type:
    | KYCActionTypes.API_RESPONSE_SUCCESS
    | KYCActionTypes.API_RESPONSE_ERROR
    | KYCActionTypes.GET_PENDING
    | KYCActionTypes.GET_APPLICATION_BY_USER
    | KYCActionTypes.GET_REJECTED
    | KYCActionTypes.ASSIGN_APPLICATION_MEMBER
    | KYCActionTypes.AUTO_ASSIGN_APPLICATION_MEMBER
    | KYCActionTypes.GET_APPROVED;
  payload: {
    actionType?: string;
    data?: any;
    error?: string;
  };
}

interface State {
  KYCSPending?: CategoryData | {};
  loading?: boolean;
  value?: boolean;
}

const KYC = (state: State = INIT_STATE, action: KYCActionType): any => {
  switch (action.type) {
    case KYCActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case KYCActionTypes.GET_PENDING: {
          return {
            ...state,
            KYCSPending: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_APPLICATION_BY_USER: {
          return {
            ...state,
            KYCSPending: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_REJECTED: {
          return {
            ...state,
            KYCSRejected: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_APPROVED: {
          return {
            ...state,
            KYCSApproved: action.payload.data,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.AUTO_ASSIGN_APPLICATION_MEMBER: {
          console.log("AUTO====>", action.payload.data);

          showSuccessAlert(action.payload.data.data);
          return {
            ...state,
          };
        }

        case KYCActionTypes.ASSIGN_APPLICATION_MEMBER: {
          console.log("ASSIGN====>", action.payload.data);

          showSuccessAlert(action.payload.data.data);
          return {
            ...state,
          };
        }

        default:
          return { ...state };
      }

    case KYCActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case KYCActionTypes.GET_PENDING: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_APPLICATION_BY_USER: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_REJECTED: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }

        case KYCActionTypes.GET_APPROVED: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }

        default:
          return { ...state };
      }

    case KYCActionTypes.GET_PENDING:
      return { ...state, loading: true, initialloading: true };
    case KYCActionTypes.GET_APPLICATION_BY_USER:
      return { ...state, loading: true, initialloading: true };
    case KYCActionTypes.GET_REJECTED:
      return { ...state, loading: true, initialloading: true };
    case KYCActionTypes.GET_APPROVED:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default KYC;
