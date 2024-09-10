import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { ActionMeta, OptionsType } from "react-select";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addSource, deleteSource, getSource, updateSource } from "../../redux/sources/actions";
import { AUTH_SESSION_KEY } from "../../constants";
import { Link } from "react-router-dom";
import { getCategory } from "../../redux/actions";

interface TableRecords {
  id: number;
  source_name: string;
  source_description: string;
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
  source_name: "",
  source_description: "",
  updated_by: "",
  lead_type_id: ""
};

const initialValidationState = {
  source_name: "",
  source_description: "",
  lead_type_id: ""
};

const BasicInputElements = withSwal((props: any) => {
  const [selectedLeadType, setSelectedLeadType] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { swal } = props;
  const { state, loading, error, leadType } = props;

  console.log('leadType 2',leadType);

  //Table data
  const records: TableRecords[] = state;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    source_name: yup
      .string()
      .required("source name is required")
      .min(3, "source name must be at least 3 characters long"),
    lead_type_id: yup
      .string()
      .required("lead type is required"),
    source_description: yup
      .string()
      // .required("source description is required")
      // .min(3, "source description must be at least 3 characters long"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    setFormData({
      id: item?.id,
      source_name: item?.source_name,
      source_description: item?.source_description,
      updated_by: item?.updated_by,
      lead_type_id: item?.lead_type_id
    });

    console.log('leadTypeData',leadType);
    
    
    if(item?.lead_type_id){
      let filtered = leadType.filter((data: any) => data.value == item?.lead_type_id );
      console.log('filtered',filtered);
      setSelectedLeadType(filtered[0]);
    }

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
          dispatch(deleteSource(id));

          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  const handleDropDowns = (selected: any, { name }: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selected.value,
    }));

    switch (name) {
      case "lead_type_id":
        setSelectedLeadType(selected);
      break;
    }
  };


  //handle onchange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Validation passed, handle form submission
      await validationSchema.validate(formData, { abortEarly: false });

      console.log('selectedLeadType',selectedLeadType.value);
      

      swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${isUpdate ? 'Update': 'Create'}`,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          if (userInfo) {
            const { user_id } = JSON.parse(userInfo);
    
            if (isUpdate) {
              // Handle update logic
              dispatch(updateSource(formData.id, formData.source_name, formData.source_description, user_id, formData.lead_type_id));
              setIsUpdate(false);
              handleCancelUpdate(),
              toggleResponsiveModal(),
              handleResetValues()
            } else {
              // Handle add logic
              dispatch(addSource(formData.source_name, formData.source_description, user_id, formData.lead_type_id));
              toggleResponsiveModal(),
              handleResetValues()
            }
          }
        }
      });

      // if (userInfo) {
      //   const { user_id } = JSON.parse(userInfo);

      //   if (isUpdate) {
      //     // Handle update logic
      //     dispatch(updateSource(formData.id, formData.source_name, formData.source_description, user_id, formData.lead_type_id));
      //     setIsUpdate(false);
      //   } else {
      //     // Handle add logic
      //     dispatch(addSource(formData.source_name, formData.source_description, user_id, formData.lead_type_id));
      //   }
      // }

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
      Header: "Lead Source Name",
      accessor: "source_name",
      sort: true,
    },
    {
      Header: "Lead Source Description",
      accessor: "source_description",
      sort: false,
    },
    {
      Header: "Lead Type ",
      accessor: "leadType",
      sort: false,
    },
    {
      Header: "Slug",
      accessor: "slug",
      sort: false,
    },
    {
      Header: " ",
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
            {/* <i className="mdi mdi-delete"></i> */}
            <i className="mdi mdi-delete-outline"></i>
          </Link>
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedLeadType(null)
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      // Clear validation errors
      setValidationErrors(initialValidationState);
      //clear form data
      setFormData(initialState);
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Lead Source Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="source_name">
                <Form.Label>Lead Source Name</Form.Label>
                <Form.Control
                  type="text"
                  name="source_name"
                  value={formData.source_name}
                  onChange={handleInputChange}
                />
                {validationErrors.source_name && (
                  <Form.Text className="text-danger">{validationErrors.source_name}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Lead Type</Form.Label>
                <Select
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="lead_type_id"
                  options={[{ value: null, label: "None" }, ...leadType]}
                  value={selectedLeadType}
                  onChange={handleDropDowns}
                />
                {validationErrors.lead_type_id && (
                  <Form.Text className="text-danger">
                    {validationErrors.lead_type_id}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="source_description">
                <Form.Label>Lead Source Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="source_description"
                  value={formData.source_description}
                  onChange={handleInputChange}
                />
                {validationErrors.source_description && (
                  <Form.Text className="text-danger">{validationErrors.source_description}</Form.Text>
                )}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => ([setFormData(initialState)])}
              >
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 "
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal(), handleResetValues()] : [toggleResponsiveModal(), handleResetValues()])}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Lead Source
              </Button>
              <h4 className="header-title mb-4">Manage Lead Source</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={10}
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

const Sources = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state, leadType, error, loading, initialloading } = useSelector((state: RootState) => ({
    state: state.Source.sources.data,
    leadType: state.Category.category.data,
    error: state.Source.error,
    loading: state.Source.loading,
    initialloading: state.Source.initialloading,
  }));

  console.log('leadType',leadType);

  const leadTypeData = useMemo(() => {
    if (!leadType) return [];
    return leadType.map((item: any) => ({
      value: item?.id.toString(),
      label: item?.name,
    }));
  }, [leadType]);

  console.log('leadType Full',leadTypeData);
  

  useEffect(() => {
    dispatch(getSource());
    dispatch(getCategory())
  }, []);

  if (initialloading) {
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
          { label: "Master", path: "/master/sources" },
          { label: "Lead Sources", path: "/master/sources", active: true },
        ]}
        title={"Lead Sources"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} leadType={leadTypeData} error={error} loading={loading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Sources;
