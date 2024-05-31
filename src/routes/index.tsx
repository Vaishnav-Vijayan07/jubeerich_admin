import React from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";
// import Root from './Root';

// lazy load all the views

// auth2
const Login2 = React.lazy(() => import("../pages/auth2/Login2"));
const Logout2 = React.lazy(() => import("../pages/auth2/Logout2"));
const Register2 = React.lazy(() => import("../pages/auth2/Register2"));
const Confirm2 = React.lazy(() => import("../pages/auth2/Confirm2"));
const ForgetPassword2 = React.lazy(
  () => import("../pages/auth2/ForgetPassword2")
);
const LockScreen2 = React.lazy(() => import("../pages/auth2/LockScreen2"));
const SignInSignUp2 = React.lazy(() => import("../pages/auth2/SignInSignUp2"));

// dashboard
const Dashboard4 = React.lazy(() => import("../pages/dashboard/Dashboard4/"));

// - crm pages

const CRMLeads = React.lazy(() => import("../pages/apps/CRM/Leads/"));

//Leads
const CRMLeadsList = React.lazy(
  () => import("../pages/lead_management/Tickets/List")
);
const Tasks = React.lazy(() => import("../pages/lead_management/Tasks/List"));

// uikit

const NestableList = React.lazy(() => import("../pages/uikit/NestableList"));
const DragDrop = React.lazy(() => import("../pages/uikit/DragDrop"));
const RangeSliders = React.lazy(() => import("../pages/uikit/RangeSliders"));
const Animation = React.lazy(() => import("../pages/uikit/Animation"));
const TourPage = React.lazy(() => import("../pages/uikit/TourPage"));
const SweetAlerts = React.lazy(() => import("../pages/uikit/SweetAlerts"));
const LoadingButtons = React.lazy(
  () => import("../pages/uikit/LoadingButtons")
);

// forms
const Category = React.lazy(() => import("../pages/forms/Category"));
const Source = React.lazy(() => import("../pages/forms/Source"));
const Channel = React.lazy(() => import("../pages/forms/Channel"));
const Campaign = React.lazy(() => import("../pages/forms/Campaign"));
const OfficeType = React.lazy(() => import("../pages/forms/OfficeType"));
const Region = React.lazy(() => import("../pages/forms/Region"));
const Flag = React.lazy(() => import("../pages/forms/Flag"));
const MaritalStatus = React.lazy(() => import("../pages/forms/MaritalStatus"));
const Country = React.lazy(() => import("../pages/forms/Country"));
const Branches = React.lazy(() => import("../pages/forms/Branches"));
const Status = React.lazy(() => import("../pages/status/Status"));
const StatusConfig = React.lazy(
  () => import("../pages/status/StatusConfiguration")
);
const SubStatus = React.lazy(() => import("../pages/status/SubStatus"));
const CheckLists = React.lazy(() => import("../pages/forms/CheckLists"));

// users
const AccessRoles = React.lazy(() => import("../pages/users/AccessRoles"));
const AdminUsers = React.lazy(() => import("../pages/users/AdminUsers"));
// tables
const BasicTables = React.lazy(() => import("../pages/tables/Basic"));
const AdvancedTables = React.lazy(() => import("../pages/tables/Advanced"));
const ForbiddenPage = React.lazy(() => import("../pages/errors/ForbiddenPage"));

const ReportsPage = React.lazy(() => import("../pages/reports"));

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

const dashboardRoutes: RoutesProps = {
  path: "/dashboard",
  name: "Dashboards",
  icon: "airplay",
  header: "Navigation",
  children: [
    {
      path: "/",
      name: "Root",
      element: <Navigate to="/dashboard-4" />,
      route: PrivateRoute,
    },
    {
      path: "/dashboard-4",
      name: "Dashboard 4",
      // element: <Dashboard4 />,
      element: (
        <PrivateRoute
          roles={["Add Leads", "View Task", "Monitor"]}
          component={Dashboard4}
        />
      ),
      route: PrivateRoute,
    },
  ],
};

const crmAppRoutes = {
  path: "/apps/crm",
  name: "CRM",
  route: PrivateRoute,
  roles: ["Add Leads", "View Task"],
  icon: "users",
  children: [
    {
      path: "/apps/crm/leads",
      name: "Leads",
      element: <CRMLeads />,
      route: PrivateRoute,
    },
  ],
};

const reportsRoutes = {
  path: "/",
  name: "CRM",
  route: PrivateRoute,
  roles: ["Add Leads", "View Task"],
  icon: "file-minus",
  children: [
    {
      path: "/reports",
      name: "Leads",
      element: <ReportsPage />,
      route: PrivateRoute,
    },
  ],
};

const leadRoutes = {
  path: "/apps/lead_management",
  name: "Lead",
  route: PrivateRoute,
  roles: ["Add Leads", "View Task", "Monitor"],
  icon: "users",
  children: [
    {
      path: "leads/leads_list",
      name: "Leads",
      // element: <CRMLeadsList />,
      element: (
        <PrivateRoute
          roles={["Add Leads", "View Task", "Monitor"]}
          component={CRMLeadsList}
        />
      ),
      route: PrivateRoute,
    },
    {
      path: "leads/tasks",
      name: "Tasks",
      // element: <Tasks />,
      element: (
        <PrivateRoute roles={["View Task", "Monitor"]} component={Tasks} />
      ),
      route: PrivateRoute,
    },
  ],
};

