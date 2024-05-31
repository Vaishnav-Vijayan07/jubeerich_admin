import classNames from "classnames";
import React from "react";
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, truncateText } from "../../../../constants";

const Attachments = ({ f, index, handleDeleteFile, ext }: any) => {
  const handleDownload = (event: any) => {
    event.preventDefault();

    if (f) {
      const { file_name, file_path } = f;
      const fileUrl = `${baseUrl}/${file_path}`;

      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", file_name);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card key={index} className="mb-1 mt-1 shadow-none border">
      <div className="p-2">
        <Row className="align-items-center">
          <Col className="col-auto">
            <div className="avatar-sm">
              <span className="avatar-title badge-soft-primary text-primary rounded">.{ext}</span>
            </div>
          </Col>

          <Col className="ps-0">
            <Link to="#" className="text-muted fw-bold">
              {truncateText(f.file_name, 25)}
              {/* {f.file_name} */}
            </Link>
            <br />

            <Badge
              pill
              className={classNames("me-1", "badge-soft-info", "px-1")}
              bg=""
              // className="mb-0 font-10 px-1 light"
            >
              {f.file_type}
            </Badge>
          </Col>

          <Col className="col-auto">
            <OverlayTrigger placement="left" overlay={<Tooltip id="delete">Download</Tooltip>}>
              <Link to="#" id="btn-download" className="btn btn-link font-16 text-muted" onClick={handleDownload}>
                <i className="dripicons-download"></i>
              </Link>
            </OverlayTrigger>

            <OverlayTrigger placement="left" overlay={<Tooltip id="delete">Delete</Tooltip>}>
              <Link to="#" id="btn-delete" className="btn btn-link font-16 text-muted" onClick={() => handleDeleteFile(f.id)}>
                <i className="dripicons-trash"></i>
              </Link>
            </OverlayTrigger>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default Attachments;
