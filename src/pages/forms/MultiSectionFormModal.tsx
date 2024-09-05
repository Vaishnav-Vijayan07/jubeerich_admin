import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const MultiSectionFormModal = ({ show, handleClose }: any) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    place: "",
    school: "",
    graduation: "",
    age: "",
    account: "",
    branch: "",
    pincode: "",
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    console.log("Form submitted:", formData);
    handleClose();
  };

  return (
    <Modal show={show} size="xl" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Multi-Section Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {currentSection === 1 && (
            <>
              <h5>Primary Details</h5>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formMobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPlace">
                <Form.Label>Place</Form.Label>
                <Form.Control
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {currentSection === 2 && (
            <>
              <h5>Secondary Details</h5>
              <Form.Group controlId="formSchool">
                <Form.Label>School</Form.Label>
                <Form.Control
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formGraduation">
                <Form.Label>Graduation</Form.Label>
                <Form.Control
                  type="text"
                  name="graduation"
                  value={formData.graduation}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {currentSection === 3 && (
            <>
              <h5>Final Details</h5>
              <Form.Group controlId="formAccount">
                <Form.Label>Account</Form.Label>
                <Form.Control
                  type="text"
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBranch">
                <Form.Label>Branch</Form.Label>
                <Form.Control
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPincode">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {currentSection > 1 && (
          <Button variant="secondary" onClick={handlePrevious}>
            Previous
          </Button>
        )}
        {currentSection < 3 && (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {currentSection === 3 && (
          <Button variant="success" onClick={handleSubmit}>
            Submit
          </Button>
        )}
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MultiSectionFormModal;
