import React, { useEffect } from "react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { Navigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

// actions
import { resetAuth, loginUser } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";

interface UserData {
  username: string;
  password: string;
}

/* bottom links */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-0">
      {/* <Col className="text-center">
        <p>
          <Link to={"/auth/forget-password"} className="text-black-50 ms-1">
            {t("Forgot your password?")}
          </Link>
        </p>
        <p className="text-black-50">
          {t("Don't have an account?")}{" "}
          <Link to={"/auth/register"} className="text-white ms-1">
            <b>{t("Sign Up")}</b>
          </Link>
        </p>
      </Col> */}
    </Row>
  );
};

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const { user, userLoggedIn, loading, error } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    loading: state.Auth.loading,
    error: state.Auth.error,
    userLoggedIn: state.Auth.userLoggedIn,
  }));

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  /*
  form validation schema
  */
  const schemaResolver = yupResolver(
    yup.object().shape({
      username: yup.string().required(t("Please enter Username")),
      password: yup.string().required(t("Please enter Password")),
    })
  );

  /*
  handle form submission
  */
  const onSubmit = (formData: UserData) => {
    dispatch(loginUser(formData["username"], formData["password"]));
  };

  let userInfo = sessionStorage.getItem("jb_user");
  let userTaskAccess;
  if(userInfo){
    userTaskAccess = JSON.parse(userInfo)?.power_names?.includes("View Task");
  }
  

  const location = useLocation();
  //
  // const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/';
  // const redirectUrl = location?.search?.slice(6) || "/";
  
  let redirectUrl;
  if(userTaskAccess){
    redirectUrl = location?.search?.slice(6) || "/leads/tasks";
  } else {
    redirectUrl = location?.search?.slice(6) || "/";
  }

  return (
    <>
      {(userLoggedIn || user) && <Navigate to={redirectUrl}></Navigate>}

      <AuthLayout
        helpText={t("Enter your email address and password to access admin panel.")}
        bottomLinks={<BottomLink />}
      >
        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}
        <h3 style={{ margin: "0" }}>Login</h3>
        <p>
          <small>Please enter your credentials to login</small>
        </p>
        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ username: "admin1", password: "admin@123" }}
        >
          <FormInput
            label={t("Username")}
            type="text"
            name="username"
            placeholder="Enter your Username"
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass={"mb-3"}
          ></FormInput>

          <div className="text-center d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {t("Log In")}
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </>
  );
};

export default Login;
