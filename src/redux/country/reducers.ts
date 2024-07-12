import { showErrorAlert, showSuccessAlert } from "../../constants";
import { CountryActionTypes } from "./constants";

const INIT_STATE = {
  countries: [],
  countryById: null,
  loading: false,
  initialLoading: false,
  error: null,
};

interface CountryData {
  id: string;
  country_name: string;
}

interface CountryActionType {
  type:
    | CountryActionTypes.API_RESPONSE_SUCCESS
    | CountryActionTypes.API_RESPONSE_ERROR
    | CountryActionTypes.GET_COUNTRY
    | CountryActionTypes.GET_COUNTRY_BY_ID
    | CountryActionTypes.ADD_COUNTRY
    | CountryActionTypes.UPDATE_COUNTRY
    | CountryActionTypes.DELETE_COUNTRY;
  payload: {
    actionType?: string;
    data?: CountryData | {};
    error?: string;
  };
}

const Country = (state: any = INIT_STATE, action: CountryActionType) => {
  switch (action.type) {
    case CountryActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case CountryActionTypes.GET_COUNTRY: {
          return {
            ...state,
            countries: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case CountryActionTypes.GET_COUNTRY_BY_ID: {
          return {
            ...state,
            countryById: action.payload.data,
            loading: false,
            initialLoading: false,
          };
        }

        case CountryActionTypes.ADD_COUNTRY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case CountryActionTypes.UPDATE_COUNTRY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case CountryActionTypes.DELETE_COUNTRY: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case CountryActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case CountryActionTypes.GET_COUNTRY: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case CountryActionTypes.GET_COUNTRY_BY_ID: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialLoading: false,
          };
        }
        case CountryActionTypes.ADD_COUNTRY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case CountryActionTypes.UPDATE_COUNTRY: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }
        case CountryActionTypes.DELETE_COUNTRY: {
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

    case CountryActionTypes.GET_COUNTRY:
      return { ...state, loading: true, initialLoading: true };
    case CountryActionTypes.GET_COUNTRY_BY_ID:
      return { ...state, loading: true, initialLoading: true };
    case CountryActionTypes.ADD_COUNTRY:
      return { ...state, loading: true };
    case CountryActionTypes.DELETE_COUNTRY:
      return { ...state, loading: true };
    case CountryActionTypes.UPDATE_COUNTRY:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Country;
