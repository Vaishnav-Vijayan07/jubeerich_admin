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
  employee_id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  username: "",
  password: null,
  updated_by: "",
  role_id: "",
  country_ids: [],
  branch_ids: "",
  profile_image_path: "",
  region_id: "",
  franchise_id: "",
  status: null
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
  franchise_id: "",
  country_ids: []
};

export const dummyLeadData = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    city: "New York",
    preferredCountries: "USA, Canada",
    office_type_name: "Corporate",
    source_name: "Online Campaign",
    lead_received_date: "2024-12-01",
    stage: "Sales",
    status: "Active",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane.smith@example.com",
    city: "Los Angeles",
    preferredCountries: "USA, UK",
    office_type_name: "Regional",
    source_name: "Referral",
    lead_received_date: "2024-11-28",
    stage: "Marketing",
    status: "Pending",
  },
  {
    id: 3,
    full_name: "Carlos Rivera",
    email: "carlos.rivera@example.com",
    city: "Madrid",
    preferredCountries: "Spain, Mexico",
    office_type_name: "Corporate",
    source_name: "Social Media",
    lead_received_date: "2024-12-03",
    stage: "Support",
    status: "Completed",
  },
  {
    id: 4,
    full_name: "Maria Gonzalez",
    email: "maria.gonzalez@example.com",
    city: "Barcelona",
    preferredCountries: "Italy, Spain",
    office_type_name: "Local",
    source_name: "Online Campaign",
    lead_received_date: "2024-11-25",
    stage: "Marketing",
    status: "Active",
  },
  {
    id: 5,
    full_name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    city: "Dubai",
    preferredCountries: "UAE, Qatar",
    office_type_name: "Corporate",
    source_name: "Trade Show",
    lead_received_date: "2024-12-05",
    stage: "Sales",
    status: "Pending",
  },
  {
    id: 6,
    full_name: "Li Wei",
    email: "li.wei@example.com",
    city: "Shanghai",
    preferredCountries: "China, Japan",
    office_type_name: "Regional",
    source_name: "Email Marketing",
    lead_received_date: "2024-11-20",
    stage: "Sales",
    status: "Inactive",
  },
  {
    id: 7,
    full_name: "Emily Davis",
    email: "emily.davis@example.com",
    city: "London",
    preferredCountries: "UK, Germany",
    office_type_name: "Local",
    source_name: "Referral",
    lead_received_date: "2024-12-02",
    stage: "Support",
    status: "Active",
  },
];
