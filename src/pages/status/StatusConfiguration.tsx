import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { getStatus, getStatusConfig, getSubStatus, updateSubStatus } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import makeAnimated from "react-select/animated";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { ActionMeta, OptionTypeBase, OptionsType } from "react-select";
import axios from "axios";
import { showErrorAlert, showSuccessAlert } from "../../constants";

interface TableRecords {
  id: number;
  status_name: string;
  status_description: string;
  color: string;
}
interface OptionType {
  value: number;
  label: string;
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

const initialValidationState = {
  status_ids: "",
  access_role_id: "",
};

const initialState = {
  status_ids: [],
  access_role_id: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();

  //destructured all items from props
  const { statusData, state, Status, loading, success, error, initialConfigloading } = props;

  //Table data
  const records: TableRecords[] = state;
  const animatedComponents = makeAnimated();
  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  //Input data
  const [formData, setFormData] = useState(initialState);
  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  const [selectedStatus, setSelectedStatus] = useState<OptionType[] | null>([]);

  const validationSchema = yup.object().shape({
    status_ids: yup.array().nullable().required("status is required"),
    access_role_id: yup.string().nullable().required("access role id is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {

    const selectedStatus = item?.statuses?.map((status: any) => ({
      value: status.id,
      label: status.status_name,
    }));

    const statusIds = item?.statuses?.map((item: any) => item.id)

    setSelectedStatus(selectedStatus);
    setFormData({
      status_ids: statusIds,
      access_role_id: item?.id,
    });

    setIsUpdate(true);
  };

  console.log("form data ==>", formData);


  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("here");

      axios
        .put(`/status_config`, {
          access_role_id: formData.access_role_id,
          status_ids: formData?.status_ids
        })
        .then((res) => {
          showSuccessAlert(res.data.message);
          dispatch(getStatusConfig());

          // Clear validation errors
          setValidationErrors(initialValidationState);

          //clear form data
          setFormData(initialState);
          setSelectedStatus(null);
          toggleResponsiveModal()
        })
        .catch((err) => {
          console.error(err);
          showErrorAlert(err.message);
        });
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
      Header: "Statuses",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
          {row.original.statuses?.map((item: any) => (
            <li>{item.status_name}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: " ",
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
        </div>
      ),
    },
  ];

  //handle cancel update section
  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setFormData(initialState);
    setSelectedStatus(null);
  };

  const handleStatusChange = (selectedOptions: OptionType[] | OptionsType<OptionType> | null) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedStatus(selectedOptions);
      const selectedIdsArray = selectedOptions?.map((option) => option.value);
      setFormData((prev: any) => ({
        ...prev,
        status_ids: selectedIdsArray,
      }));
    }
  };

  const toggleResponsiveModal = () => {
    setResponsiveModal(!responsiveModal);
    setValidationErrors(initialValidationState);
    if (isUpdate) {
      handleCancelUpdate()
    }
  };

  const handleResetValues = () => {
    setFormData(initialState);
    setValidationErrors(initialValidationState);
    setSelectedStatus(null);
  }

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={4} className="bg-white p-3 max-height"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Status Configuration</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="status_ids">
                <Form.Label>Status</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className="react-select react-select-container"
                  name="status_ids"
                  classNamePrefix="react-select"
                  options={statusData}
                  value={selectedStatus}
                  onChange={handleStatusChange as any}
                />

                {validationErrors.status_ids && <Form.Text className="text-danger">{validationErrors.status_ids}</Form.Text>}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                id="button-addon2"
                className="mt-1 ms-2"
                onClick={() => [handleResetValues()]
                }
              >
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

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Configure Status
              </Button>
              <h4 className="header-title mb-4">Manage Status Configuration</h4>
              <Table columns={columns} data={records ? records : []} pageSize={5} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});

const StatusConfiguration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusData, setStatusData] = useState([]);

  //Fetch data from redux store
  // const Status = useSelector((state: RootState) => state.Status.status.data);

  const { StatusConfig, Status, loading, success, error, initialConfigloading } = useSelector(
    (state: RootState) => ({
      StatusConfig: state.Status.statusConfig?.data,
      Status: state.Status.status.data,
      loading: state.Status.loading,
      success: state.Status.success,
      error: state.Status.error,
      initialConfigloading: state.Status.initialConfigloading,
    })
  );
  const SubStatus = useSelector((state: RootState) => state.SubStatus.subStatus.data);
  useEffect(() => {
    dispatch(getStatusConfig());
    dispatch(getStatus());
  }, []);
  useEffect(() => {
    if (Status) {
      const StatusArray = Status?.map((status: any) => ({
        value: status.id,
        label: status.status_name,
      }));
      setStatusData(StatusArray);
    }
  }, [Status]);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/status" },
          {
            label: "Status Config",
            path: "/master/status_config",
            active: true,
          },
        ]}
        title={"Status Configuration"}
      />
      <Row>
        <Col>
          <BasicInputElements state={StatusConfig} statusData={statusData} loading={loading} success={success} error={error} initialConfigloading={initialConfigloading} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default StatusConfiguration;
