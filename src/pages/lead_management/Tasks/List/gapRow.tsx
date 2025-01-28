import React, { memo, useState } from "react";
import ActionButton from "./ActionButton";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { baseUrl, showErrorAlert } from "../../../../constants";
import { FormInput } from "../../../../components";
import moment from "moment";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import validateFields from "../../../../helpers/validateHelper";
import useSaveGapData from "../../../../hooks/useSaveGapData";
import { allowedFileTypes } from "./data";

const GapRows = ({ gapData, studentId, type, hasGap }: any) => {
  const [gapDetails, setGapDetails] = useState(gapData);

  const { removeFromApi, loading: deleteLoading } = useRemoveFromApi();
  const { saveLoading: gapSaveLoading, saveGapData } =
    useSaveGapData(studentId);

  const handleGapChange = (index: number, name: string, value: any) => {

    if (typeof value == 'object' && !allowedFileTypes.includes(value.type)) {
      showErrorAlert("Only PDF and image files are allowed.");
      return;
    }

    setGapDetails((prevGap: any) =>
      prevGap.map((item: any, i: number) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addMoreGap = () => {
    setGapDetails([
      ...gapDetails,
      {
        start_date: "",
        end_date: "",
        reason: "",
        supporting_document: null,
        errors: {},
      },
    ]);
  };

  const removeGap = (index: number, itemId: number) => {
    if (itemId === 0) {
      setGapDetails((prevState: any) =>
        prevState.filter((_: any, i: number) => i !== index)
      );
    } else {
      removeFromApi(itemId, "gap");
    }
  };

  const saveGap = async () => {
    const validationRules = {
      start_date: { required: true, message:"Please select a start date" },
      end_date: { required: true, message:"Please select an end date" },
      reason: { required: true, message:"Please enter a reason" },
      supporting_document: { required: true , message:"Please upload a supporting document" },
    };

    const { isValid, errors } = validateFields(gapDetails, validationRules);

    if (!isValid) {
      setGapDetails((prevState: any) =>
        prevState.map((exp: any, index: any) => ({
          ...exp,
          errors: errors[index] || {},
        }))
      );
      return;
    }

    saveGapData(gapDetails, type, hasGap);
  };

  const renderGapRows = (gap: any, index: number) => (
    <Row key={index} className="mb-4 p-2 border-bottom rounded">
      {/* Start Date */}
      <Col md={4} lg={4} xl={4} xxl={4}>
        <Form.Group className="mb-3" controlId={`start_date-${index}`}>
          <Form.Label><span className="text-danger">*</span> Start Date</Form.Label>
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
          <Form.Label><span className="text-danger">*</span> End Date</Form.Label>
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
            <Form.Text className="text-danger">{gap.errors.end_date}</Form.Text>
          )}
        </Form.Group>
      </Col>

      {/* Supporting Document */}
      <Col md={4} lg={4} xl={4} xxl={4}>
        <Form.Group className="mb-3" controlId={`supporting_document-${index}`}>
          <Form.Label><span className="text-danger">*</span> Supporting Document</Form.Label>
          <Form.Control
            type="file"
            accept="image/*,application/pdf"
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
                href={`${baseUrl}uploads/gapDocuments/${gap.supporting_document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                View Document
              </a>
            </div>
          )}
        </Form.Group>
      </Col>

      {/* Reason */}
      <Col md={8} lg={8} xl={8} xxl={8}>
        <Form.Group className="mb-3" controlId={`reason-${index}`}>
          <Form.Label><span className="text-danger">*</span> Reason</Form.Label>
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
      {gapDetails?.length > 1 && (
        <ActionButton
          onClick={() => removeGap(index, gap?.id ?? 0)}
          label="Remove"
          iconClass="mdi mdi-delete"
          colorClass="text-danger"
        />
      )}
    </Row>
  );

  return (
    <>
      <h5 className="mb-4 text-uppercase">
        <i className="mdi mdi-account-circle me-1"></i>Experience Gap
      </h5>
      {gapDetails?.map((gap: any, index: number) => renderGapRows(gap, index))}
      <ActionButton
        onClick={addMoreGap}
        label="Add More"
        iconClass="mdi mdi-plus"
      />
      <Row>
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          onClick={saveGap}
          disabled={deleteLoading || gapSaveLoading}
        >
          {deleteLoading || gapSaveLoading ? ( // Corrected this line
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" Saving..."}
            </>
          ) : (
            "Save Gap Details"
          )}
        </Button>
      </Row>
    </>
  );
};

export default GapRows;
