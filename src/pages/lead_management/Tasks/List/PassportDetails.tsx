import React, { useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { FormInput } from "../../../../components";
import ActionButton from "./ActionButton";
import { showErrorAlert, showSuccessAlert } from "../../../../constants";
import swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import validateFields from "../../../../helpers/validateHelper";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";

interface Props {
  studentId: string | number;
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

const PassportDetails = ({ studentId }: Props) => {
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
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchPassportDetails();
    }
  }, []);

  const handleInputChange = (e: any, index?: number) => {
    const { name, value } = e.target;

    if (index !== undefined) {
      // Handle change for a specific passport in the passports array
      const updatedPassports = [...passportDetails.passports];
      updatedPassports[index] = {
        ...updatedPassports[index],
        [name]: value,
      };
      setPassportDetails((prev: any) => ({
        ...prev,
        passports: updatedPassports,
      }));
    } else {
      // Handle change for number_of_passports or other top-level fields
      setPassportDetails((prev: any) => ({
        ...prev,
        [name]: value,
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

  const removePassport = (index: number) => {
    const { passports } = passportDetails;
    const updatedPassports = [...passports];
    updatedPassports.splice(index, 1);
    setPassportDetails((prev: any) => ({
      ...prev,
      passports: updatedPassports,
      number_of_passports: updatedPassports.length,
    }));
  };

  const savePassportDetails = async () => {
    console.log("passportDetails", passportDetails);

    const validationRules = {
      date_of_expiry: { required: true },
      passport_number: { required: true },
    };

    const { errors, isValid } = validateFields(passportDetails.passports, validationRules);

    console.log(errors);
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
      }
    }
  };

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "100%", left: "45%" }}
  //     />
  //   );
  // }

  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Row>
            <h5 className="mb-4 text-uppercase">
              <i className="mdi mdi-account-circle me-1"></i>Passport Details
            </h5>
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
                    <Form.Label>Passport Number</Form.Label>
                    <FormInput
                      type="text"
                      name="passport_number"
                      placeholder="Enter passport number"
                      onChange={(e) => handleInputChange(e, index)} // Pass the index to the handler
                      value={passport.passport_number}
                    />
                    {passport?.errors?.passport_number && (
                      <Form.Text className="text-danger">{passport?.errors?.passport_number}</Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId={`date_of_expiry_${index}`}>
                    <Form.Label>Date of Expiry</Form.Label>
                    <FormInput
                      type="date"
                      name="date_of_expiry"
                      placeholder="Enter date of expiry"
                      onChange={(e) => handleInputChange(e, index)} // Pass the index to the handler
                      value={moment(passport.date_of_expiry).format("YYYY-MM-DD")}
                    />

                    {passport?.errors?.date_of_expiry && (
                      <Form.Text className="text-danger">{passport?.errors?.date_of_expiry}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Row>
                  {passportDetails?.passports.length > 1 && (
                    <ActionButton
                      onClick={() => removePassport(index)}
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
