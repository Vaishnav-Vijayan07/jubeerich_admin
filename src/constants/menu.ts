export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  only?: any;
  roles?: Array<string>;
  badge?: {
    variant: string;
    text: string;
  };
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
}

const MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "home",
    label: "Home",
    isTitle: true,
    roles: ["Monitor", "Add Lead", "View Task"],
  },
  {
    key: "dashboard",
    label: "Dashboard",
    isTitle: false,
    icon: "grid", // Dashboard grid view
    url: "/dashboard-4",
    roles: ["Monitor", "Add Lead", "View Task", "Manage Franchise", "Manage Applications", "Allocate Applications"],
  },

  { key: "leads", label: "Leads", isTitle: true, roles: ["Add Lead", "View Task"] },

  {
    key: "leads",
    label: "Leads",
    isTitle: false,
    icon: "users", // Represents group of leads
    url: "/leads/manage",
    roles: ["Add Lead"],
  },
  {
    key: "assinged_leads",
    label: "Assigned Leads",
    isTitle: false,
    icon: "user-check", // Assigned specific leads
    url: "/leads/assigned/manage",
    roles: ["Assigned Leads"],
  },
  {
    key: "leads",
    label: "Assigned Leads",
    isTitle: false,
    icon: "user-tag", // Lead assigned to a manager
    url: "/leads/assigned_regional_manager",
    roles: ["Manage Branch"],
  },
  {
    key: "tasks",
    label: "Tasks",
    isTitle: false,
    icon: "list", // Tasks list
    url: "/leads/tasks",
    roles: ["View Task"],
  },
  {
    key: "ordinary_tasks",
    label: "Todo",
    isTitle: false,
    icon: "check-square", // Represents a to-do task in progress or completion
    url: "/leads/ordinary_tasks",
    roles: ["View Task"],
  },

  { key: "kyc_details", label: "KYC Approval", isTitle: true, roles: ["KYC Approval"] },

  {
    key: "kycApproval",
    label: "KYC Pending",
    isTitle: false,
    icon: "clock", // Icon representing pending action
    url: "/kyc_details",
    roles: ["KYC Approval"],
  },

  {
    key: "kycRejected",
    label: "KYC Rejected",
    isTitle: false,
    icon: "x-circle", // Cross icon for rejection
    url: "/kyc_rejected_details",
    roles: ["KYC Approval"],
  },

  {
    key: "kycApproved",
    label: "KYC Approved",
    isTitle: false,
    icon: "check-circle", // Check icon for approval
    url: "/kyc_approved_details",
    roles: ["KYC Approval"],
  },

  { key: "all_applications", label: "All Applications", isTitle: true, roles: ["Allocate Applications"] },

  {
    key: "pending",
    label: "Pending",
    isTitle: false,
    icon: "clock", // Icon for applications still in progress or awaiting action
    url: "/kyc_details/all/pending",
    roles: ["Allocate Applications"],
  },
  {
    key: "assigned",
    label: "Assigned",
    isTitle: false,
    icon: "user-check", // Icon indicating assignment to a user
    url: "/kyc_details/all/assigned",
    roles: ["Allocate Applications"],
  },

  { key: "my_applications", label: "My Applications", isTitle: true, roles: ["Manage Applications", "Allocate Applications"] },

  {
    key: "pending",
    label: "Pending",
    isTitle: false,
    icon: "clock", // Icon for applications awaiting review
    url: "/kyc_details/applications/pending",
    roles: ["Manage Applications", "Allocate Applications"],
  },

  {
    key: "submitted",
    label: "Submitted",
    isTitle: false,
    icon: "send", // Icon representing submission, as an action taken
    url: "/kyc_details/applications/submitted",
    roles: ["Manage Applications", "Allocate Applications"],
  },

  {
    key: "offer_accepted",
    label: "Offer Accepted",
    isTitle: false,
    icon: "thumbs-up", // Icon indicating offer acceptance or a positive status
    url: "/kyc_details/applications/offer_accepted",
    roles: ["Manage Applications", "Allocate Applications"],
  },

  { key: "settings", label: "Settings", isTitle: true, roles: ["Monitor"] },

  {
    key: "master",
    label: "Master",
    isTitle: false,
    icon: "settings", // Master settings
    roles: ["Monitor"],
    children: [
      {
        key: "category",
        label: "Lead Type",
        url: "/settings/master/type",
        parentKey: "master",
      },
      {
        key: "task_prefix",
        label: "Task Prefix",
        url: "/settings/master/task_prefix",
        parentKey: "master",
      },
      {
        key: "Source",
        label: "Lead Source",
        url: "/settings/master/source",
        parentKey: "master",
      },
      {
        key: "channel",
        label: "Lead Channel",
        url: "/settings/master/channel",
        parentKey: "master",
      },
      {
        key: "office_type",
        label: "Office Type",
        url: "/settings/master/office_type",
        parentKey: "master",
      },
      {
        key: "region",
        label: "Region",
        url: "/settings/master/region",
        parentKey: "master",
      },
      {
        key: "flag",
        label: "Flag",
        url: "/settings/master/flag",
        parentKey: "master",
      },
      {
        key: "marital_status",
        label: "Marital Status",
        url: "/settings/master/marital_status",
        parentKey: "master",
      },
      {
        key: "country",
        label: "Country",
        url: "/settings/master/country",
        parentKey: "master",
      },
      {
        key: "branches",
        label: "Branches",
        url: "/settings/master/branches",
        parentKey: "master",
      },
      {
        key: "franchisees",
        label: "Franchisees",
        url: "/settings/master/franchise",
        parentKey: "master",
      },
    ],
  },

  {
    key: "academic_management",
    label: "Academic Setup",
    isTitle: false,
    icon: "award", // Academic or learning icon
    roles: ["Monitor"],
    children: [
      {
        key: "course_type",
        label: "Course Type",
        url: "/settings/master/course_type",
        parentKey: "master",
      },
      {
        key: "stream",
        label: "Stream",
        url: "/settings/master/stream",
        parentKey: "master",
      },
      {
        key: "course",
        label: "Course",
        url: "/settings/master/course",
        parentKey: "master",
      },
      {
        key: "university",
        label: "University",
        url: "/settings/master/university",
        parentKey: "master",
      },
      {
        key: "campus",
        label: "Campus",
        url: "/settings/master/campus",
        parentKey: "master",
      },
    ],
  },

  { key: "status_management", label: "Status Management", isTitle: true, roles: ["Monitor"] },

  {
    key: "status",
    label: "Status",
    isTitle: false,
    icon: "activity", // Status activity or progress
    url: "/settings/master/status",
    roles: ["Monitor"],
  },
  {
    key: "status_config",
    label: "Status Config",
    isTitle: false,
    icon: "tool", // Configuration tool
    url: "/settings/master/status_config",
    roles: ["Monitor"],
  },

  {
    key: "user_management",
    label: "User Management",
    isTitle: true,
    roles: ["Monitor", "Manage Franchise"],
  },

  {
    key: "roles",
    label: "Access Roles",
    isTitle: false,
    icon: "key", // Key for roles and access
    url: "/user_management/access_roles",
    roles: ["Monitor"],
  },
  {
    key: "user_creation",
    label: "User Creation",
    url: "/user_management/user_creation",
    isTitle: false,
    icon: "user-plus", // User creation/addition
    roles: ["Monitor"],
  },
  {
    key: "counsellor_creation",
    label: "Counsellor Creation",
    url: "/user_management/counsellor_creation",
    isTitle: false,
    icon: "user-tie", // Counsellor-specific creation
    roles: ["Manage Franchise"],
  },
];

