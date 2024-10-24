// constants
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
  type: KYCActionTypes.API_RESPONSE_SUCCESS | KYCActionTypes.API_RESPONSE_ERROR | KYCActionTypes.GET_PENDING;
  payload: {
    actionType?: string;
    data?: CategoryData | {};
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

        default:
          return { ...state };
      }

    case KYCActionTypes.GET_PENDING:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default KYC;
