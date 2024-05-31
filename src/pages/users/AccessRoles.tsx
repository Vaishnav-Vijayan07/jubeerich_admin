import * as yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { ActionMeta, OptionTypeBase, OptionsType } from "react-select";
import makeAnimated from "react-select/animated";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getRoles, addRoles, updateRoles, deleteRoles } from "../../redux/users/roles/actions";
import axios from "axios";
import { AUTH_SESSION_KEY } from "../../constants";

interface TableRecords {
  id: string;
  branch_name: string;
  branch_address: string;
  branch_city: string;
  branch_country: string;
  currency: string;
  updated_by: string;
}

interface OptionType {
  value: string;
  label: string;
}

const sizePerPageList = [
  {
    text: "5",
    value: 5,
  },
];

const initialState = {
  id: "",
  role_name: "",
  power_ids: [],
  updated_by: "",
};

const BasicInputElements = withSwal((props: any) => {
  const animatedComponents = makeAnimated();

  const dispatch = useDispatch<AppDispatch>();
  const { swal, state, powersData, error, loading } = props;
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState({
    role_name: "",
    power_ids: "",
  });

  console.log("formData ====>", formData);

  const validationSchema = yup.object().shape({
    role_name: yup.string().required("Role name is required").min(2, "Role name must be at least 3 characters long"),
    power_ids: yup
      .array()
      .of(yup.number().required())
      .min(1, "Choose at least one user power")
      .required("Choose at least one user power"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  //handling update logic
  const handleUpdate = (item: any) => {
    const selectedPowerIds = item?.power_ids.split(",").map((id: string) => ({
      value: id.replace(/\s/g, ""),
      label: powersData?.find((power: any) => power.value == parseInt(id))?.label,
    }));

    setSelectedOptions(selectedPowerIds);

    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      role_name: item.role_name,
      power_ids: item?.power_ids,
      updated_by: item.updated_by,
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
          dispatch(deleteRoles(id));
          // swal.fire("Deleted!", "Your item has been deleted.", "success");
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

  const handleSelectChange = (
    selectedOptions: OptionType[] | OptionsType<OptionType> | null,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedOptions(selectedOptions);
      // const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      const selectedIdsArray = selectedOptions?.map((option) => option.value);
      setFormData((prev: any) => ({
        ...prev,
        power_ids: selectedIdsArray,
      }));
    }
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      // Validation passed, handle form submission
      if (isUpdate) {
        // Handle update logic
        if (userInfo) {
          const { user_id } = JSON.parse(userInfo);
          dispatch(updateRoles(formData.id, formData.role_name, formData.power_ids, user_id));
          setIsUpdate(false);
        }
      } else {
        // Handle add logic
        if (userInfo) {
          const { user_id } = JSON.parse(userInfo);
          dispatch(addRoles(formData.role_name, formData.power_ids, user_id));
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
      Header: "ID",
      accessor: "id",
      sort: true,
    },
    {
      Header: "Role Name",
      accessor: "role_name",
      sort: true,
    },
    {
      Header: "Power Names", // Add a new column for the array field
      accessor: "power_names", // Accessor for the new field
      sort: false,
      // You can define the Cell as needed for displaying the array
      Cell: ({ row }: any) => (
        <div>{row.original?.power_names?.join(", ")}</div> // Display array values as comma-separated
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      sort: false,
      Cell: ({ row }: any) => (
        <div>{row.original.status ? "active" : "inactive"}</div> // Display array values as comma-separated
      ),
    },
    {
      Header: "Updated By",
      accessor: "updatedByUser",
      sort: false,
      Cell: ({ row }: any) => (
        <div>{row.original?.updatedByUser?.name}</div> // Display array values as comma-separated
      ),
    },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* Edit Icon */}
          <FeatherIcons
            icon="edit"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => {
              handleUpdate(row.original);
              toggleResponsiveModal();
              clearValidationErrors();
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons
            icon="trash-2"
            size="15"
            className="cursor-pointer text-secondary"
            onClick={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
    setSelectedOptions([]);
  };

  const clearValidationErrors = () => {
    setValidationErrors((prev) => ({
      ...prev,
      role_name: "",
      power_ids: "",
    }));
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    clearValidationErrors();
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  useEffect(() => {
    // Check for errors and clear the form
    if (!loading && !error) {
      setResponsiveModal(false);
      setFormData(initialState);
      setSelectedOptions([]);
      // Clear validation errors
      setValidationErrors((prev) => ({
        ...prev,
        role_name: "",
        power_ids: "",
      }));
    }
  }, [loading, error]);

  return (
    <>
      <Row className="justify-content-between px-2">
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Role Management</h4>
            </Modal.Header>
            <Modal.Body>
              {/* <Col lg={4} className="bg-white p-3 max-height"> */}
              <Form.Group className="mb-3" controlId="role_name">
                <Form.Label for="role_name">Role Name</Form.Label>
                <Form.Control type="text" name="role_name" value={formData.role_name} onChange={handleInputChange} />
                {validationErrors.role_name && (
                  <Form.Text className="text-danger">{validationErrors.role_name}</Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="power_ids">
                <Form.Label>Powers</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={powersData}
                  value={selectedOptions}
                  onChange={handleSelectChange as any}
                  error={validationErrors.power_ids}
                />
                {validationErrors.power_ids && (
                  <Form.Text className="text-danger">{validationErrors.power_ids}</Form.Text>
                )}
              </Form.Group>
              {/* </Col> */}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => (isUpdate ? [toggleResponsiveModal(), handleCancelUpdate()] : toggleResponsiveModal())}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1 waves-effect waves-light">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Access Roles
              </Button>
              <h4 className="header-title mb-4">Manage Acces Roles</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={5}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const AccessRoles = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [powers, setPowers] = useState([]);

  //Fetch data from redux store
  const { state, error, loading } = useSelector((state: RootState) => ({
    state: state.Roles.roles,
    error: state.Roles.error,
    loading: state.Roles.loading,
  }));

  useEffect(() => {
    dispatch(getRoles());

    axios.get("access_powers").then((res) => {
      const data = res?.data;

      const Array = data?.map((item: any) => ({
        value: item.id.toString(), // Convert id to string or whatever unique identifier you have
        label: item.power_name, // Use the appropriate field from your API response
      }));
      setPowers(Array);
    });
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "User Management", path: "/user_management/access_roles" },
          {
            label: "Access Roles",
            path: "/user_management/access_roles",
            active: true,
          },
        ]}
        title={"Access Roles"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} powersData={powers} error={error} loading={loading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default AccessRoles;