// const MENU_ITEMS: MenuItemTypes[] = [
//   {
//     key: "home",
//     label: "Home",
//     isTitle: true,
//     roles: ["Monitor", "Add Lead", "View Task"],
//   },
//   {
//     key: "dashboard",
//     label: "Dashboard",
//     isTitle: false,
//     icon: "airplay",
//     url: "/dashboard-4",
//     roles: ["Monitor", "Add Lead", "View Task", "Manage Franchise", "Manage Applications"],
//   },

//   { key: "leads", label: "Leads", isTitle: true, roles: ["Add Lead", "View Task"] },

//   {
//     key: "leads",
//     label: "Leads",
//     isTitle: false,
//     icon: "monitor",
//     url: "/leads/manage",
//     roles: ["Add Lead"],
//   },
//   {
//     key: "assinged_leads",
//     label: "Assigned Leads",
//     isTitle: false,
//     icon: "monitor",
//     url: "/leads/assigned/manage",
//     roles: ["Assigned Leads"],
//   },

//   {
//     key: "leads",
//     label: "Assigned Leads",
//     isTitle: false,
//     icon: "monitor",
//     url: "/leads/assigned_regional_manager",
//     roles: ["Manage Branch"],
//   },

//   {
//     key: "tasks",
//     label: "Tasks",
//     isTitle: false,
//     icon: "list",
//     url: "/leads/tasks",
//     roles: ["View Task"],
//   },
//   {
//     key: "ordinary_tasks",
//     label: "Todo",
//     isTitle: false,
//     icon: "pen-tool",
//     url: "/leads/ordinary_tasks",
//     roles: ["View Task"],
//   },

