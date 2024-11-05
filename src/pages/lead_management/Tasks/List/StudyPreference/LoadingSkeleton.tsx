import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Col, Row } from "react-bootstrap";

const SkeletonComponent = () => (
  <Row>
    {[1, 2, 3,4,5].map((_, index) => (
      <Col key={index} xl={6} xxl={4}>
        <div className="mb-3">
          {/* Skeleton for Form Label */}
          <Skeleton width={100} height={20} style={{ marginBottom: "8px" }} />

          {/* Skeleton for Select Input */}
          <Skeleton height={40} className="react-select-skeleton" />

          {/* Skeleton for Form Text Error Message */}
          <Skeleton width="50%" height={16} style={{ marginTop: "8px" }} />
        </div>
      </Col>
    ))}
  </Row>
);

export default SkeletonComponent;
