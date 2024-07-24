import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getSource } from "../../redux/sources/actions";
import {
  addChannel,
  deleteChannel,
  getChannel,
  updateChannel,
} from "../../redux/actions";
import Select from "react-select";
import { AUTH_SESSION_KEY } from "../../constants";
import {
  addOfficeTypeData,
  deleteOfficeTypeData,
  getOfficeTypeData,
  updateOfficeTypeData,
} from "../../redux/OfficeType/actions";
import { Link } from "react-router-dom";

interface OptionType {
  value: string;
  label: string;
}

interface TableRecords {
  id: string;
  source_id: string;
  channel_name: string;
  channel_description: string;
  updated_by: string;
  status: string;
}

const sizePerPageList = [
  {
    text: "10",
    value: 10,
  },
  {
    text: "25",
    value: 25,
  },
  {
    text: "50",
    value: 50,
  },
  {
    text: "100",
    value: 100,
  },
];

const initialState = {
  id: "",
  office_type_name: "",
  office_type_description: "",
  updated_by: "",
};

const initialValidationState = {
  office_type_name: "",
  office_type_description: "",
  updated_by: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, sourceData, error, loading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedSource, setSelectedSource] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    office_type_name: yup
      .string()
      .required("Office name is required")
      .min(3, "Office name must be at least 3 characters long"),
    office_type_description: yup
      .string()
      .required("Office description is required")
      .min(3, "Office description must be at least 3 characters long"),
    // source_id: yup.string().required("Please choose a source"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    //update source dropdown
    // const updatedSource: OptionType[] = sourceData?.filter(
    //   (source: any) => source.value == item.source_id
    // );
    // setSelectedSource(updatedSource[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      office_type_name: item?.office_type_name,
      office_type_description: item?.office_type_description,
      updated_by: "",
    }));

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteOfficeTypeData(id));
          if (isUpdate) {
            setFormData(initialState);
            setSelectedSource(null);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // Validation passed, handle form submission

      if (userInfo) {
        const { user_id } = JSON.parse(userInfo);
        if (isUpdate) {
          // Handle update logic

          dispatch(
            updateOfficeTypeData(
              formData.id,
              formData.office_type_name,
              formData.office_type_description,
              user_id
            )
          );
          setIsUpdate(false);
        } else {
          // Handle add logic

          dispatch(
            addOfficeTypeData(
              formData.office_type_name,
              formData.office_type_description,
              user_id
            )
          );
        }
      }

      // ... Rest of the form submission logic ...
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof yup.ValidationError) {
        const errors: any = {};
        validationError.inner.forEach((error) => {
          if (error.path) {
            errors[error.path] = error.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  const columns = [
    {
      Header: "No",
      accessor: "id",
      sort: true,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Office Name",
      accessor: "office_type_name",
      sort: true,
    },
    {
      Header: "Office Description",
      accessor: "office_type_description",
      sort: false,
    },
    {
      Header: "Slug",
      accessor: "slug",
      sort: false,
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <Link to="#" className="action-icon" onClick={() => {
            setIsUpdate(true);
            handleUpdate(row.original);
            toggleResponsiveModal();
          }}>
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link to="#" className="action-icon" onClick={() =>
            handleDelete(row.original.id)
          }>
            <i className="mdi mdi-delete"></i>
          </Link>
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    handleResetValues();
  };

  //source
  const handleSourceChange = (selected: any) => {
    setSelectedSource(selected);
    setFormData((prev) => ({
      ...prev,
      source_id: selected.value,
    }));
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedSource(null);
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setValidationErrors(initialValidationState); // Clear validation errors
      setFormData(initialState); //clear form data
      setSelectedSource(null);
      // Clear validation errors
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal
          show={responsiveModal}
          onHide={toggleResponsiveModal}
          dialogClassName="modal-dialog-centered"
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Office Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Office Name</Form.Label>
                <Form.Control
                  type="text"
                  name="office_type_name"
                  value={formData.office_type_name}
                  onChange={handleInputChange}
                />
                {validationErrors.office_type_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.office_type_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_description">
                <Form.Label>Office Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="office_type_description"
                  value={formData.office_type_description}
                  onChange={handleInputChange}
                />
                {validationErrors.office_type_description && (
                  <Form.Text className="text-danger">
                    {validationErrors.office_type_description}
                  </Form.Text>
                )}
              </Form.Group>

              {/* <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Source</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="source_id"
                  options={sourceData}
                  value={selectedSource}
                  onChange={handleSourceChange}
                />

                {validationErrors.source_id && (
                  <Form.Text className="text-danger">
                    {validationErrors.source_id}
                  </Form.Text>
                )}
              </Form.Group> */}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() =>
                  isUpdate
                    ? [handleCancelUpdate(), toggleResponsiveModal()]
                    : toggleResponsiveModal()
                }
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button
                type="submit"
                variant="success"
                id="button-addon2"
                className="mt-1"
              >
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button
                className="btn-sm btn-blue waves-effect waves-light float-end"
                onClick={toggleResponsiveModal}
              >
                <i className="mdi mdi-plus-circle"></i> Add Office Type
              </Button>
              <h4 className="header-title mb-4">Manage Office Types</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"

              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const OfficeType = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sourceData, setSourceData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading } = useSelector(
    (state: RootState) => ({
      state: state.OfficeTypes.officeTypes,
      error: state.OfficeTypes.error,
      loading: state.OfficeTypes.loading,
      initialLoading: state.OfficeTypes.initialLoading,
    })
  );

  // const Source = useSelector(
  //   (state: RootState) => state?.Source?.sources?.data
  // );

  useEffect(() => {
    dispatch(getOfficeTypeData());
  }, []);

  // useEffect(() => {
  //   if (Source) {
  //     const SourceArray = Source?.map((source: any) => ({
  //       value: source.id.toString(),
  //       label: source.source_name, // Replace with the appropriate field from the lead data
  //     }));
  //     setSourceData(SourceArray);
  //   }
  // }, [Source]);

  if (initialLoading) {
    return (
      <Spinner
        animation="border"
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  }

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/channels" },
          {
            label: "Office Types ",
            path: "/master/office_types",
            active: true,
          },
        ]}
        title={"Office Types"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            sourceData={sourceData}
            error={error}
            loading={loading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default OfficeType;
