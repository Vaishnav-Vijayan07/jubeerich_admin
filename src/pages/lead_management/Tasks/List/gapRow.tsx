import React, { memo } from "react";
import ActionButton from "./ActionButton";
import { Col, Form, Row } from "react-bootstrap";
import { baseUrl } from "../../../../constants";
import { FormInput } from "../../../../components";
import moment from "moment";

const GapRows = ({ gapData, handleGapChange, addMoreGap, removeGap }: any) => {
  // Memoize the rendering of each gap row to avoid re-rendering
  const renderGapRows = React.useCallback(
    (gap: any, index: number) => (
      <Row key={index} className="mb-4 p-2 border-bottom rounded">
        {/* Start Date */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`start_date-${index}`}>
            <Form.Label>Start Date</Form.Label>
            <FormInput
              type="date"
              name="start_date"
              defaultValue={moment(gap?.start_date).format("YYYY-MM-DD")}
              value={moment(gap?.start_date).format("YYYY-MM-DD")}
              onChange={(e) =>
                handleGapChange(index, e.target.name, e.target.value)
              }
            />
            {gap?.errors?.start_date && (
              <Form.Text className="text-danger">
                {gap.errors.start_date}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* End Date */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`end_date-${index}`}>
            <Form.Label>End Date</Form.Label>
            <FormInput
              type="date"
              name="end_date"
              defaultValue={moment(gap?.end_date).format("YYYY-MM-DD")}
              value={moment(gap?.end_date).format("YYYY-MM-DD")}
              onChange={(e) =>
                handleGapChange(index, e.target.name, e.target.value)
              }
            />
            {gap?.errors?.end_date && (
              <Form.Text className="text-danger">
                {gap.errors.end_date}
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Supporting Document */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group
            className="mb-3"
            controlId={`supporting_document-${index}`}
          >
            <Form.Label>Supporting Document</Form.Label>
            <Form.Control
              type="file"
              name="supporting_document"
              onChange={(e: any) =>
                handleGapChange(index, e.target.name, e.target.files?.[0])
              }
            />
            {gap?.errors?.supporting_document && (
              <Form.Text className="text-danger">
                {gap.errors.supporting_document}
              </Form.Text>
            )}
            {typeof gap?.supporting_document === "string" && (
              <div className="d-flex align-items-center">
                <i className="mdi mdi-eye text-primary me-2"></i>
                <a
                  href={`${baseUrl}/uploads/gapDocuments/${gap.supporting_document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  Download Document
                </a>
              </div>
            )}
          </Form.Group>
        </Col>

        {/* Reason */}
        <Col md={4} lg={4} xl={4} xxl={4}>
          <Form.Group className="mb-3" controlId={`reason-${index}`}>
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="reason"
              placeholder="Enter reason for the gap"
              value={gap?.reason || ""}
              onChange={(e) =>
                handleGapChange(index, e.target.name, e.target.value)
              }
            />
            {gap?.errors?.reason && (
              <Form.Text className="text-danger">{gap.errors.reason}</Form.Text>
            )}
          </Form.Group>
        </Col>

        {/* Remove Button */}
        {gapData?.length > 1 && (
          <ActionButton
            onClick={() => removeGap(index, gap?.id ?? 0)}
            label="Remove"
            iconClass="mdi mdi-delete"
            colorClass="text-danger"
          />
        )}
      </Row>
    ),
    [gapData, handleGapChange, removeGap]
  );

  console.log(gapData);

  return (
    <>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Expereince Gap
      </h5>
      {gapData?.map((gap: any, index: number) => renderGapRows(gap, index))}
      <ActionButton
        onClick={addMoreGap}
        label="Add More"
        iconClass="mdi mdi-plus"
      />
    </>
  );
};

export default memo(GapRows);
