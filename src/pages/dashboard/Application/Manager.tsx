import WithDashboardLayout from "../Dashboard3/WithDashboardLayout";
import { Row, Col, Form } from "react-bootstrap";
import StackGraph from "../Components/StackGraph";
import PieData from "../Components/PieData";
import ApplicationsTable from "../Components/ApplicationsTable";
import ApplicationsManagerTable from "../Components/ApplicationManagerTable";

function ManagerDashboard({ categories, series, pieData, colors }: any) {
  const labels = pieData?.pieCategories;
  const pieSeries = pieData?.pieSeries;

  return (
    <>
      <Row className="d-flex align-items-stretch mb-2">
        <Col md={6}>
          <StackGraph categories={categories} series={series} colors={colors} />
        </Col>
        <Col md={6}>
          <div className="h-100">
            <PieData labels={labels || []} pieSeries={pieSeries || []} />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          <h4 className="text-primary">My Applications</h4>
        </Col>
      </Row>
    </>
  );
}

export default WithDashboardLayout(ManagerDashboard);
