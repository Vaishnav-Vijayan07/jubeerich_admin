import React from "react";
import { Navigate } from "react-router-dom";

import { APICore } from "../helpers/api/apiCore";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, roles, ...rest }: PrivateRouteProps) => {
  const api = new APICore();

  if (api.isUserAuthenticated() === false) {
    // not logged in so redirect to login page with the return url
    return (
      <Navigate
        // state={from: props['path']}
        to={{
          pathname: "/auth/login2/",
          // state: { from: props['path'] },
        }}
      />
    );
  }

  const loggedInUser = api.getLoggedInUser();

  // check if route is restricted by role
  if (roles && !loggedInUser.power_names?.some((userRole: any) => roles.includes(userRole))) {
    // No matching role found, so redirect to the unauthorized page
    return <Navigate to={{ pathname: "/unauthorized" }} />;
  }

  return <Component />;
};

export default PrivateRoute;
