import { new_lead_id } from "../../../../constants";

export const initialState = {
  id: null,
  name: "",
  email: "",
  phone: "",
  alternate_phone: "",
  enquiry: "",
  status: new_lead_id,
  category_id: null,
  company_name: "",
  source_id: null,
  channel_id: null,
  user_id: null,
  branch: "",
  proposal_no: null,
  proposal_amount: null,
  proposal: "",
  country: "",
  flag_id: null,
  lead_received_date: ""
};

export const initialValidationState = {
  name: "",
  email: "",
  phone: "",
  alternate_phone: "",
  enquiry: "",
  status: "",
  category_id: "",
  source_id: "",
  channel_id: "",
  branch: "",
  proposal_no: "",
  proposal_amount: "",
  proposal: "",
  company_name: "",
  country: "",
  user_id: "",
  flag_id: "",
  lead_received_date: "",
};

export interface OptionType {
  value: string;
  label: string;
}

// get pagelist to display
export const sizePerPageList = [
  {
    text: "10",
    value: 10,
  },
  {
    text: "25",
    value: 25,
  },
  {
    text: "50",
    value: 50,
  },
];
