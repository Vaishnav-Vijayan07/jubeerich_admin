import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Accordion,
  useAccordionButton,
  Dropdown,
} from "react-bootstrap";
import avatarImg4 from "../../assets/images/users/user_circle_icon.png";

interface stateTypes {
  standard: boolean;
  setStandard: Dispatch<SetStateAction<boolean>>;
  selectedLead: any;
}
export const ModalComponent = ({
  standard,
  setStandard,
  selectedLead,
}: stateTypes) => {

  // const [standard, setStandard] = useState<boolean>(true);

  /**
   * Show/hide the modal
   */
  const toggleStandard = () => {
    setStandard(!standard);
  };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <Modal show={standard} onHide={toggleStandard}>
      <Modal.Header onHide={toggleStandard} closeButton>
        <h4 className="modal-title">INTR{selectedLead?.id}</h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <h3 className="mt-0">{selectedLead.enquiry}</h3>
          </Col>
          <p className="mt-2">{`Mr. ${selectedLead?.name}, inquiring about ${selectedLead?.enquiry} for his company,
         ${selectedLead?.company_name}`}</p>
          <Col>
            <p className="mt-2 mb-1 text-muted">Assigned To</p>
            <div className="d-flex align-items-start">
              <img
                src={avatarImg4}
                alt=""
                className="rounded-circle me-2"
                height="22"
              />
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {selectedLead?.assigned_user}
                </h5>
              </div>
            </div>
          </Col>

          <Col>
            <p className="mt-2 mb-1 text-muted">Date</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-calendar-month-outline font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {formatDateString(selectedLead?.created_at)}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="mt-2 mb-1 text-muted">Email</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-email-outline font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">{selectedLead.email}</h5>
              </div>
            </div>
          </Col>

          <Col>
            <p className="mt-2 mb-1 text-muted">Mobile Number</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-cellphone font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">{selectedLead.phone}</h5>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <p className="mt-2 mb-1 text-muted">Channel Name</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-google-ads font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {selectedLead.channel_name}
                </h5>
              </div>
            </div>
          </Col>
          <Col>
            <p className="mt-2 mb-1 text-muted">Branch</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-office-building font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {selectedLead.branch_name}
                </h5>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <p className="mt-2 mb-1 text-muted">Source Name</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-cloud-check-outline font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {selectedLead.source_name}
                </h5>
              </div>
            </div>
          </Col>
          <Col>
            <p className="mt-2 mb-1 text-muted">Company</p>
            <div className="d-flex align-items-start">
              <i className="mdi mdi-domain font-18 text-success me-1"></i>
              <div className="w-100">
                <h5 className="mt-1 font-size-14">
                  {selectedLead.company_name}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={toggleStandard}>
          Close
        </Button>{" "}
      </Modal.Footer>
    </Modal>
  );
};
