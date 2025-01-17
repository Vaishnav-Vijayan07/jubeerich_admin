// constants
import { DashboardCountriesActionTypes } from "./constants";

const INIT_STATE = {
  countries: [],
  loading: false,
  error: {},
};

const DashboardCountries = (state: any = INIT_STATE, action: any): any => {
  switch (action.type) {
    case DashboardCountriesActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES: {
          return {
            ...state,
            countries: action.payload.data,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case DashboardCountriesActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }

        default:
          return { ...state };
      }

    case DashboardCountriesActionTypes.GET_DASHBOARD_COUNTRIES:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default DashboardCountries;
