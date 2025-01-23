import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal, Badge } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getVisaConfiguration } from "../../redux/actions";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { sizePerPageList } from "./data";

interface TableRecords {
  id: number;
  country_name: string;
  visa_checklists: Array<{
    id: string;
    step_name: string;
  }>;
}

interface FormData {
  visa_checklist_ids: string[];
  country_id: string;
}

const initialState: FormData = {
  visa_checklist_ids: [],
  country_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, initialConfigloading, countries, visaChecklists } = props;
  const [formData, setFormData] = useState<FormData>(initialState);
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
  const [selectedChecklists, setSelectedChecklists] = useState<any>(null);
  const animatedComponents = makeAnimated();

  // const validationSchema = yup.object().shape({
  //   visa_checklist_ids: yup.array().min(1, "At least one checklist must be selected").required("Visa checklist is required"),
  //   country_id: yup.string().required("Country is required"),
  // });

  const validationSchema = yup.object().shape({
    visa_checklist_ids: yup
      .array()
      .transform((value, originalValue) => {
        // Handle string representations like [""] and convert to an empty array
        if (typeof originalValue === "string") {
          try {
            const parsedValue = JSON.parse(originalValue);
            return Array.isArray(parsedValue) ? parsedValue : [];
          } catch {
            return [];
          }
        }
        return value;
      })
      .test(
        "non-empty-array",
        "At least one checklist must be selected",
        (value) => Array.isArray(value) && value.filter((item) => item).length > 0
      )
      .required("Visa checklist is required"),
    country_id: yup.string().required("Country is required"),
  });

  const handleUpdate = (item: TableRecords) => {
    if (!item || !item.visa_checklists) {
      console.error("Invalid item data:", item);
      return;
    }

    try {
      // Convert existing visa checklists to react-select format
      const selectedOptions = item.visa_checklists.map((checklist) => ({
        value: checklist.id,
        label: checklist.step_name,
      }));
      // First update the checklists state
      setSelectedChecklists(selectedOptions);

      // Then update the form data
      setFormData({
        visa_checklist_ids: item.visa_checklists.map((c) => c.id),
        country_id: item.id.toString(),
      });
    } catch (error) {
      console.error("Error in handleUpdate:", error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });

      swal
        .fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, update it!`,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            axios
              .put(`/configure_visa`, {
                country_id: formData.country_id,
                visa_checklist_ids: formData.visa_checklist_ids.filter((id) => id !== "" && id !== null && id !== undefined),
              })
              .then((res) => {
                showSuccessAlert(res.data.message);
                dispatch(getVisaConfiguration());
                handleResetValues();
                toggleResponsiveModal();
              })
              .catch((err) => {
                console.error(err);
                showErrorAlert(err.response?.data?.message || "An error occurred");
              });
          }
        });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        showErrorAlert(error.errors[0]);
      }
    }
  };

  const columns = [
    {
      Header: "ID",
      accessor: "id",
      sort: false,
    },
    {
      Header: "Country Name",
      accessor: "country_name",
      sort: true,
    },
    {
      Header: "Checklists",
      accessor: "visa_checklists",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
          {row.original.visa_checklists?.map((item: any) => (
            <li key={item.id}>{item.step_name}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <FeatherIcons
            stroke="#28a745"
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              handleUpdate(row.original);
              toggleResponsiveModal();
            }}
          />
        </div>
      ),
    },
  ];

  const toggleResponsiveModal = () => {
    if (responsiveModal) {
      // Modal is closing
      handleResetValues();
    }
    setResponsiveModal(!responsiveModal);
  };

  const handleResetValues = () => {
    setFormData(initialState);
    setSelectedChecklists(null);
  };

  const handleChecklistChange = (selected: any, index: number) => {
    const updatedChecklists = [...formData.visa_checklist_ids];
    updatedChecklists[index] = selected ? selected.value : null;
    setFormData((prev) => ({
      ...prev,
      visa_checklist_ids: updatedChecklists.filter(Boolean), // Remove null/empty values
    }));
  };

  const addChecklist = () => {
    if (formData.visa_checklist_ids.length < visaChecklists.length) {
      setFormData((prev) => ({
        ...prev,
        visa_checklist_ids: [...prev.visa_checklist_ids, ""],
      }));
    }
  };

  const removeChecklist = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      visa_checklist_ids: prev.visa_checklist_ids.filter((_, i) => i !== index),
    }));
  };

  const getAvailableOptions = (currentIndex: number) => {
    return visaChecklists.filter((option: any) => {
      const isSelected = formData.visa_checklist_ids.some((id, index) => id === option.value && index !== currentIndex);
      return !isSelected;
    });
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered modal-lg"
          backdrop="static"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton className="border-bottom">
              <h4 className="modal-title">Visa Configuration</h4>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Country</Form.Label>
                <Select
                  className="react-select"
                  options={countries}
                  value={countries?.find((country: any) => country.value.toString() === formData.country_id)}
                  isDisabled={true}
                />
              </Form.Group>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label className="fw-bold m-0">Visa Checklists</Form.Label>
                  <Badge className="px-2 py-1">
                    {formData.visa_checklist_ids.length} of {visaChecklists.length} selected
                  </Badge>
                </div>

                <div className="checklist-container border rounded p-3 bg-light">
                  {formData.visa_checklist_ids.map((checklistId, index) => (
                    <div key={index} className="d-flex align-items-center gap-2 mb-3">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">{index + 1}.</span>
                          <Select
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            className="react-select flex-grow-1"
                            options={getAvailableOptions(index)}
                            value={visaChecklists.find((checklist: any) => checklist.value === checklistId)}
                            onChange={(selected) => handleChecklistChange(selected, index)}
                            placeholder="Select checklist item..."
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeChecklist(index)}
                            className="d-flex align-items-center justify-content-center p-1"
                          >
                            <FeatherIcons icon="x" size="16" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.visa_checklist_ids.length < visaChecklists.length && (
                    <Button variant="outline-primary" onClick={addChecklist} className="w-100 mt-2">
                      <FeatherIcons icon="plus" size="16" className="me-1" />
                      Add More Checklist
                    </Button>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-top">
              <Button variant="light" onClick={toggleResponsiveModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={formData.visa_checklist_ids.length === 0}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Rest of your table component */}
        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="header-title">Manage Visa Configuration</h4>
              </div>
              <Table
                columns={columns}
                data={state || []}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
                initialLoading={initialConfigloading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const VisaConfiguration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [countries, setCountries] = useState([]);
  const [visaChecklists, setVisaChecklists] = useState([]);

  const { VisaConfig, initialConfigloading } = useSelector((state: RootState) => ({
    VisaConfig: state.VisaChecklists.visaConfig?.data,
    initialConfigloading: state.VisaChecklists.initialLoading,
  }));

  useEffect(() => {
    dispatch(getVisaConfiguration());
    // Fetch countries and visa checklists for dropdowns
    fetchCountries();
    fetchVisaChecklists();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("/country");
      const formattedCountries = response.data?.data?.map((country: any) => ({
        value: country.id,
        label: country.country_name,
      }));
      setCountries(formattedCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchVisaChecklists = async () => {
    try {
      const response = await axios.get("/visa_ckecklist_master");

      const formattedChecklists = response?.data?.data?.map((checklist: any) => ({
        value: checklist.id,
        label: checklist.step_name,
      }));
      setVisaChecklists(formattedChecklists);
    } catch (error) {
      console.error("Error fetching visa checklists:", error);
    }
  };

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          // { label: "Master", path: "/settings/master/visa_configuration" },
          {
            label: "Visa Config",
            path: "/settings/master/visa_configuration",
            active: true,
          },
        ]}
        title={"Visa Configuration"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={VisaConfig}
            countries={countries}
            visaChecklists={visaChecklists}
            initialConfigloading={initialConfigloading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default VisaConfiguration;
