import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col, Form } from "react-bootstrap";
import StackGraph from "../Components/StackGraph";
import ApplicationsTable from "../Components/ApplicationsTable";

function ApplicationTeamDashboard({ categories, series, latestLeadsCount,colors }: any) {
  return (
    <>
      <Row className="d-flex align-items-stretch mb-2">
        <Col md={12}>
          <StackGraph categories={categories} series={series} colors={colors} />
        </Col>
        {/* <Col md={6}>
          <ApplicationsTable leadsData={latestLeadsCount} />
        </Col> */}
      </Row>
    </>
  );
}

export default WithDashboardLayout(ApplicationTeamDashboard);
