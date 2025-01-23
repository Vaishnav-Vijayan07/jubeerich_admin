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
import { addSubStatus, deleteSubStatus, getStatus, getSubStatus, updateSubStatus } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import makeAnimated from "react-select/animated";
import { yupResolver } from "@hookform/resolvers/yup";
import Select, { ActionMeta, OptionTypeBase, OptionsType } from "react-select";
import { AUTH_SESSION_KEY } from "../../constants";

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
  status_id: "",
  next_status: "",
};

const initialState = {
  id: "",
  status_id: "",
  updated_by: "1",
  next_status: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);

  //destructured all items from props
  const { statusData, swal, SubStatus, subStatusData } = props;
  //Table data
  const records: TableRecords[] = SubStatus;
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
    status_id: yup.string().required("status is required"),
    next_status: yup.string().required("sub status is required"),
  });

  /*
   * form methods
   */
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });

  const handleUpdate = (item: any) => {
    const updatedStatus: OptionType[] = statusData?.filter((status: any) => status.value == item.status_id);
    setSelectedOptions(updatedStatus[0]);

    const selectedNextStatus = item?.next_status_names.map((next_status: any) => ({
      value: next_status.status_id,
      label: next_status.status_name,
    }));

    setSelectedSubStatus(selectedNextStatus);
    setFormData({
      id: item?.id,
      status_id: item?.status_id,
      updated_by: item?.updated_by,
      next_status: item?.next_status,
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
          dispatch(deleteSubStatus(id));

          if (isUpdate) {
            setFormData(initialState);
          }
        }
      });
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
          dispatch(updateSubStatus(formData.id, formData.status_id, formData.next_status, user_id));
          setIsUpdate(false);
        } else {
          dispatch(addSubStatus(formData.status_id, formData.next_status, user_id));
        }
      }

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
      Header: "Sub Status",
      accessor: "",
      sort: false,
      Cell: ({ row }: any) => (
        <ul style={{ listStyleType: "none" }}>
          {row.original.next_status_names?.map((item: any) => (
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
    if (isUpdate) {
      handleCancelUpdate();
    }
  };

  return (
    <>
      <Row className="justify-content-between px-2">
        {/* <Col lg={5} className="bg-white p-3"> */}
        <Modal show={responsiveModal} onHide={toggleResponsiveModal} dialogClassName="modal-dialog-centered">
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <h4 className="modal-title">Sub Status Management</h4>
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
                  options={subStatusData}
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

        <Col className="p-0">
          <Card className="bg-white">
            <Card.Body>
              <Button className="btn-sm btn-blue waves-effect waves-light float-end" onClick={toggleResponsiveModal}>
                <i className="mdi mdi-plus-circle"></i> Add Sub Status
              </Button>
              <h4 className="header-title mb-4">Manage Sub Status</h4>
              <Table
                columns={columns}
                data={records ? records : []}
                pageSize={10}
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

const SubStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [statusData, setStatusData] = useState([]);
  const [subStatusData, setSubStatusData] = useState([]);

  //Fetch data from redux store
  const Status = useSelector((state: RootState) => state.Status.status.data);
  const SubStatus = useSelector((state: RootState) => state.SubStatus.subStatus.data);
  useEffect(() => {
    dispatch(getStatus());
    dispatch(getSubStatus());
  }, []);
  useEffect(() => {
    if (Status) {
      const subStatus0 = Status.filter((status: any) => status.is_substatus === 0);
      const StatusArray = subStatus0?.map((status: any) => ({
        value: status.id,
        label: status.status_name,
      }));
      setStatusData(StatusArray);

      // Filter the subStatus array based on is_substatus value
      const subStatus1 = Status.filter((status: any) => status.is_substatus === 1);
      const SubStatusArray = subStatus1?.map((status: any) => ({
        value: status.id,
        label: status.status_name,
      }));
      setSubStatusData(SubStatusArray);
    }
  }, [Status]);

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          // { label: "Master", path: "/master/status" },
          { label: "Status Config", path: "/master/sub_status", active: true },
        ]}
        title={"Sub Status"}
      />
      <Row>
        <Col>
          <BasicInputElements state={Status} statusData={statusData} SubStatus={SubStatus} subStatusData={subStatusData} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default SubStatus;
