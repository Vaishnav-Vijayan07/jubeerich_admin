import React from "react";
import PortalDetailInput from "./PortalDetailInput";
import { Col } from "react-bootstrap";

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
      <Col md={12} className="portal-box-container mt-3">
        {data.map((item:PortalItem) => (
          <PortalDetailInput value={item?.value} title={item?.title} />
        ))}
      </Col>
    </>
  );
}

export default PortalDetailsBox;
