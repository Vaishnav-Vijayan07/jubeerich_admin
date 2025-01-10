import React from "react";
import { baseUrl } from "../../constants";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import noFile from "../../assets/images/icons/file_not_found.svg";

type Props = {
  fileName: string;
  filePath: string;
};

function FileDisplay({ fileName, filePath }: Props) {
  const getFileType = (fileName: string) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    const ext = parts.pop();
    return ext ? ext.toLowerCase() : "";
  };

  const getFileName = (fileName: string) => {
    if (!fileName) return "";
    const parts = fileName.split(".");
    const extension = parts.pop();
    let name = parts.join(".");

    const hyphenCount = (name.match(/-/g) || []).length;

    if (hyphenCount === 3) {
      const hyphenIndex = name.indexOf("-");
      if (hyphenIndex !== -1) {
        name = name.slice(hyphenIndex + 1).trim();
      }
    }

    if (name.length > 25) {
      name = name.slice(0, 25) + "...";
    }

    return name;
  };

  return (
    <>
      <Card className="mb-1 mt-1 shadow-none border">
        <div className="p-2">
          <Row className="align-items-center">
            {fileName && (
              <Col className="col-auto">
                <div className="avatar-sm">
                  <span className="avatar-title badge-soft-primary text-primary rounded">.{getFileType(fileName)}</span>
                </div>
              </Col>
            )}

            {fileName && (
              <Col className="ps-0">
                <Link to="#" className="text-muted fw-bold">
                  {getFileName(fileName)}
                </Link>
                <br />
              </Col>
            )}

            {!fileName && (
              <Col className="d-flex-col justify-content-end col-auto">
                <img src={noFile} alt="date logo" width={37.3} className="" />
                <span className="ms-1">File Not Uploaded</span>
              </Col>
            )}

            {fileName && (
              <Col className="col-auto">
                <a
                  href={`${baseUrl}/uploads/${filePath}/${fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-download"
                  className="btn btn-link font-16 text-muted"
                >
                  <i className="dripicons-download"></i>
                </a>
              </Col>
            )}
          </Row>
        </div>
      </Card>
    </>
  );
}

export default FileDisplay;
