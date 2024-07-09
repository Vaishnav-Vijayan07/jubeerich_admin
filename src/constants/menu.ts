export interface MenuItemTypes {
  key: string;
  label: string;
  isTitle?: boolean;
  icon?: string;
  url?: string;
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
    icon: "airplay",
    url: "/dashboard-4",
    roles: ["Monitor", "Add Lead", "View Task"],
  },

  // { key: "apps", label: "Apps", isTitle: true },

  // { key: "leads", label: "Leads Management", isTitle: true, roles: ["Add Lead", "View Task"] },

  // {
  //   key: "crm-leads_list",
  //   label: "Leads",
  //   isTitle: false,
  //   icon: "activity",
  //   url: "/leads/leads_list",
  //   roles: ["Add Lead", "View Task"],
  // },
  // {
  //   key: "crm-tasks",
  //   label: "Tasks",
  //   isTitle: false,
  //   icon: "book",
  //   url: "/leads/tasks",
  //   roles: ["View Task"],
  // },

  { key: "leads", label: "Leads", isTitle: true, roles: ["Add Lead", "View Task"] },

  {
    key: "leads",
    label: "Leads",
    isTitle: false,
    icon: "award",
    url: "/leads/manage",
    roles: ["Add Lead"],
  },

  {
    key: "tasks",
    label: "Tasks",
    isTitle: false,
    icon: "list",
    url: "/leads/tasks",
    roles: ["View Task"],
  },

  { key: "settings", label: "Settings", isTitle: true, roles: ["Monitor"] },

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
        key: "university",
        label: "University",
        url: "/settings/master/university",
        parentKey: "master",
      },
      {
        key: "programs",
        label: "Programs",
        url: "/settings/master/programs",
        parentKey: "master",
      },
      // {
      //   key: "campaign",
      //   label: "Campaign",
      //   url: "/settings/master/campaign",
      //   parentKey: "master",
      // },
      {
        key: "branches",
        label: "Branches",
        url: "/settings/master/branches",
        parentKey: "master",
      },
    ],
  },

  // { key: "status_management", label: "Status Management", isTitle: true, roles: ["Monitor"] },

  // {
  //   key: "status_management",
  //   label: "Status Management",
  //   isTitle: false,
  //   icon: "bar-chart-2",
  //   roles: ["Monitor"],
  //   children: [
  //     {
  //       key: "status",
  //       label: "Status",
  //       url: "/settings/master/status",
  //       parentKey: "status_management",
  //     },
  //     {
  //       key: "status_config",
  //       label: "Status Configuration",
  //       url: "/settings/master/status_config",
  //       parentKey: "status_management",
  //     },
  //     {
  //       key: "sub_status",
  //       label: "Sub Status",
  //       url: "/settings/master/sub_status",
  //       parentKey: "status_management",
  //     },
  //   ],
  // },
  // { key: "reports", label: "Reports", isTitle: true, roles: ["Add Lead", "View Task"] },

  // {
  //   key: "lead-reports",
  //   label: "Reports",
  //   isTitle: false,
  //   icon: "file-minus",
  //   url: "/reports",
  //   roles: ["Add Lead", "View Task"],
  // },

  {
    key: "user_management",
    label: "User Management",
    isTitle: true,
    roles: ["Monitor"],
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
