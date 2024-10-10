import React from "react";
import { Row } from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import DetailsTable from "./AllApplications/DetailsTable";

interface Props {}

const PendingDetails = (props: Props) => {
  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Applications", path: "" },
          { label: "Pending", path: "", active: true },
        ]}
        title={"Applications-Pending"}
      />

      <Row>
        <DetailsTable />
      </Row>
    </>
  );
};

export default PendingDetails;
