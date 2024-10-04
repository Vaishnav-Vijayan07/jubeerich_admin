// apicore
import { DropDownActionTypes } from "./constants";

const INIT_STATE = {
  data: {
    universities: [],
    countries: [],
    courses: [],
    courseTypes: [],
    streams: [],
    campuses: [],
    sources: [],
    leadTypes: [],
    channels: [],
    officeTypes: [],
    regions: [],
    adminUsers: [],
    statuses: [],
    cres: [],
    franchises: [],
    branchCounsellors: [],
    maritalStatus: [],
    accessPowers: [],
    accessRoles: [],
    branches: [],
  },
  loading: false,
  initialloading: false,
  error: null,
};

interface DropDownData {
  label: string;
  value: number | string; // Depending on whether `item.id` is a number or string
  lead_type: number | string; // Adjust according to actual type of `lead_type_id`
  source_id: number | string; // Adjust according to actual type of `source_id`
  branch_id: number | string;
}

interface CategoryActionType {
  type:
    | DropDownActionTypes.API_RESPONSE_SUCCESS
    | DropDownActionTypes.API_RESPONSE_ERROR
    | DropDownActionTypes.GET_DROP_DOWN;
  payload: {
    actionType?: string;
    data?: any;
    error?: string;
  };
}

interface State {
  category?: DropDownData | {};
  loading?: boolean;
  value?: boolean;
}

const DropDownReducer = (
  state: State = INIT_STATE,
  action: CategoryActionType
): any => {
  switch (action.type) {
    case DropDownActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case DropDownActionTypes.GET_DROP_DOWN: {
          return {
            ...state,
            data: action.payload.data.data,
            loading: false,
            initialloading: false,
          };
        }
        default:
          return { ...state };
      }

    case DropDownActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case DropDownActionTypes.GET_DROP_DOWN: {
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

    case DropDownActionTypes.GET_DROP_DOWN:
      return { ...state, loading: true, initialloading: true };
    default:
      return { ...state };
  }
};

export default DropDownReducer;
