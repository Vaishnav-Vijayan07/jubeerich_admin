import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Col, Row } from "react-bootstrap";

const CardLoadingSkeleton = () => (
  <Card className="ribbon-box" style={{ fontFamily: "Nunito" }}>
    <Card.Body>
      <Row>
        {/* Left Side Skeletons */}
        <Col>
          <Skeleton width={80} height={30} style={{ marginBottom: "16px" }} />
        </Col>

        {/* Right Side Skeletons */}
        <Col className="d-flex justify-content-end">
          <div className="d-flex gap-2">
            <Skeleton width={180} height={36} />
          </div>
        </Col>

        <div className="clearfix"></div>
        <hr className="my-3" />
      </Row>

      <Row className="dotted-border-bottom" style={{ paddingBottom: "20px" }}>
        <Col md={9}>
          <Skeleton height={24} style={{ marginBottom: "8px" }} />
          <Skeleton width="60%" height={18} style={{ marginBottom: "12px" }} />

          <div className="d-flex gap-2">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} width={60} height={24} style={{ borderRadius: "5px" }} />
            ))}
          </div>
        </Col>
        <Col md={3}>
          <Skeleton width="80%" height={20} style={{ marginBottom: "12px" }} />
        </Col>
      </Row>

      <Row className="mb-3 mt-3">
        <Col>
          <Skeleton width="40%" height={24} style={{ marginBottom: "8px" }} />
        </Col>
        <Col>
          <Skeleton width={120} height={20} style={{ float: "right", marginBottom: "8px" }} />
        </Col>
      </Row>

      <div className="grid-container mb-2">
        {[...Array(6)].map((_, index) => (
          <div key={index}>
            <Skeleton width="50%" height={18} style={{ marginBottom: "8px" }} />
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <Skeleton circle width={16} height={16} />
              <Skeleton width="70%" height={24} />
            </div>
          </div>
        ))}
      </div>

      <Row>
        <div className="grid-container mb-2">
          {[...Array(2)].map((_, index) => (
            <div key={index}>
              <Skeleton width="60%" height={18} style={{ marginBottom: "8px" }} />
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <Skeleton circle width={16} height={16} />
                <Skeleton width="80%" height={24} />
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Row className="mt-3">
        <div>
          <Skeleton width="40%" height={24} style={{ marginBottom: "8px" }} />
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Skeleton circle width={16} height={16} />
            <Skeleton width="90%" height={24} />
          </div>
        </div>
      </Row>
    </Card.Body>
  </Card>
);

export default CardLoadingSkeleton;
