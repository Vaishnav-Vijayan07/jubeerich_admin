import React from "react";
import PortalDetailInput from "./PortalDetailInput";
import { Card, Col, Row } from "react-bootstrap";

type Props = {
  data: PortalDataSet;
};

type PortalItem = {
  title: string;
  value: string;
};

type PortalDataSet = PortalItem[];

function PortalDetailsBox({ data }: Props) {
  return (
    <>
      <Col md={12} className="portal-box-container mt-3 ribbon-box pb-2">
        <div className="ribbon ribbon-primary float-start px-3 max-content mt-2 mb-0" style={{ marginLeft: "-28px" }}>
          <span>Application Portal Details</span>
        </div>
        <br />
        <br />
        {data.map((item: PortalItem) => (
          <PortalDetailInput value={item?.value} title={item?.title} />
        ))}
      </Col>
    </>
  );
}

export default PortalDetailsBox;
