import React from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";
import FranchiseDetails from "../pages/forms/FranchiseDetails";

// components
import PrivateRoute from "./PrivateRoute";
import { AUTH_SESSION_KEY } from "../constants";
import UserBox from "../pages/forms/BranchDetails";
import KycRejected from "../pages/forms/KycRejected";
import KycApproved from "../pages/forms/KycApproved";
import Submitted from "../pages/forms/Kyc/MyApplications/Submitted";
import OfferSubmitted from "../pages/forms/Kyc/MyApplications/OfferSubmitted";
import LeadDetailsMaterial from "../pages/forms/Material/LeadsDetails/LeadDetailsMaterial";
import TasksMaterial from "../pages/forms/Material/Tasks/TasksMaterial";
import TaskPrefix from "../pages/forms/taskPrefix";

// lazy load all the views

// auth2
const Login2 = React.lazy(() => import("../pages/auth/Login"));
const Logout2 = React.lazy(() => import("../pages/auth/Logout"));
const Register2 = React.lazy(() => import("../pages/auth/Register"));
const Confirm2 = React.lazy(() => import("../pages/auth/Confirm"));
const ForgetPassword2 = React.lazy(() => import("../pages/auth2/ForgetPassword2"));
const LockScreen2 = React.lazy(() => import("../pages/auth/LockScreen"));
const SignInSignUp2 = React.lazy(() => import("../pages/auth/SignInSignUp"));

// dashboard
const Dashboard4 = React.lazy(() => import("../pages/dashboard/Dashboard3"));

// - crm pages

const CRMLeads = React.lazy(() => import("../pages/apps/CRM/Leads"));
const OrdinaryTasks = React.lazy(() => import("../pages/lead_management/OrdinaryTasks"));

const TasksTodo = React.lazy(() => import("../pages/lead_management/TaskTodo/TaskTodo"));

//Leads
const CRMLeadsList = React.lazy(() => import("../pages/lead_management/Tickets/List"));
const Tasks = React.lazy(() => import("../pages/lead_management/Tasks/List"));

//KYC
const KycApproval = React.lazy(() => import("../pages/forms/KycApproval"));
const ApplicationAllPending = React.lazy(() => import("../pages/forms/Kyc/Application Manager/AllPending"));
const MyApplicationPending = React.lazy(() => import("../pages/forms/Kyc/MyApplications/Pending"));

const KycDetails = React.lazy(() => import("../pages/forms/KycDetails"));

const PendingDetails = React.lazy(() => import("../pages/forms/Kyc/PendingDetails"));
const PendingDetailsByID = React.lazy(() => import("../pages/forms/Kyc/PendingDetailsById"));
const PortalDetails = React.lazy(() => import("../pages/forms/Kyc/PortDetails"));
const VisaCheckLists = React.lazy(() => import("../pages/forms/VisaChecklist"));
const VisaConfiguration = React.lazy(() => import("../pages/forms/VisaConfiguration"));
const SubmittedDetails = React.lazy(() => import("../pages/forms/Kyc/SubmittedApplication"));

// uikit

const NestableList = React.lazy(() => import("../pages/uikit/NestableList"));
const DragDrop = React.lazy(() => import("../pages/uikit/DragDrop"));
const RangeSliders = React.lazy(() => import("../pages/uikit/RangeSliders"));
const Animation = React.lazy(() => import("../pages/uikit/Animation"));
const TourPage = React.lazy(() => import("../pages/uikit/TourPage"));
const SweetAlerts = React.lazy(() => import("../pages/uikit/SweetAlerts"));
const LoadingButtons = React.lazy(() => import("../pages/uikit/LoadingButtons"));

// forms
const Category = React.lazy(() => import("../pages/forms/Category"));
const Source = React.lazy(() => import("../pages/forms/Source"));
const Channel = React.lazy(() => import("../pages/forms/Channel"));
const Campaign = React.lazy(() => import("../pages/forms/Campaign"));
const OfficeType = React.lazy(() => import("../pages/forms/OfficeType"));
const Region = React.lazy(() => import("../pages/forms/Region"));
const Flag = React.lazy(() => import("../pages/forms/Flag"));
const MaritalStatus = React.lazy(() => import("../pages/forms/MaritalStatus"));
const Leads = React.lazy(() => import("../pages/forms/Leads"));
const RegionalManagerAssignedLeads = React.lazy(() => import("../pages/forms/RegionalManagerAssignedLeads"));
const LeadDetails = React.lazy(() => import("../pages/forms/LeadDetails"));
const AssignedLeads = React.lazy(() => import("../pages/forms/AssignedLeads"));
const Country = React.lazy(() => import("../pages/forms/Country"));
const Branches = React.lazy(() => import("../pages/forms/Branches"));
const University = React.lazy(() => import("../pages/forms/University"));
const Programs = React.lazy(() => import("../pages/forms/Programs"));
const Franchiseees = React.lazy(() => import("../pages/forms/Franchise"));
const Status = React.lazy(() => import("../pages/status/Status"));
const Campus = React.lazy(() => import("../pages/forms/Campus"));
const ConfigureCourses = React.lazy(() => import("../pages/forms/ConfigureCourses"));
const CourseType = React.lazy(() => import("../pages/forms/CourseType"));
const Course = React.lazy(() => import("../pages/forms/Course"));
const Stream = React.lazy(() => import("../pages/forms/Stream"));
const StatusConfig = React.lazy(() => import("../pages/status/StatusConfiguration"));
const StatusType = React.lazy(() => import("../pages/status/StatusType"));
const SubStatus = React.lazy(() => import("../pages/status/SubStatus"));
const CheckLists = React.lazy(() => import("../pages/forms/CheckLists"));

