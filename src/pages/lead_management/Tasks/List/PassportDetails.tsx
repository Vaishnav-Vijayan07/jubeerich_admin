import React, { useEffect } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import ActionButton from "./ActionButton";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import validateFields from "../../../../helpers/validateHelper";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";
import { regrexValidation } from "../../../../utils/regrexValidation";
import useRemoveFromApi from "../../../../hooks/useRemoveFromApi";
import { useHistoryModal } from "../../../../hooks/useHistoryModal";
import FieldHistoryTable from "../../../../components/FieldHistory";

interface Props {
  studentId: string | number;
  getPercentage?: () => void;
}

const initialPassportState = {
  name_change: "",
  number_of_passports: 1,
  passports: [
    {
      passport_number: "",
      date_of_expiry: "",
      errors: {},
    },
  ],

  original_passports_in_hand: true,
  missing_passport_reason: "",
  visa_immigration_history: true,
};

const PassportDetails = ({ studentId, getPercentage }: Props) => {
  const { historyModal, toggleHistoryModal } = useHistoryModal();
  const [initialLoading, setInitialLoading] = React.useState(false);
  const [passportDetails, setPassportDetails] = React.useState<any>(initialPassportState);

  const fetchPassportDetails = async () => {
    setInitialLoading(true);
    try {
      const { data } = await axios.get(`passport_details/${studentId}`);

      data.data ? setPassportDetails(data.data) : setPassportDetails(initialPassportState);
    } catch (error) {
      console.error("Error fetching passport details:", error);
    } finally {
      setInitialLoading(false);
      getPercentage && getPercentage();
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchPassportDetails();
    }
  }, []);

  const handleInputChange = (e: any, index?: number) => {
    const { name, value } = e.target;

    console.log(name, value);

    // Convert the passport number to uppercase if the name matches 'passport_number' (or the appropriate field name)
    let updatedValue = value;
    if (name === "passport_number") {
      updatedValue = value.toUpperCase(); // Convert to uppercase
    }

    // Validate the value using the regex function
    if (!regrexValidation(name, updatedValue.toString())) {
      console.error(`Invalid ${name}: ${updatedValue}`);
      return; // Stop updating if validation fails
    }

    if (index !== undefined) {
      // Handle change for a specific passport in the passports array
      const updatedPassports = [...passportDetails.passports];
      updatedPassports[index] = {
        ...updatedPassports[index],
        [name]: updatedValue, // Use the updated value (uppercase if passport_number)
      };
      setPassportDetails((prev: any) => ({
        ...prev,
        passports: updatedPassports,
      }));
    } else {
      // Handle change for number_of_passports or other top-level fields
      setPassportDetails((prev: any) => ({
        ...prev,
        [name]: updatedValue, // Use the updated value (uppercase if passport_number)
      }));
    }
  };

  const handleAddMorePassport = () => {
    const { number_of_passports, passports } = passportDetails;

    // Show error if no passport added when number_of_passports is greater than 0
    if (number_of_passports === 0) {
      showErrorAlert("Please add at least one passport.");
      return;
    }

    // Limit to the number of passports specified
    if (passports.length >= number_of_passports) {
      showErrorAlert("Cannot add more passports than the specified number.");
      return;
    }

    setPassportDetails((prev: any) => ({
      ...prev,
      passports: [
        ...prev.passports,
        {
          passport_number: "",
          date_of_expiry: "",
          errors: {},
        },
      ],
    }));
  };

  const removePassportFromApi = async (passportItem: any) => {
    const passportId = passportDetails.id;

    try {
      const result = await swal.fire({
        title: "Confirm Action",
        text: `Do you want to delete?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, Delete`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#8B8BF5", // Purple color for confirm button
        cancelButtonColor: "#E97777", // Pink/red color for cancel button
        buttonsStyling: true,
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "btn btn-lg px-4 rounded-3 order-2 hover-custom",
          cancelButton: "btn btn-lg px-4 rounded-3 order-1 hover-custom",
          title: "fs-2 fw-normal mb-2",
        },
        width: "26em",
        padding: "2em",
      });

      if (result.isConfirmed) {
        try {
          const res = await axios.patch(`passport_item/${passportId}/${passportItem}`, {
            headers: {
              "Content-Type": "application/json", // Assuming no file data is sent
            },
          });
          console.log("Response: =>", res);
          showSuccessAlert(res.data.message);
        } catch (err) {
          console.error(err);
          showErrorAlert("Error occurred");
        } finally {
          fetchPassportDetails();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removePassport = (index: number, itemId: any) => {
    if (itemId === 0) {
      const { passports } = passportDetails;
      const updatedPassports = [...passports];
      updatedPassports.splice(index, 1);
      setPassportDetails((prev: any) => ({
        ...prev,
        passports: updatedPassports,
        number_of_passports: updatedPassports.length,
      }));
    } else {
      removePassportFromApi(itemId);
    }
  };

  const savePassportDetails = async () => {
    const validationRules = {
      date_of_expiry: { required: true, message: "Please select a date of expiry" },
      passport_number: {
        required: true,
        message: "Please enter a passport number",
        format: /^[A-Z0-9]{8,10}$/, // Example: Passport number must be alphanumeric and 8-10 characters long
        formatMessage: "Passport number must be alphanumeric and 8-10 characters long",
      },
    };

    const { errors, isValid } = validateFields(passportDetails.passports, validationRules);

    if (!isValid) {
      setPassportDetails((prev: any) => ({
        ...prev,
        passports: [
          ...prev.passports.map((item: any, index: any) => ({
            ...item,
            errors: errors[index],
          })),
        ],
      }));
      return;
    }

    if (passportDetails.passports.length < passportDetails.number_of_passports) {
      showErrorAlert(`Please add ${passportDetails.number_of_passports} passports`);
      return;
    }

    const result = await swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save",
    });

    if (result.isConfirmed) {
      try {
        if (passportDetails.id) {
          const { data } = await axios.put(`passport_details/${studentId}`, passportDetails);
          fetchPassportDetails();
          showSuccessAlert(data.message);
          setPassportDetails((prev: any) => ({
            ...prev,
            passports: prev.passports.map((passport: any) => ({
              ...passport,
              errors: {}, // Clear errors for each passport
            })),
          }));
        } else {
          const { data } = await axios.post(`passport_details`, {
            original_passports_in_hand: passportDetails.original_passports_in_hand,
            missing_passport_reason: passportDetails.missing_passport_reason,
            visa_immigration_history: passportDetails.visa_immigration_history,
            name_change: passportDetails.name_change,
            number_of_passports: passportDetails.number_of_passports,
            passports: passportDetails.passports,
            user_id: studentId,
          });
          fetchPassportDetails();
          showSuccessAlert(data.message);
        }
      } catch (error) {
        console.error("Error saving passport details:", error);
        showErrorAlert("Error occurred while saving passport details");
      } finally {
        setPassportDetails((prev: any) => ({
          ...prev,
          passports: prev.passports.map((passport: any) => ({
            ...passport,
            errors: {}, // Clear errors for each passport
          })),
        }));
      }
    }
  };


  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
              <FieldHistoryTable apiUrl={"passport_details"} studentId={studentId} />
            </Modal.Body>
          </Modal>

          <Row className="mb-2">
            <div className="d-flex justify-content-between">
              <h5 className="mb-4 text-uppercase">
                <i className="mdi mdi-account-circle me-1"></i>Passport Details
              </h5>

              <Button
                className="btn-sm btn-secondary waves-effect waves-light float-end me-2"
                onClick={toggleHistoryModal}
                style={{ height: "fit-content" }}
              >
                <i className="mdi mdi-history"></i> View History
              </Button>
            </div>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId={`number_of_passports`}>
                <Form.Label>Number of Passports</Form.Label>
                <FormInput
                  type="number"
                  name="number_of_passports"
                  placeholder="Enter number of passports"
                  onChange={handleInputChange}
                  value={passportDetails?.number_of_passports}
                  min="1" // Ensure the user can't enter less than 1
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId={`name_change`}>
                <Form.Label>Name change ( if any )when compared to other documents</Form.Label>
                <FormInput
                  type="text"
                  name="name_change"
                  placeholder="Enter details"
                  onChange={handleInputChange}
                  value={passportDetails?.name_change}
                />
              </Form.Group>
            </Col>
          </Row>
          {passportDetails?.passports?.map((passport: any, index: number) => (
            <Row key={index}>
              <>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId={`passport_number_${index}`}>
                    <Form.Label>
                      <span className="text-danger fs-4">* </span> Passport Number
                      <small className="text-muted ms-1">( Use only capital letters and numbers)</small>
                    </Form.Label>
                    <FormInput
                      type="text"
                      name="passport_number"
                      placeholder="Enter passport number"
                      onChange={(e) => handleInputChange(e, index)} // Pass the index to the handler
                      value={passport.passport_number}
                    />
                    {passport?.errors?.passport_number && <Form.Text className="text-danger">{passport?.errors?.passport_number}</Form.Text>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId={`date_of_expiry_${index}`}>
                    <Form.Label>
                      <span className="text-danger fs-4">* </span> Date of Expiry
                    </Form.Label>
                    <FormInput
                      type="date"
                      name="date_of_expiry"
                      placeholder="Enter date of expiry"
                      onChange={(e) => handleInputChange(e, index)} // Pass the index to the handler
                      value={moment(passport.date_of_expiry).format("YYYY-MM-DD")}
                    />

                    {passport?.errors?.date_of_expiry && <Form.Text className="text-danger">{passport?.errors?.date_of_expiry}</Form.Text>}
                  </Form.Group>
                </Col>
                <Row>
                  {passportDetails?.passports.length > 1 && (
                    <ActionButton
                      onClick={() => removePassport(index, passport?.passport_id ?? 0)}
                      colorClass="text-danger"
                      iconClass="mdi mdi-delete"
                      label="Remove"
                    />
                  )}
                </Row>
              </>
            </Row>
          ))}
          <Row>
            <ActionButton label="Add More" iconClass="mdi mdi-plus" onClick={handleAddMorePassport} />
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Do you have all your original passports in hand?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    type="radio"
                    name="original_passports_in_hand"
                    value="yes"
                    checked={passportDetails?.original_passports_in_hand === true}
                    onChange={() =>
                      setPassportDetails((prev: any) => ({
                        ...prev,
                        original_passports_in_hand: true,
                      }))
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="radio"
                    name="original_passports_in_hand"
                    value="no"
                    checked={passportDetails?.original_passports_in_hand === false}
                    onChange={() =>
                      setPassportDetails((prev: any) => ({
                        ...prev,
                        original_passports_in_hand: false,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Any visa stamping / immigration history in the current and previous passport?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    type="radio"
                    name="visa_immigration_history"
                    value="yes"
                    checked={passportDetails?.visa_immigration_history === true}
                    onChange={() =>
                      setPassportDetails((prev: any) => ({
                        ...prev,
                        visa_immigration_history: true,
                      }))
                    }
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="radio"
                    name="visa_immigration_history"
                    value="no"
                    checked={passportDetails?.visa_immigration_history === false}
                    onChange={() =>
                      setPassportDetails((prev: any) => ({
                        ...prev,
                        visa_immigration_history: false,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {!passportDetails?.original_passports_in_hand && (
              <Col md={6}>
                <Form.Group className="mb-3" controlId={`missing_passport_reason`}>
                  <Form.Label>Reason for not having</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="missing_passport_reason"
                    placeholder="Enter reason for not having original passport"
                    onChange={handleInputChange}
                    value={passportDetails?.missing_passport_reason}
                    rows={3}
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row className="mt-4"></Row>

          <Row>
            <Button variant="primary" className="mt-4" type="submit" onClick={savePassportDetails}>
              Save
            </Button>
          </Row>
        </>
      )}
    </>
  );
};

export default PassportDetails;
