export const countries = [
  { name: "United States", code: "US", isd: "+1" },
  { name: "Canada", code: "CA", isd: "+1" },
  { name: "United Kingdom", code: "GB", isd: "+44" },
  { name: "Germany", code: "DE", isd: "+49" },
  { name: "Italy", code: "IT", isd: "+39" },
  { name: "Moldova", code: "MD", isd: "+373" },
  { name: "Ireland", code: "IE", isd: "+353" },
  { name: "Australia", code: "AU", isd: "+61" },
  { name: "New Zealand", code: "NZ", isd: "+64" },
  { name: "France", code: "FR", isd: "+33" },
  { name: "Spain", code: "ES", isd: "+34" },
  { name: "Netherlands", code: "NL", isd: "+31" },
  { name: "Sweden", code: "SE", isd: "+46" },
  { name: "Norway", code: "NO", isd: "+47" },
  { name: "Denmark", code: "DK", isd: "+45" },
  { name: "Switzerland", code: "CH", isd: "+41" },
  { name: "Japan", code: "JP", isd: "+81" },
  { name: "South Korea", code: "KR", isd: "+82" },
  { name: "China", code: "CN", isd: "+86" },
  { name: "India", code: "IN", isd: "+91" },
];

export const examtypes = [
  { name: "IELTS" },
  { name: "OET" },
  { name: "PTE" },
  { name: "TOEFL" },
  { name: "Duolingo" },
  { name: "German" },
  { name: "Spoken English" },
  { name: "GRE" },
  { name: "GMAT" },
  { name: "SAT" },
  { name: "Others" },
];

export const city = [
  { name: "Kochi", value: "Kochi" },
  { name: "Ernakulam", value: "Ernakulam" },
];

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

export const initialState = {
  id: "",
  full_name: "",
  email: "",
  phone: "",
  category_id: null,
  source_id: null,
  channel_id: null,
  city: "",
  preferred_country: [],
  office_type: null,
  updated_by: null,
  remarks: "",
  lead_received_date: new Date().toISOString().split("T")[0],
  ielts: false,
  exam: "",
  zipcode: "",
  region_id: "",
  franchise_id: "",
  lead_type_id: "",
  branch_id: "",
  // flag: ""
  flag: []
};

export const initialValidationState = {
  full_name: "",
  email: "",
  phone: "",
  category_id: null,
  source_id: "",
  channel_id: "",
  city: "",
  preferred_country: "",
  office_type: "",
  updated_by: "",
  remarks: "",
  lead_received_date: "",
  ielts: true,
  zipcode: "",
  region_id: "",
  lead_type_id: "",
  flag: "",
  franchise_id: "",
};

export interface OptionType {
  value: string;
  label: string;
}

export interface TableRecords {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
  status: string;
}

export const approvalTypes = {
  import_lead: 'import_lead',
  assign_cre: 'assign_cre',
  assign_applications: 'assign_applications',
  delete_cre: 'delete_cre'
}

export const assignTypes = {
  CRE: 'CRE',
  Counsellor: 'Counsellor'
}