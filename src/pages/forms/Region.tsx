import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
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
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import {
  addRegion,
  deleteRegion,
  getRegion,
  getRegionManagers,
  updateRegion,
} from "../../redux/regions/actions";
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
  region_name: "",
  region_description: "",
  regional_manager_id: "",
  updated_by: "",
};

const initialValidationState = {
  region_name: "",
  region_description: "",
  regional_manager_id: "",
  updated_by: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, mangersData, error, loading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [formData, setFormData] = useState(initialState);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(
    initialValidationState
  );

  const validationSchema = yup.object().shape({
    region_name: yup
      .string()
      .required("channel name is required")
      .min(3, "channel name must be at least 3 characters long"),
    region_description: yup
      .string()
      .required("channel description is required")
      .min(3, "channel description must be at least 3 characters long"),
    regional_manager_id: yup
      .string()
      .required("Please choose a regional manger"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    const updatedManager: OptionType[] = mangersData?.filter(
      (manager: any) => manager.value == item.regional_manager_id
    );
    setSelectedManager(updatedManager[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      region_name: item?.region_name,
      region_description: item?.region_description,
      regional_manager_id: item?.regional_manager_id,
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
          dispatch(deleteRegion(id));
          if (isUpdate) {
            setFormData(initialState);
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

    console.log(formData);

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // Validation passed, handle form submission

      swal
        .fire({
          title: "Are you sure?",
          text: "This action cannot be undone.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: `Yes, ${isUpdate ? 'Update' : 'Create'}`,
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            if (userInfo) {
              const { user_id } = JSON.parse(userInfo);
              if (isUpdate) {
                // Handle update logic
                dispatch(
                  updateRegion(
                    formData.id,
                    formData.region_name,
                    formData.region_description,
                    formData.regional_manager_id,
                    user_id
                  )
                );
                setIsUpdate(false);
              } else {
                // Handle add logic
                dispatch(
                  addRegion(
                    formData.region_name,
                    formData.region_description,
                    formData.regional_manager_id,
                    user_id
                  )
                );
              }
            }
          }
        });

      // if (userInfo) {
      //   const { user_id } = JSON.parse(userInfo);
      //   if (isUpdate) {
      //     // Handle update logic
      //     dispatch(
      //       updateRegion(
      //         formData.id,
      //         formData.region_name,
      //         formData.region_description,
      //         formData.regional_manager_id,
      //         user_id
      //       )
      //     );
      //     setIsUpdate(false);
      //   } else {
      //     // Handle add logic
      //     dispatch(
      //       addRegion(
      //         formData.region_name,
      //         formData.region_description,
      //         formData.regional_manager_id,
      //         user_id
      //       )
      //     );
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
      Header: "Region Name",
      accessor: "region_name",
      sort: true,
    },
    {
      Header: "Regional Manager",
      accessor: "regional_manager",
      sort: false,
    },
    {
      Header: "Slug",
      accessor: "slug",
      sort: false,
    },
    {
      Header: "Region Description",
      accessor: "region_description",
      sort: false,
    },
    // {
    //   Header: "Source",
    //   accessor: "source_name",
    //   sort: false,
    // },
    {
      Header: " ",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => {
              setIsUpdate(true);
              handleUpdate(row.original);
              toggleResponsiveModal();
            }}
          >
            <i className="mdi mdi-square-edit-outline"></i>
          </Link>

          {/* Delete Icon */}
          <Link
            to="#"
            className="action-icon"
            onClick={() => handleDelete(row.original.id)}
          >
            <i className="mdi mdi-delete-outline"></i>
            {/* <i className="mdi mdi-delete"></i> */}
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
  const handleManagerChange = (selected: any) => {
    setSelectedManager(selected);
    setFormData((prev) => ({
      ...prev,
      regional_manager_id: selected.value,
    }));
  };

  const handleResetValues = () => {
    setValidationErrors(initialValidationState); // Clear validation errors
    setFormData(initialState); //clear form data
    setSelectedManager(null);
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
      setSelectedManager(null);
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
              <h4 className="modal-title">Region Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Region Name</Form.Label>
                <Form.Control
                  type="text"
                  name="region_name"
                  value={formData.region_name}
                  onChange={handleInputChange}
                />
                {validationErrors.region_name && (
                  <Form.Text className="text-danger">
                    {validationErrors.region_name}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_description">
                <Form.Label>Region Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="region_description"
                  value={formData.region_description}
                  onChange={handleInputChange}
                />
                {validationErrors.region_description && (
                  <Form.Text className="text-danger">
                    {validationErrors.region_description}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="source_id">
                <Form.Label>Regional Manger</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  classNamePrefix="react-select"
                  name="regional_manager_id"
                  options={[{ value: null, label: "None" }, ...mangersData]}
                  value={selectedManager}
                  onChange={handleManagerChange}
                />

                {validationErrors.regional_manager_id && (
                  <Form.Text className="text-danger">
                    {validationErrors.regional_manager_id}
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 "
                onClick={() => [handleResetValues()]
                }
              >
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1"
                onClick={() =>
                  isUpdate
                    ? [handleCancelUpdate(), toggleResponsiveModal()]
                    : [toggleResponsiveModal(), handleResetValues()]
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
                <i className="mdi mdi-plus-circle"></i> Add Region
              </Button>
              <h4 className="header-title mb-4">Manage Regions</h4>
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

const Region = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [mangersData, setMangersData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading, regional_managers } =
    useSelector((state: RootState) => ({
      state: state.Region.regions,
      regional_managers: state.Region.regional_managers,
      error: state.Region.error,
      loading: state.Region.loading,
      initialLoading: state.Region.initialLoading,
    }));

  // const Source = useSelector(
  //   (state: RootState) => state?.Source?.sources?.data
  // );

  useEffect(() => {
    dispatch(getRegion());
    dispatch(getRegionManagers());
  }, []);

  useEffect(() => {
    if (regional_managers) {
      const managersArray = regional_managers?.map((manager: any) => ({
        value: manager.id.toString(),
        label: manager.name, // Replace with the appropriate field from the lead data
      }));
      setMangersData(managersArray);
    }
  }, [regional_managers]);

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
          { label: "Master", path: "/master/regions" },
          { label: "Regions", path: "/master/regions", active: true },
        ]}
        title={"Regions"}
      />
      <Row>
        <Col>
          <BasicInputElements
            state={state}
            mangersData={mangersData}
            error={error}
            loading={loading}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Region;
