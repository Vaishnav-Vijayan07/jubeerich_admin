import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Dropdown, Modal, Spinner } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { AUTH_SESSION_KEY } from "../../constants";
import { addFlag, deleteFlag, getFlag, updateFlag } from "../../redux/flag/actions";
import { Link } from "react-router-dom";
import InputColor from "react-input-color";
import { regrexValidation } from "../../utils/regrexValidation";
import { useHistoryModal } from "../../hooks/useHistoryModal";
const HistoryTable = React.lazy(() => import("../../components/HistoryTable"));

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
  flag_name: "",
  flag_description: "",
  color: "",
  updated_by: "",
};

const initialValidationState = {
  flag_name: "",
  flag_description: "",
  color: "",
  source_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { historyModal, toggleHistoryModal } = useHistoryModal();
  const { swal, state, sourceData, error, loading, initialLoading } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //Table data
  const records: TableRecords[] = state;

  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedSource, setSelectedSource] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState(initialState);
  const [updateColor, setupdateColor] = useState<string | null>(null);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);

  const validationSchema = yup.object().shape({
    flag_name: yup.string().required("Flag name is required").min(3, "Flag name must be at least 3 characters long"),
    flag_description: yup.string(),
    // .required("Flag description is required")
    // .min(3, "Flag description must be at least 3 characters long"),
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
    const updatedSource: OptionType[] = sourceData?.filter((source: any) => source.value == item.source_id);
    setSelectedSource(updatedSource[0]);
    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      flag_name: item?.flag_name,
      flag_description: item?.flag_description,
      updated_by: "",
    }));

    setIsUpdate(true);
  };

  //handle delete function
  const handleDelete = (id: string) => {
    swal
      .fire({
        title: "Confirm Action",
        text: `Do you want to delete this flag?`,
        icon: "question",
        iconColor: "#8B8BF5", // Purple color for the icon
        showCancelButton: true,
        confirmButtonText: `Yes, delete it!`,
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
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          dispatch(deleteFlag(id));
          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
  };

  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (!regrexValidation(name, value)) {
      console.error(`Invalid ${name}: ${value}`);
      return; // Stop updating if validation fails
    }

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
          title: "Confirm Action",
          text: `Do you want to ${isUpdate ? "update" : "create"} this flag?`,
          icon: "question",
          iconColor: "#8B8BF5", // Purple color for the icon
          showCancelButton: true,
          confirmButtonText: `Yes, ${isUpdate ? "Update" : "Create"}`,
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
        })
        .then((result: any) => {
          if (result.isConfirmed) {
            if (userInfo) {
              const { user_id } = JSON.parse(userInfo);
              if (isUpdate) {
                // Handle update logic
                dispatch(updateFlag(formData.id, formData.flag_name, formData.flag_description, formData.color, user_id));
                setIsUpdate(false);
              } else {
                // Handle add logic
                dispatch(addFlag(formData.flag_name, formData.flag_description, formData.color, user_id));
              }
            }
          }
        });
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
      sort: false,
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
    },
    {
      Header: "Flag Name",
      accessor: "flag_name",
      sort: true,
    },
    {
      Header: "Flag Description",
      accessor: "flag_description",
      sort: false,
    },
    {
      Header: "Color",
      accessor: "color",
      sort: false,
      Cell: ({ row }: any) => (
        <div
          style={{
            width: "40px",
            height: "15px",
            backgroundColor: `${row.original.color}`,
          }}
        />
      ),
    },
    // {
    //   Header: "Source",
    //   accessor: "source_name",
    //   sort: false,
    // },
    {
      Header: "Actions",
      accessor: "",
      sort: false,
      maxWidth: 10,
      Cell: ({ row }: any) => (
        <div className="">
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
          <Link to="#" className="action-icon" onClick={() => handleDelete(row.original.id)}>
            <i className="mdi mdi-delete-outline"></i>
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
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Flag Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="channel_name">
                <Form.Label>Flag Name</Form.Label>
                <Form.Control type="text" name="flag_name" value={formData.flag_name} onChange={handleInputChange} />
                {validationErrors.flag_name && <Form.Text className="text-danger">{validationErrors.flag_name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="color">
                <Form.Label>Color</Form.Label>
                <br />
                <InputColor
                  initialValue={updateColor ? updateColor : "#5e72e4"}
                  onChange={(e) =>
                    setFormData((prevData: any) => ({
                      ...prevData,
                      color: e.rgba,
                    }))
                  }
                  placement="right"
                />
                {/* {validationErrors.color && <Form.Text className="text-danger">{validationErrors.color}</Form.Text>} */}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_description">
                <Form.Label>Flag Description</Form.Label>
                <Form.Control as="textarea" rows={5} name="flag_description" value={formData.flag_description} onChange={handleInputChange} />
                {validationErrors.flag_description && <Form.Text className="text-danger">{validationErrors.flag_description}</Form.Text>}
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" id="button-addon2" className="mt-1 ms-2" onClick={() => [handleResetValues()]}>
                Clear
              </Button>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-1 "
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : [toggleResponsiveModal(), handleResetValues()])}
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

        <Modal show={historyModal} onHide={toggleHistoryModal} centered dialogClassName={"modal-full-width"} scrollable>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body style={{ margin: "0 !important", padding: "0 !important" }}>
            <HistoryTable apiUrl={"flag"} />
          </Modal.Body>
        </Modal>

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Flag
              </Button>

              <Button className="btn-sm btn-secondary waves-effect waves-light float-end me-2" onClick={toggleHistoryModal}>
                <i className="mdi mdi-history"></i> View History
              </Button>
              <h4 className="header-title mb-4">Manage Flags</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
                initialLoading={initialLoading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const Flag = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [sourceData, setSourceData] = useState([]);

  //Fetch data from redux store
  const { state, error, loading, initialLoading } = useSelector((state: RootState) => ({
    state: state.Flag.flags,
    error: state.Flag.error,
    loading: state.Flag.loading,
    initialLoading: state.Flag.initialLoading,
  }));

  const Source = useSelector((state: RootState) => state?.Source?.sources?.data);

  useEffect(() => {
    dispatch(getFlag());
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

  // if (initialLoading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "50%", left: "50%" }}
  //     />
  //   );
  // }

  return (
    <React.Fragment>
      <PageTitle breadCrumbItems={[{ label: "Flags", path: "/settings/master/flag", active: true }]} title={"Flags"} />
      <Row>
        <Col>
          <BasicInputElements state={state} sourceData={sourceData} error={error} loading={loading} initialLoading={initialLoading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Flag;