//   { key: "kyc_details", label: "KYC Approval", isTitle: true, roles: ["KYC Approval"] },

//   {
//     key: "kycApproval",
//     label: "KYC Approval",
//     isTitle: false,
//     icon: "check-square",
//     url: "/kyc_details",
//     roles: ["KYC Approval"],
//   },

//   { key: "all_applications", label: "All Applications", isTitle: true, roles: ["Manage Applications"], },

//   {
//     key: "pending",
//     label: "Pending",
//     isTitle: false,
//     icon: "file-text",
//     url: "/kyc_details",
//     roles: ["Manage Applications"],
//   },
//   {
//     key: "assigned",
//     label: "Assigned",
//     isTitle: false,
//     icon: "file",
//     url: "/kyc_details",
//     roles: ["Manage Applications"],
//   },

//   { key: "my_applications", label: "My Applications", isTitle: true, roles: ["Manage Applications"], },

//   {
//     key: "pending",
//     label: "Pending",
//     isTitle: false,
//     icon: "file-text",
//     url: "/kyc_details/pending",
//     roles: ["Manage Applications"],
//   },
//   {
//     key: "submitted",
//     label: "Submitted",
//     isTitle: false,
//     icon: "file",
//     url: "/kyc_details/applications/submitted",
//     roles: ["Manage Applications"],
//   },
//   {
//     key: "offer_accepted",
//     label: "Offer Accepted",
//     isTitle: false,
//     icon: "file-plus",
//     url: "/kyc_details/applications/offer_accepted",
//     roles: ["Manage Applications"],
//   },

//   { key: "settings", label: "Settings", isTitle: true, roles: ["Monitor"] },

