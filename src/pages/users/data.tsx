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
  country_id: string | number | readonly string[] | undefined;
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
  region_id: string,
  branch_id?: string,
  country_ids?: string
  franchise_id?: string
}

export const initialState = {
  id: "",
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: null,
  updated_by: "",
  role_id: "",
  country_id: undefined,
  branch_ids: "",
  profile_image_path: "",
  region_id: "",
  franchise_id: ""
};

export const initialValidationState = {
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  role_id: "",
  country_id: "",
  branch_ids: "",
  region_id: "",
  branch_id: "",
  franchise_id: ""
};
