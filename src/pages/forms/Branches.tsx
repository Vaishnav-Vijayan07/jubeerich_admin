import * as yup from "yup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";
import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Country, City, ICity } from "country-state-city";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addBranches, deleteBranches, getBranches, updateBranches } from "../../redux/branches/actions";
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

const sizePerPageList = [
  {
    text: "5",
    value: 5,
  },
];

const initialState = {
  id: "",
  branch_name: "",
  branch_address: "",
  branch_city: "",
  branch_country: "",
  currency: "",
  updated_by: "",
};

const initialValidationState = {
  branch_name: "",
  branch_address: "",
  branch_city: "",
  branch_country: "",
  currency: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, state } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);
  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  // Country and city
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [cities, setCities] = useState<ICity[] | undefined>(undefined);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);
  
  const options = useMemo(() => Country.getAllCountries(), []);

  const validationSchema = yup.object().shape({
    branch_name: yup.string().required("branch name is required").min(3, "branch name must be at least 3 characters long"),
    branch_address: yup.string().required("branch description is required").min(3, "branch description must be at least 3 characters long"),
    branch_city: yup.string().required("branch city is required"),
    branch_country: yup.string().required("branch country is required"),
    currency: yup.string().required("branch country is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  //handling update logic
  const handleUpdate = (item: any) => {
    const selected = options?.find((country) => country.name === item?.branch_country);
    if (selected) {
      setSelectedCountry(selected.isoCode);
    } else {
      setSelectedCountry("");
    }

    setFormData({
      id: item?.id,
      branch_name: item.branch_name,
      branch_address: item.branch_address,
      branch_city: item.branch_city,
      branch_country: item.branch_country,
      currency: item.currency,
      updated_by: item.updated_by,
    });

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
          dispatch(deleteBranches(id));
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
          dispatch(updateBranches(formData.id, formData.branch_name, formData.branch_address, formData.branch_country, formData.branch_city, formData.currency, user_id));
          setIsUpdate(false);
        } else {
          // Handle add logic
          dispatch(addBranches(formData.branch_name, formData.branch_address, formData.branch_country, formData.branch_city, formData.currency, user_id));
        }
      }

      // Clear validation errors
      setValidationErrors({
        branch_name: "",
        branch_address: "",
        branch_city: "",
        branch_country: "",
        currency: "",
      });

      //clear form data
      setFormData(initialState);

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
      Header: "Branch Name",
      accessor: "branch_name",
      sort: true,
    },
    {
      Header: "Address",
      accessor: "branch_address",
      sort: false,
    },
    {
      Header: "City",
      accessor: "branch_city",
      sort: false,
    },
    {
      Header: "Country",
      accessor: "branch_country",
      sort: false,
    },
    {
      Header: "Currency",
      accessor: "currency",
      sort: false,
    },
    {
      Header: "Updated By",
      accessor: "updated_by",
      sort: false,
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
            }}
          />

          {/* Delete Icon */}
          <FeatherIcons icon="trash-2" size="15" className="cursor-pointer text-secondary" onClick={() => handleDelete(row.original.id)} />
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
  };

  const handleCountryChange = (event: any) => {
    const selectedCountryName = event.target.value;
    const selectedCountry = options.find((country) => country.name === selectedCountryName);

    if (selectedCountry) {
      setSelectedCountry(selectedCountry.isoCode); // Update selectedCountry with isoCode
      setFormData({
        ...formData,
        branch_country: selectedCountryName,
        branch_city: "", // Reset the city when country changes
        currency: selectedCountry.currency,
      });
    } else {
      // Handle the case when no matching country is found
      setSelectedCountry(""); // Reset selectedCountry
      setFormData({
        ...formData,
        branch_country: selectedCountryName,
        branch_city: "", // Reset the city when country changes
        currency: "",
      });
    }
  };

  useEffect(() => {
    if (selectedCountry !== null) {
      const fetchCities = async () => {
        const updatedCities = await City.getCitiesOfCountry(selectedCountry);
        setCities(updatedCities);
      };

      fetchCities();
    }
  }, [selectedCountry, isUpdate]);

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if(isUpdate){
      handleCancelUpdate()
    }
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Role Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="branch_name">
                <Form.Label className="">Branch Name</Form.Label>
                <Form.Control type="text" name="branch_name" value={formData.branch_name} onChange={handleInputChange} />
                {validationErrors.branch_name && <Form.Text className="text-danger">{validationErrors.branch_name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="branch_address">
                <Form.Label>Branch Address</Form.Label>
                <Form.Control as="textarea" rows={5} name="branch_address" value={formData.branch_address} onChange={handleInputChange} />
                {validationErrors.branch_address && <Form.Text className="text-danger">{validationErrors.branch_address}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="branch_country">
                <Form.Label>Branch Country</Form.Label>
                <Form.Select aria-label="Default select example" name="branch_country" value={formData.branch_country} onChange={handleCountryChange}>
                  <option value="" disabled>
                    Choose..
                  </option>
                  {options?.map((item: any) => (
                    <option
                      value={item?.name}
                      key={item?.name}
                      onClick={() => setSelectedCountry(item.isoCode)}
                      defaultValue={item.name === formData.branch_country ? item.name : undefined}
                    >
                      {item.name}
                    </option>
                  ))}
                </Form.Select>

                {validationErrors.branch_country && <Form.Text className="text-danger">{validationErrors.branch_country}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="branch_city">
                <Form.Label>Branch City</Form.Label>
                <Form.Select aria-label="Default select example" name="branch_city" value={formData.branch_city} onChange={handleInputChange}>
                  <option value="" disabled>
                    Choose..
                  </option>
                  {cities?.map((item: any, index: number) => (
                    <option value={item?.name} key={index} defaultValue={item.name === formData.branch_country ? item.name : ""}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>

                {validationErrors.branch_city && <Form.Text className="text-danger">{validationErrors.branch_city}</Form.Text>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : toggleResponsiveModal())}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-1">
                {isUpdate ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
          {/* </Col> */}
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Branch
              </Button>
              <h4 className="header-title mb-4">Manage Branch Details</h4>
              <Table columns={columns} data={records ? records : []} pageSize={5} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Branches = () => {
  const dispatch = useDispatch<AppDispatch>();

  //Fetch data from redux store
  const { state } = useSelector((state: RootState) => ({
    state: state.Branches.branches.data,
  }));

  useEffect(() => {
    dispatch(getBranches());
  }, []);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/branches" },
          { label: "Branches", path: "/master/branches", active: true },
        ]}
        title={"Branches"}
      />
      <Row>
        <Col>
          <BasicInputElements state={state} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Branches;
