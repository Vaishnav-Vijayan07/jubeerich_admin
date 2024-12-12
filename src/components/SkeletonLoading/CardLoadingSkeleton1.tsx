import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Col, Row } from "react-bootstrap";

const CardLoadingSkeleton = () => (
  <>
    <Card className="ribbon-box" style={{ fontFamily: "Nunito", borderRadius: "10px" }}>
      <Card.Body>
        <Row>
          {/* Left Side Skeletons */}
          <Col>
            <Skeleton width={120} height={25} style={{ marginBottom: "16px" }} />
          </Col>

          {/* Right Side Skeletons */}
          <Col className="d-flex justify-content-end">
            <div className="d-flex gap-2">
              <Skeleton width={150} height={36} />
            </div>
          </Col>
        </Row>

        <Row className="" style={{ paddingBottom: "20px" }}>
          <Col md={9}>
            <Skeleton height={20} width={"60%"} style={{ marginBottom: "8px" }} />
            <Skeleton width="40%" height={12} style={{ marginBottom: "12px" }} />

            <div className="d-flex gap-2">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} width={60} height={20} style={{ borderRadius: "5px" }} />
              ))}
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <div className="grid-container mb-2">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <Skeleton width="60%" height={18} style={{ marginBottom: "8px" }} />
                <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                  <Skeleton className="rounded-2" width={16} height={16} />
                  <Skeleton width={80} height={16} className="ms-2" />
                </div>
              </div>
            ))}
          </div>
        </Row>
      </Card.Body>
    </Card>

    <Card style={{ borderRadius: "10px" }}>
      <Card.Body>
        <Row>
          <Col md={4} className="px-3">
            <Skeleton width={"30%"} height={18} style={{ marginBottom: "16px" }} />
            <Skeleton width={"100%"} height={30} style={{ marginBottom: "16px" }} />
          </Col>
          <Col md={4} className="px-3">
            <Skeleton width={"30%"} height={18} style={{ marginBottom: "16px" }} />
            <Skeleton width={"100%"} height={30} style={{ marginBottom: "16px" }} />
          </Col>
          <Col md={4} className="px-3">
            <Skeleton width={"30%"} height={18} style={{ marginBottom: "16px" }} />
            <Skeleton width={"100%"} height={30} style={{ marginBottom: "16px" }} />
          </Col>
        </Row>
        <Row>
          <Col md={4} className="px-3">
            <Skeleton width={"100%"} height={80} style={{ marginBottom: "16px" }} />
          </Col>
        </Row>
      </Card.Body>
    </Card>

    <Card style={{ borderRadius: "10px" }}>
      <Card.Body>
        <Row className="" style={{ paddingBottom: "20px" }}>
          <Col md={9}>
            <Skeleton height={20} width={"60%"} style={{ marginBottom: "8px" }} />
            <Skeleton width="40%" height={12} style={{ marginBottom: "12px" }} />

            <div className="d-flex gap-2">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} width={150} height={20} style={{ borderRadius: "5px" }} />
              ))}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </>
);

export default CardLoadingSkeleton;