const appRoutes = [crmAppRoutes];

// pages

// ui
const settingsRoutes = {
  path: "/settings",
  name: "Components",
  icon: "pocket",
  header: "UI Elements",
  children: [
    {
      path: "/settings/master",
      name: "Forms",
      children: [
        {
          path: "/settings/master/category",
          name: "Category",
          // element: <Category />,
          element: <PrivateRoute roles={["Monitor"]} component={Category} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/source",
          name: "Source",
          // element: <Source />,
          element: <PrivateRoute roles={["Monitor"]} component={Source} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/channel",
          name: "Channel",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Channel} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/office_type",
          name: "Channel",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={OfficeType} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/region",
          name: "Channel",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Region} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/flag",
          name: "Channel",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Flag} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/marital_status",
          name: "Channel",
          // element: <Channel />,
          element: (
            <PrivateRoute roles={["Monitor"]} component={MaritalStatus} />
          ),
          route: PrivateRoute,
        },
        {
          path: "/settings/master/country",
          name: "Channel",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Country} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/campaign",
          name: "Campaign",
          // element: <Campaign />,
          element: <PrivateRoute roles={["Monitor"]} component={Campaign} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/branches",
          name: "Branches",
          // element: <Branches />,
          element: <PrivateRoute roles={["Monitor"]} component={Branches} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/status",
          name: "Status",
          // element: <Status />,
          element: <PrivateRoute roles={["Monitor"]} component={Status} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/status/checklist/:id",
          name: "Checklists",
          // element: <CheckLists />,
          element: <PrivateRoute roles={["Monitor"]} component={CheckLists} />,

          route: PrivateRoute,
        },
        {
          path: "/settings/master/status_config",
          name: "Status Config",
          // element: <StatusConfig />,
          element: (
            <PrivateRoute roles={["Monitor"]} component={StatusConfig} />
          ),
          route: PrivateRoute,
        },
        {
          path: "/settings/master/sub_status",
          name: "Status Config",
          // element: <SubStatus />,
          element: <PrivateRoute roles={["Monitor"]} component={SubStatus} />,
          route: PrivateRoute,
        },
      ],
    },

    {
      path: "/ui/extended",
      name: "Extended UI",
      children: [
        {
          path: "/extended-ui/nestable",
          name: "Nestable List",
          // element: <NestableList />,
          element: (
            <PrivateRoute roles={["Monitor"]} component={NestableList} />
          ),
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/dragdrop",
          name: "Drag and Drop",
          // element: <DragDrop />,
          element: <PrivateRoute roles={["Monitor"]} component={DragDrop} />,
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/rangesliders",
          name: "Range Sliders",
          element: <RangeSliders />,
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/animation",
          name: "Animation",
          element: <Animation />,
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/sweet-alert",
          name: "Sweet Alert",
          element: <SweetAlerts />,
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/tour",
          name: "Tour Page",
          element: <TourPage />,
          route: PrivateRoute,
        },
        {
          path: "/extended-ui/loading-buttons",
          name: "Loading Buttons",
          element: <LoadingButtons />,
          route: PrivateRoute,
        },
      ],
    },

    {
      path: "/ui/tables",
      name: "Tables",
      children: [
        {
          path: "/ui/tables/basic",
          name: "Basic",
          element: <BasicTables />,
          route: PrivateRoute,
        },
        {
          path: "/ui/tables/advanced",
          name: "Advanced",
          element: <AdvancedTables />,
          route: PrivateRoute,
        },
      ],
    },
  ],
};

//User Managemant
const UserRoutes = {
  path: "/user_management",
  name: "User Management",
  icon: "pocket",
  header: "User Management",
  children: [
    {
      path: "/user_management/access_roles",
      name: "Access Roles",
      // element: <AccessRoles />,
      element: <PrivateRoute roles={["Monitor"]} component={AccessRoles} />,
      route: PrivateRoute,
    },
    {
      path: "/user_management/user_creation",
      name: "User Creation",
      // element: <AdminUsers />,
      element: <PrivateRoute roles={["Monitor"]} component={AdminUsers} />,
      route: PrivateRoute,
    },
  ],
};
// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login2",
    name: "Login2",
    element: <Login2 />,
    route: Route,
  },
  {
    path: "/auth/logout2",
    name: "Logout2",
    element: <Logout2 />,
    route: Route,
  },
  {
    path: "/auth/register2",
    name: "Register2",
    element: <Register2 />,
    route: Route,
  },
  {
    path: "/auth/confirm2",
    name: "Confirm2",
    element: <Confirm2 />,
    route: Route,
  },
  {
    path: "/auth/forget-password2",
    name: "Forget Password2",
    element: <ForgetPassword2 />,
    route: Route,
  },
  {
    path: "/auth/signin-signup2",
    name: "SignIn-SignUp2",
    element: <SignInSignUp2 />,
    route: Route,
  },
  {
    path: "/auth/lock-screen2",
    name: "Lock Screen2",
    element: <LockScreen2 />,
    route: Route,
  },
];

// public routes
const otherPublicRoutes = [
  {
    path: "/unauthorized",
    name: "forbidden",
    element: <ForbiddenPage />,
    route: Route,
  },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);

    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes,
  ...appRoutes,
  settingsRoutes,
  UserRoutes,
  leadRoutes,
  reportsRoutes,
];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
