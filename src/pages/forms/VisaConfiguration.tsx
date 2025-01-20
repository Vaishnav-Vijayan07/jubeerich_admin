import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
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
    id: number;
    step_name: string;
  }>;
}

interface FormData {
  visa_checklist_ids: number[];
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

  const validationSchema = yup.object().shape({
    visa_checklist_ids: yup.array().min(1, "At least one checklist must be selected").required("Visa checklist is required"),
    country_id: yup.string().required("Country is required"),
  });
  // Add console logs to track state changes
  useEffect(() => {
    console.log("FormData changed:", formData);
    console.log("Selected Checklists changed:", selectedChecklists);
  }, [formData, selectedChecklists]);

  const handleUpdate = (item: TableRecords) => {
    console.log("Updating with item:", item); // Debug log

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

      console.log("Selected options created:", selectedOptions); // Debug log

      // First update the checklists state
      setSelectedChecklists(selectedOptions);

      // Then update the form data
      setFormData({
        visa_checklist_ids: item.visa_checklists.map((c) => c.id),
        country_id: item.id.toString(),
      });

      console.log("Form data set to:", {
        visa_checklist_ids: item.visa_checklists.map((c) => c.id),
        country_id: item.id.toString(),
      }); // Debug log
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
                visa_checklist_ids: formData.visa_checklist_ids,
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

  const handleChecklistChange = (selected: any) => {
    console.log("Checklist change:", selected); // Debug log

    setSelectedChecklists(selected);
    setFormData((prev) => {
      const newData = {
        ...prev,
        visa_checklist_ids: selected ? selected.map((option: any) => option.value) : [],
      };
      console.log("Updated form data:", newData); // Debug log
      return newData;
    });
  };

  const toggleResponsiveModal = () => {
    if (responsiveModal) {
      // Modal is closing
      handleResetValues();
    }
    setResponsiveModal(!responsiveModal);
  };

  const handleResetValues = () => {
    console.log("Resetting values"); // Debug log
    setFormData(initialState);
    setSelectedChecklists(null);
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
          backdrop="static" // Prevent closing on outside click
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Visa Configuration</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Select
                  className="react-select"
                  options={countries}
                  value={countries?.find((country: any) => country.value.toString() === formData.country_id)}
                  isDisabled={true}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Visa Checklists</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className="react-select"
                  options={visaChecklists}
                  value={selectedChecklists}
                  onChange={handleChecklistChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={toggleResponsiveModal}>
                Close
              </Button>
              <Button type="submit" variant="success">
                Submit
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
          { label: "Master", path: "/settings/master/visa_configuration" },
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
