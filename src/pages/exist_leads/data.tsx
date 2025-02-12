export interface OptionType {
    value: string;
    label: string;
  }
  
  export interface TableRecords {
    id: string;
    branch_name: string;
    branch_address: string;
    branch_city: string;
    branch_country: string;
    currency: string;
    updated_by: string;
    profile_image_path: string;
    branch_ids: string;
  }
  
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
    {
      text: "100",
      value: 100,
    },
  ];
  export interface MyInitialState {
    country_id?: string | number | readonly string[] | undefined;
    id: string;
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string | null;
    updated_by: string;
    role_id: string;
    profile_image_path: string;
    branch_ids: string;
    region_id: string;
    branch_id?: string;
    country_ids?: string[];
    franchise_id?: string;
    status?: any
  }
  
  export const initialState = {
    id: "",
    full_name: "",
    email: "",
    phone: "",
    source_id: null,
    city: "",
    preferred_country: "",
    updated_by: null,
    remarks: "",
    lead_received_date: new Date().toISOString().split("T")[0],
    ielts: false,
    counsellor_id: ""
  };
  
  export const initialValidationState = {
    full_name: "",
    email: "",
    phone: "",
    source_id: "",
    city: "",
    preferred_country: "",
    updated_by: "",
    remarks: "",
    lead_received_date: "",
    ielts: true,
    counsellor_id: "",
  };