//   {
//     key: "master",
//     label: "Master",
//     isTitle: false,
//     icon: "settings",
//     roles: ["Monitor"],
//     children: [
//       {
//         key: "category",
//         label: "Lead Type",
//         url: "/settings/master/type",
//         parentKey: "master",
//       },
//       {
//         key: "Source",
//         label: "Lead Source",
//         url: "/settings/master/source",
//         parentKey: "master",
//       },
//       {
//         key: "channel",
//         label: "Lead Channel",
//         url: "/settings/master/channel",
//         parentKey: "master",
//       },
//       {
//         key: "office_type",
//         label: "Office Type",
//         url: "/settings/master/office_type",
//         parentKey: "master",
//       },
//       {
//         key: "region",
//         label: "Region",
//         url: "/settings/master/region",
//         parentKey: "master",
//       },
//       {
//         key: "flag",
//         label: "Flag",
//         url: "/settings/master/flag",
//         parentKey: "master",
//       },
//       {
//         key: "marital_status",
//         label: "Marital Status",
//         url: "/settings/master/marital_status",
//         parentKey: "master",
//       },
//       {
//         key: "country",
//         label: "Country",
//         url: "/settings/master/country",
//         parentKey: "master",
//       },
//       {
//         key: "branches",
//         label: "Branches",
//         url: "/settings/master/branches",
//         parentKey: "master",
//       },
//       {
//         key: "franchisees",
//         label: "Franchisees",
//         url: "/settings/master/franchise",
//         parentKey: "master",
//       },
//     ],
//   },

//   {
//     key: "academic_management",
//     label: "Academic Setup",
//     isTitle: false,
//     icon: "award",
//     roles: ["Monitor"],
//     children: [
//       {
//         key: "course_type",
//         label: "Course Type",
//         url: "/settings/master/course_type",
//         parentKey: "master",
//       },
//       {
//         key: "stream",
//         label: "Stream",
//         url: "/settings/master/stream",
//         parentKey: "master",
//       },
//       {
//         key: "course",
//         label: "Course",
//         url: "/settings/master/course",
//         parentKey: "master",
//       },
//       {
//         key: "university",
//         label: "University",
//         url: "/settings/master/university",
//         parentKey: "master",
//       },
//       {
//         key: "campus",
//         label: "Campus",
//         url: "/settings/master/campus",
//         parentKey: "master",
//       },
//     ],
//   },

//   { key: "status_management", label: "Status Management", isTitle: true, roles: ["Monitor"] },

//   {
//     key: "status",
//     label: "Status",
//     isTitle: false,
//     icon: "bar-chart-2",
//     url: "/settings/master/status",
//     roles: ["Monitor"],
//   },
//   {
//     key: "status_config",
//     label: "Status Config",
//     isTitle: false,
//     icon: "file-text",
//     url: "/settings/master/status_config",
//     roles: ["Monitor"],
//   },

//   {
//     key: "user_management",
//     label: "User Management",
//     isTitle: true,
//     roles: ["Monitor", "Manage Franchise"],
//   },

//   {
//     key: "roles",
//     label: "Access Roles",
//     isTitle: false,
//     icon: "user",
//     url: "/user_management/access_roles",
//     roles: ["Monitor"],
//   },
//   {
//     key: "user_creation",
//     label: "User Creation",
//     url: "/user_management/user_creation",
//     isTitle: false,
//     icon: "users",
//     roles: ["Monitor"],
//   },
//   {
//     key: "counsellor_creation",
//     label: "Counsellor Creation",
//     url: "/user_management/counsellor_creation",
//     isTitle: false,
//     icon: "users",
//     roles: ["Manage Franchise"],
//   },
// ];

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "dashboard",
    icon: "home",
    label: "Home",
    isTitle: true,
    roles: ["Monitor", "Add Lead", "View Task"],
    children: [
      {
        key: "ds-dashboard-4",
        label: "Dashboard",
        url: "/dashboard-4",
        parentKey: "dashboard",
      },
    ],
  },
  {
    key: "leads",
    label: "Leads",
    isTitle: false,
    icon: "activity",
    roles: ["Add Lead"],
    children: [
      {
        key: "crm-leads_list",
        label: "Lead List",
        parentKey: "leads",
        url: "/leads/leads_list",
      },
      {
        key: "crm-tasks",
        label: "Tasks",
        parentKey: "leads",
        url: "/leads/tasks",
      },
    ],
  },
  {
    key: "master",
    label: "Master",
    isTitle: false,
    icon: "settings",
    roles: ["Monitor"],
    children: [
      {
        key: "category",
        label: "Category",
        url: "/settings/master/category",
        parentKey: "master",
      },
      {
        key: "Source",
        label: "Source",
        url: "/settings/master/source",
        parentKey: "master",
      },
      {
        key: "channel",
        label: "Channel",
        url: "/settings/master/channel",
        parentKey: "master",
      },
      {
        key: "campaign",
        label: "Campaign",
        url: "/settings/master/campaign",
        parentKey: "master",
      },
      {
        key: "branches",
        label: "Branches",
        url: "/settings/master/branches",
        parentKey: "master",
      },
      {
        key: "status",
        label: "Status",
        url: "/settings/master/status",
        parentKey: "master",
      },
      {
        key: "status_config",
        label: "Status Configuration",
        url: "/settings/master/status_config",
        parentKey: "master",
      },
      {
        key: "sub_status",
        label: "Sub Status",
        url: "/settings/master/sub_status",
        parentKey: "master",
      },
    ],
  },

  {
    key: "user_management",
    label: "User Management",
    isTitle: false,
    icon: "user",
    roles: ["Monitor"],
    children: [
      {
        key: "roles",
        label: "Access Roles",
        url: "/user_management/access_roles",
        parentKey: "user_management",
      },
      {
        key: "user_creation",
        label: "User Creation",
        url: "/user_management/user_creation",
        parentKey: "user_management",
      },
    ],
  },
];

