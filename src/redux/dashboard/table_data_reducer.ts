// constants

import { ApplicationManagerTableDataActionTypes } from "./constants";

const INIT_STATE = {
  applications: [],
  loading: false,
  error: {},
};

const ApplicationManagerData = (state: any = INIT_STATE, action: any): any => {
  switch (action.type) {
    case ApplicationManagerTableDataActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA: {
          return {
            ...state,
            applications: action.payload.data.data,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case ApplicationManagerTableDataActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA: {
          return {
            ...state,
            error: action.payload.error,
            loading: false,
          };
        }

        default:
          return { ...state };
      }

    case ApplicationManagerTableDataActionTypes.GET_APPLICATION_MANAGER_TABLE_DATA:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default ApplicationManagerData;
