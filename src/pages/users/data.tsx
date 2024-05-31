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
    text: "5",
    value: 5,
  },
];
export interface MyInitialState {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  updated_by: string;
  role_id: string;
  profile_image_path: string;
  branch_ids: string;
}

export const initialState = {
  id: "",
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: "",
  updated_by: "",
  role_id: "",
  branch_ids: "",
  profile_image_path: "",
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
  branch_ids: "",
};
