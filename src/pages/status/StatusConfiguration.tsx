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
import { getStatus, getSubStatus, updateSubStatus } from "../../redux/actions";
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
    text: "5",
    value: 5,
  },
  {
    text: "10",
    value: 10,
  },
  {
    text: "20",
    value: 20,
  },
];
const initialValidationState = {
  status_id: "",
  next_status: "",
};

const initialState = {
  id: "",
  status_id: "",
  updated_by: "",
  next_status: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();

  //destructured all items from props
  const { statusData, swal, SubStatus, state } = props;

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
  const [selectedOptions, setSelectedOptions] = useState<OptionType | null>(null);
  const [selectedSubStatus, setSelectedSubStatus] = useState<OptionType[] | null>([]);

  const validationSchema = yup.object().shape({
    status_id: yup.string().nullable().required("status is required"),
    next_status: yup.string().nullable().required("sub status is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    const updatedStatus: OptionType[] = statusData?.filter((status: any) => status.value == item.id);
    setSelectedOptions(updatedStatus[0]);

    const selectedNextStatus = item?.next_actions?.map((next_action: any) => ({
      value: next_action.id,
      label: next_action.status_name,
    }));

    setSelectedSubStatus(selectedNextStatus);
    setFormData({
      id: item?.id,
      status_id: item?.id,
      updated_by: item?.updated_by,
      next_status: item?.next_status,
    });

    setIsUpdate(true);
  };

  //handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form using yup
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      axios
        .put(`/status/${formData.status_id}`, {
          next_actions: formData.next_status,
          status_name: selectedOptions?.label,
        })
        .then((res) => {
          showSuccessAlert(res.data.message);
          dispatch(getStatus());
        })
        .catch((err) => {
          console.error(err);
          showErrorAlert(err.message);
        });

      // Clear validation errors
      setValidationErrors(initialValidationState);

      //clear form data
      setFormData(initialState);
      setSelectedOptions(null);
      setSelectedSubStatus(null);
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
      Header: "Status Name",
      accessor: "status_name",
      sort: true,
    },
    {
      Header: "Next Actions",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyleType: "none" }}>
          {row.original.next_actions?.map((item: any) => (
            <li>{item.status_name}</li>
          ))}
        </ul>
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
    setSelectedOptions(null);
    setSelectedSubStatus(null);
  };

  const handleOptionsChange = (selected: any) => {
    setSelectedOptions(selected);
    setFormData((prev) => ({
      ...prev,
      status_id: selected.value,
    }));
  };

  const handleSubStatusChange = (selectedOptions: OptionType[] | OptionsType<OptionType> | null) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedSubStatus(selectedOptions);
      const selectedIdsString = selectedOptions?.map((option) => option.value).join(", ");
      setFormData((prev) => ({
        ...prev,
        next_status: selectedIdsString,
      }));
    }
  };

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
        {/* <Col lg={4} className="bg-white p-3 max-height"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Status Configuration</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="status_id">
                <Form.Label>Status</Form.Label>
                <Select
                  className="react-select react-select-container"
                  name="status_id"
                  classNamePrefix="react-select"
                  options={statusData}
                  value={selectedOptions}
                  onChange={handleOptionsChange}
                />

                {validationErrors.status_id && <Form.Text className="text-danger">{validationErrors.status_id}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="next_status">
                <Form.Label>Sub Status</Form.Label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  className="react-select react-select-container"
                  name="next_status"
                  classNamePrefix="react-select"
                  options={statusData}
                  value={selectedSubStatus}
                  onChange={handleSubStatusChange as any}
                />

                {validationErrors.next_status && <Form.Text className="text-danger">{validationErrors.next_status}</Form.Text>}
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
        </Modal>
        {/* </Col> */}

        <Col className="p-0 form__card">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Configure Status
              </Button>
              <h4 className="header-title mb-4">Manage Status Configuration</h4>
              <Table columns={columns} data={records ? records : []} pageSize={5} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true} />
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
  const Status = useSelector((state: RootState) => state.Status.status.data);
  const SubStatus = useSelector((state: RootState) => state.SubStatus.subStatus.data);
  useEffect(() => {
    dispatch(getStatus());
    dispatch(getSubStatus());
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
          <BasicInputElements state={Status} statusData={statusData} SubStatus={SubStatus} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default StatusConfiguration;