// users
const AccessRoles = React.lazy(() => import("../pages/users/AccessRoles"));
const AdminUsers = React.lazy(() => import("../pages/users/AdminUsers"));
const FranchiseCounsellors = React.lazy(() => import("../pages/users/FranchiseCounsellors"));
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
          roles={["Add Lead", "View Task", "Monitor", "Manage Franchise", "Manage Applications", "Allocate Applications"]}
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
  roles: ["Add Lead", "View Task", "KYC Approval"],
  icon: "users",
  children: [
    {
      path: "/apps/crm/leads",
      name: "Leads",
      element: <CRMLeads />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details",
      name: "KYC Approval",
      element: <KycApproval />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/all/pending",
      name: "KYC Approval",
      element: <ApplicationAllPending />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/applications/pending",
      name: "KYC Approval",
      element: <MyApplicationPending />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/all/assigned",
      name: "KYC Approval",
      element: <ApplicationAllPending />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_rejected_details",
      name: "KYC Rejected",
      element: <KycRejected />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_approved_details",
      name: "KYC Approved",
      element: <KycApproved />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/pending",
      name: "KYC Approval",
      element: <PendingDetails />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/pending/:id",
      name: "KYC Approval",
      element: <PendingDetailsByID />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/pending/portal_details",
      name: "KYC Approval",
      element: <PortalDetails />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/applications/submitted",
      name: "KYC Approval",
      // element: <SubmittedDetails />,
      element: <Submitted />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/applications/offer_accepted",
      name: "KYC Approval",
      // element: <SubmittedDetails />,
      element: <OfferSubmitted />,
      route: PrivateRoute,
    },
    {
      path: "/kyc_details/:id/:application_id",
      name: "KYC Details",
      element: <KycDetails />,
      route: PrivateRoute,
    },
    // {
    //   path: "/kyc_rejected_details/:id/:application_id",
    //   name: "KYC Rejected",
    //   element: <KycDetails />,
    //   route: PrivateRoute,
    // },
  ],
};

