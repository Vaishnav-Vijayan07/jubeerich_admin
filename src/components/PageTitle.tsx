import React from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";

interface BreadcrumbItems {
  label: string;
  path: string;
  active?: boolean;
}

interface PageTitleProps {
  breadCrumbItems: Array<BreadcrumbItems>;
  title: string;
}

/**
 * PageTitle
 */
const PageTitle = (props: PageTitleProps) => {
  return (
    <Row>
      <Col>
        <div className="page-title-box" style={props["title"] == "Inbox" ? { marginTop: "20px" } : {}}>
          <h4
            className="page-title inter-font"
            style={props["title"] == "Inbox" ? { fontWeight: "400", color: "#6C757D", lineHeight: "35px", fontSize: "16px" } : {}}
          >
            {props["title"]}
          </h4>
          <div className="page-title-right">
            <Breadcrumb className="m-0">
              <Breadcrumb.Item className="m-0 inter-font" href="/">
                Jubeerich
              </Breadcrumb.Item>

              {(props["breadCrumbItems"] || []).map((item, index) => {
                return item.active ? (
                  <Breadcrumb.Item className="inter-font" active key={index}>
                    {item.label}
                  </Breadcrumb.Item>
                ) : (
                  <Breadcrumb.Item key={index} href={item.path} className="inter-font">
                    {item.label}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PageTitle;
