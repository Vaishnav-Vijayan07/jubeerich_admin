import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import LogoDark from "../../assets/images/jb_logo.png";
import LogoLight from "../../assets/images/logo-light.png";

import AuthBg from "../../assets/images/auth/authbg.png";

interface AccountLayoutProps {
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
}

const AuthLayout = ({ helpText, bottomLinks, children, isCombineForm }: AccountLayoutProps) => {
  useEffect(() => {
    if (document.body) document.body.classList.add("authentication-bg", "authentication-bg-pattern");

    return () => {
      if (document.body) document.body.classList.remove("authentication-bg", "authentication-bg-pattern");
    };
  }, []);

  return (
    <>
      <div
        className="account-pages pt-5 pb-5"
        style={{
          backgroundImage: `url(${AuthBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={isCombineForm ? 9 : 4}>
              <div
                className="logo-lg"
                style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}
              >
                <img src={LogoDark} alt="" height="70" />
              </div>
              <Card className="">
                <Card.Body className="p-4">
                  <div className="text-center w-75 m-auto"></div>
                  {children}
                </Card.Body>
                {bottomLinks}
              </Card>

              {/* bottom links */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AuthLayout;
