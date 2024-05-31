import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LogoDark from "../../assets/images/logo-dark.png";
import LogoLight from "../../assets/images/logo-light.png";
import Banner from '../../assets/images/auth/banner.png'

interface AccountLayoutProps {
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
}

const AuthLayout = ({
  helpText,
  bottomLinks,
  children,
  isCombineForm,
}: AccountLayoutProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (document.body)
      document.body.classList.remove(
        "authentication-bg",
        "authentication-bg-pattern"
      );
    if (document.body) document.body.classList.add("auth-fluid-pages", "pb-0");

    return () => {
      if (document.body)
        document.body.classList.remove("auth-fluid-pages", "pb-0");
    };
  }, []);

  return (
    <>
      <div className="auth-fluid">
        {/* Auth fluid left content */}
        <div className="auth-fluid-right text-center">
          <img src={Banner} alt="Logo" className="auth__banner" />
        </div>
        {/* Auth fluid right content */}
        <div className="auth-fluid-form-box">
          <div className="align-items-center d-flex h-100">
            <Card.Body>
              {/* logo */}
              <div className="auth-brand text-center text-lg-start">
                <div className="auth-logo">
                  <Link
                    to="/"
                    className="logo logo-dark text-center outline-none"
                  >
                    <span className="logo-lg">
                      <img src={LogoDark} alt="" height="28" />
                    </span>
                  </Link>

                  <Link to="/" className="logo logo-light text-center">
                    <span className="logo-lg">
                      <img src={LogoLight} alt="" height="28" />
                    </span>
                  </Link>
                </div>
              </div>

              {children}

              {/* footer links */}
              {bottomLinks}
            </Card.Body>
          </div>
        </div>


      </div>
    </>
  );
};

export default AuthLayout;