const reportsRoutes = {
  path: "/",
  name: "CRM",
  route: PrivateRoute,
  roles: ["Add Lead", "View Task"],
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
  roles: ["Add Lead", "View Task", "Monitor"],
  icon: "users",
  children: [
    {
      path: "leads/manage",
      name: "Leads",
      // element: <CRMLeadsList />,
      element: <PrivateRoute roles={["Add Lead", "View Task", "Monitor"]} component={Leads} />,
      route: PrivateRoute,
    },
    {
      path: "leads/assigned_regional_manager",
      name: "Leads",
      // element: <CRMLeadsList />,
      element: <PrivateRoute roles={["Manage Branch"]} component={RegionalManagerAssignedLeads} />,
      route: PrivateRoute,
    },
    {
      path: "leads/manage/:id",
      name: "Leads",
      // element: <PrivateRoute roles={["Add Lead", "Manage Applications"]} component={LeadDetails} />,
      element: <PrivateRoute roles={["Add Lead", "Manage Applications"]} component={LeadDetailsMaterial} />,
      route: PrivateRoute,
    },
    {
      path: "leads/manage_mat/:id",
      name: "Leads",
      element: <PrivateRoute roles={["Add Lead", "Manage Applications"]} component={LeadDetailsMaterial} />,
      route: PrivateRoute,
    },
    {
      path: "leads/assigned/manage",
      name: "Leads",
      // element: <CRMLeadsList />,
      element: <PrivateRoute roles={["Assigned Leads"]} component={AssignedLeads} />,
      route: PrivateRoute,
    },
    {
      path: "leads/tasks",
      name: "Tasks",
      // element: <Tasks />,
      // element: <PrivateRoute roles={["View Task", "Monitor"]} component={Tasks} />,
      element: <PrivateRoute roles={["View Task", "Monitor"]} component={TasksMaterial} />,
      route: PrivateRoute,
    },
    {
      path: "leads/tasks_mat",
      name: "Tasks",
      // element: <Tasks />,
      element: <PrivateRoute roles={["View Task", "Monitor"]} component={TasksMaterial} />,
      route: PrivateRoute,
    },
    // {
    //   path: "leads/ordinary_tasks",
    //   name: "Ordinary Tasks",
    //   // element: <Tasks />,
    //   element: (
    //     <PrivateRoute
    //       roles={["View Task", "Monitor"]}
    //       component={OrdinaryTasks}
    //     />
    //   ),
    //   route: PrivateRoute,
    // },
    {
      path: "leads/ordinary_tasks",
      name: "Ordinary Tasks",
      // element: <Tasks />,
      element: <PrivateRoute roles={["View Task", "Monitor"]} component={TasksTodo} />,
      route: PrivateRoute,
    },
    // {
    //   path: "leads/ordinary_tasks_Todo",
    //   name: "Ordinary Tasks",
    //   // element: <Tasks />,
    //   element: (
    //     <PrivateRoute
    //       roles={["View Task", "Monitor"]}
    //       component={TasksTodo}
    //     />
    //   ),
    //   route: PrivateRoute,
    // },
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
          path: "/settings/master/type",
          name: "Category",
          // element: <Category />,
          element: <PrivateRoute roles={["Monitor"]} component={Category} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/task_prefix",
          name: "Task Prefix",
          element: <PrivateRoute roles={["Monitor"]} component={TaskPrefix} />,
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
          name: "ooficetype",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={OfficeType} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/region",
          name: "region",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Region} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/flag",
          name: "flag",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Flag} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/marital_status",
          name: "maritial_status",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={MaritalStatus} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/country",
          name: "country",
          // element: <Channel />,
          element: <PrivateRoute roles={["Monitor"]} component={Country} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/campaign",
          name: "campaign",
          // element: <Campaign />,
          element: <PrivateRoute roles={["Monitor"]} component={Campaign} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/branches",
          name: "branches",
          // element: <Branches />,
          element: <PrivateRoute roles={["Monitor"]} component={Branches} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/branch_detials/:branchId",
          name: "branches_details",
          // element: <Branches />,
          element: <PrivateRoute roles={["Monitor"]} component={UserBox} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/university",
          name: "university",
          // element: <Branches />,
          element: <PrivateRoute roles={["Monitor"]} component={University} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/programs",
          name: "programs",
          // element: <Branches />,
          element: <PrivateRoute roles={["Monitor"]} component={Programs} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/franchise",
          name: "franchisees",
          element: <PrivateRoute roles={["Monitor"]} component={Franchiseees} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/franchise_details/:franchiseId",
          name: "franchise_details",
          element: <PrivateRoute roles={["Monitor"]} component={FranchiseDetails} />,
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
          path: "/settings/master/visa_checklists",
          name: "Visa Checklists",
          element: <PrivateRoute roles={["Monitor"]} component={VisaCheckLists} />,
          route: PrivateRoute,
        }, 
        {
          path: "/settings/master/visa_configuration",
          name: "Visa Configuration",
          element: <PrivateRoute roles={["Monitor"]} component={VisaConfiguration} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/status/status_config",
          name: "Status Config",
          // element: <StatusConfig />,
          element: <PrivateRoute roles={["Monitor"]} component={StatusConfig} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/status/status_type",
          name: "Status Config",
          // element: <StatusConfig />,
          element: <PrivateRoute roles={["Monitor"]} component={StatusType} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/sub_status",
          name: "Status Config",
          // element: <SubStatus />,
          element: <PrivateRoute roles={["Monitor"]} component={SubStatus} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/campus",
          name: "Campus",
          element: <PrivateRoute roles={["Monitor"]} component={Campus} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/configure_courses/:id",
          name: "Configure Courses",
          element: <PrivateRoute roles={["Monitor"]} component={ConfigureCourses} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/course_type",
          name: "Course Type",
          element: <PrivateRoute roles={["Monitor"]} component={CourseType} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/course",
          name: "Course",
          element: <PrivateRoute roles={["Monitor"]} component={Course} />,
          route: PrivateRoute,
        },
        {
          path: "/settings/master/stream",
          name: "Stream",
          element: <PrivateRoute roles={["Monitor"]} component={Stream} />,
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
          element: <PrivateRoute roles={["Monitor"]} component={NestableList} />,
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
    {
      path: "/user_management/counsellor_creation",
      name: "Counsellor Creation",
      // element: <AdminUsers />,
      element: <PrivateRoute roles={["Manage Franchise"]} component={FranchiseCounsellors} />,
      route: PrivateRoute,
    },
  ],
};
// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login2",
    element: <Login2 />,
    route: Route,
  },
  {
    path: "/auth/logout",
    name: "Logout2",
    element: <Logout2 />,
    route: Route,
  },
  {
    path: "/auth/register",
    name: "Register2",
    element: <Register2 />,
    route: Route,
  },
  {
    path: "/auth/confirm",
    name: "Confirm2",
    element: <Confirm2 />,
    route: Route,
  },
  {
    path: "/auth/forget-password",
    name: "Forget Password2",
    element: <ForgetPassword2 />,
    route: Route,
  },
  {
    path: "/auth/signin-signup",
    name: "SignIn-SignUp2",
    element: <SignInSignUp2 />,
    route: Route,
  },
  {
    path: "/auth/lock-screen",
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
const authProtectedRoutes = [dashboardRoutes, ...appRoutes, settingsRoutes, UserRoutes, leadRoutes, reportsRoutes];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export { publicRoutes, authProtectedRoutes, authProtectedFlattenRoutes, publicProtectedFlattenRoutes };
