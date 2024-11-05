// apicore
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { APICore } from "../../helpers/api/apiCore";

// constants
import { LeadsActionTypes } from "./constants";

const INIT_STATE = {
  leads: [],
  assignedLeads: [],
  allCres: [],
  initialloading: false,
  loading: false,
  error: null,
};

interface LeadsData {
  id: string;
  name: string;
  email: string;
  phone: string;
  enquiry: string;
  status: string;
  category_id: string;
  lead_type_id: string;
  source_id: string;
  channel_id: string;
  user_id: string;
  branch: string;
  proposal_no: string;
  proposal_amount: string;
  proposal: string;
  company_name: string;
  country: string;
  branch_id: string;
  flag_id: string;
}

export interface LeadsActionType {
  type:
  | LeadsActionTypes.API_RESPONSE_SUCCESS
  | LeadsActionTypes.API_RESPONSE_ERROR
  | LeadsActionTypes.GET_LEADS
  | LeadsActionTypes.GET_LEADS_TL
  | LeadsActionTypes.GET_LEADS_ASSIGNED
  | LeadsActionTypes.GET_LEAD_USER
  | LeadsActionTypes.ADD_LEADS
  | LeadsActionTypes.UPDATE_LEADS
  | LeadsActionTypes.DELETE_LEADS
  | LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL
  | LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER
  | LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL;
  payload: {
    actionType?: string;
    data?: any;
    error?: string;
  };
}

interface State {
  l?: LeadsData | {};
  loading?: boolean;
  value?: boolean;
}

const Leads = (state: any = INIT_STATE, action: LeadsActionType): any => {
  switch (action.type) {
    case LeadsActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case LeadsActionTypes.GET_LEADS: {
          return {
            ...state,
            leads: action.payload.data.data.formattedUserPrimaryInfos,
            allCres: action.payload.data.data.allCres,
            loading: false,
            initialloading: false,
          };
        }


        case LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER: {
          return {
            ...state,
            leads: action.payload.data.data.formattedUserPrimaryInfos,
            allCres: action.payload.data.data.allCres,
            loading: false,
            initialloading: false,
          };
        }

        case LeadsActionTypes.GET_LEADS_TL: {
          return {
            ...state,
            leads: action.payload.data.data.formattedUserPrimaryInfos,
            allCres: action.payload.data.data.allCres,
            loading: false,
            initialloading: false,
          };
        }

        case LeadsActionTypes.GET_LEADS_ASSIGNED: {
          return {
            ...state,
            assignedLeads: action.payload.data.data.formattedUserPrimaryInfos,
            allCres: action.payload.data.data.allCres,
            loading: false,
            initialloading: false,
          };
        }

        case LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL: {
          return {
            ...state,
            assignedLeads: action.payload.data.data.formattedUserPrimaryInfos,
            allCounsellorTLs: action.payload.data.data.allCounsellorTLs,
            loading: false,
            initialloading: false,
          };
        }

        case LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL: {
          return {
            ...state,
            leads: action.payload.data.data.formattedUserPrimaryInfos,
            allCounsellorTLs: action.payload.data.data.allCounsellorTLs,
            loading: false,
            initialloading: false,
          };
        }

        case LeadsActionTypes.GET_LEAD_USER: {
          return {
            ...state,
            leads: action.payload.data,
            loading: false,
          };
        }

        case LeadsActionTypes.ADD_LEADS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case LeadsActionTypes.UPDATE_LEADS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        case LeadsActionTypes.DELETE_LEADS: {
          showSuccessAlert(action.payload.data);
          return {
            ...state,
            loading: false,
          };
        }
        default:
          return { ...state };
      }

    case LeadsActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case LeadsActionTypes.GET_LEADS: {
          return {
            ...state,
            leads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER: {
          return {
            ...state,
            leads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.GET_LEADS_TL: {
          return {
            ...state,
            leads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.GET_LEADS_ASSIGNED: {
          return {
            ...state,
            assignedLeads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL: {
          return {
            ...state,
            assignedLeads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL: {
          return {
            ...state,
            assignedLeads: [],
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.ADD_LEADS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.UPDATE_LEADS: {
          showErrorAlert(action.payload.error);
          return {
            ...state,
            error: action.payload.error,
            loading: false,
            initialloading: false,
          };
        }
        case LeadsActionTypes.DELETE_LEADS: {
          showErrorAlert(action.payload.error);
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

    case LeadsActionTypes.GET_LEADS:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.GET_LEADS_REGIONAL_MANAGER:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.GET_LEADS_TL:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.GET_LEADS_ASSIGNED:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.GET_LEADS_ASSIGNED_BY_COUNSELLOR_TL:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.GET_LEADS_BY_COUNSELLOR_TL:
      return { ...state, loading: true, initialloading: true, error: null };
    case LeadsActionTypes.ADD_LEADS:
      return { ...state, loading: true };
    case LeadsActionTypes.UPDATE_LEADS:
      return { ...state, loading: true };
    default:
      return { ...state };
  }
};

export default Leads;