const TWO_COl_MENU_ITEMS: MenuItemTypes[] = [
  {
    key: "dashboard",
    icon: "home",
    label: "Home",
    isTitle: true,
    roles: ["Monitor", "Add Lead", "View Task", "Allocate Applications"],
    children: [
      {
        key: "ds-dashboard-4",
        label: "Dashboard",
        url: "/dashboard-4",
        parentKey: "dashboard",
      },
    ],
  },
  {
    key: "leads",
    label: "Leads",
    isTitle: true,
    icon: "activity",
    roles: ["Add Lead"],
    children: [
      {
        key: "crm-leads_list",
        label: "Lead List",
        parentKey: "leads",
        url: "/leads/leads_list",
      },
      {
        key: "crm-tasks",
        label: "Tasks",
        parentKey: "leads",
        url: "/leads/tasks",
      },
    ],
  },
  {
    key: "master",
    label: "Master",
    isTitle: true,
    icon: "settings",
    roles: ["Monitor"],
    children: [
      {
        key: "category",
        label: "Category",
        url: "/settings/master/category",
        parentKey: "master",
      },
      {
        key: "Source",
        label: "Source",
        url: "/settings/master/source",
        parentKey: "master",
      },
      {
        key: "channel",
        label: "Channel",
        url: "/settings/master/channel",
        parentKey: "master",
      },
      {
        key: "campaign",
        label: "Campaign",
        url: "/settings/master/campaign",
        parentKey: "master",
      },
      {
        key: "branches",
        label: "Branches",
        url: "/settings/master/branches",
        parentKey: "master",
      },
      {
        key: "status",
        label: "Status",
        url: "/settings/master/status",
        parentKey: "master",
      },
      {
        key: "status_config",
        label: "Status Configuration",
        url: "/settings/master/status_config",
        parentKey: "master",
      },
      {
        key: "sub_status",
        label: "Sub Status",
        url: "/settings/master/sub_status",
        parentKey: "master",
      },
    ],
  },

  {
    key: "user_management",
    label: "User Management",
    isTitle: true,
    icon: "user",
    roles: ["Monitor"],
    children: [
      {
        key: "roles",
        label: "Access Roles",
        url: "/user_management/access_roles",
        parentKey: "user_management",
      },
      {
        key: "user_creation",
        label: "User Creation",
        url: "/user_management/user_creation",
        parentKey: "user_management",
      },
    ],
  },
];

export { MENU_ITEMS, TWO_COl_MENU_ITEMS, HORIZONTAL_MENU_ITEMS };
