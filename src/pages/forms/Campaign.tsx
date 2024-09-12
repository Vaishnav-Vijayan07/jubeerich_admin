import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Row, Col, Card, Form, Button, Dropdown, Modal } from "react-bootstrap";
import Table from "../../components/Table";

import { withSwal } from "react-sweetalert2";
import FeatherIcons from "feather-icons-react";
import { yupResolver } from "@hookform/resolvers/yup";

// components
import PageTitle from "../../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { addCampaign, deleteCampaign, getCampaign, getChannel, updateCampaign } from "../../redux/actions";
import Select from "react-select";
import { AUTH_SESSION_KEY, customStyles } from "../../constants";
import { Link } from "react-router-dom";

interface TableRecords {
  id: string;
  channel_id: string;
  campaign_name: string;
  campaign_description: string;
  from_date: string | null;
  to_date: string | null;
  updated_by: string;
}

interface OptionType {
  value: string;
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

const initialState = {
  id: "",
  channel_id: "",
  campaign_name: "",
  campaign_description: "",
  from_date: null,
  to_date: null,
  updated_by: "",
};

const initialValidationState = {
  channel_id: "",
  campaign_name: "",
  campaign_description: "",
  from_date: "",
  to_date: "",
};

const BasicInputElements = withSwal((props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { swal, campaignData, channelData } = props;

  //fetch token from session storage
  let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
  //Table data
  const records: TableRecords[] = campaignData;
  //State for handling update function
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<TableRecords>(initialState);
  //validation errors
  const [validationErrors, setValidationErrors] = useState(initialValidationState);
  const [selectedChannel, setSelectedChannel] = useState<OptionType | null>(null);

  // Modal states
  const [responsiveModal, setResponsiveModal] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    campaign_name: yup.string().required("campaign name is required").min(3, "campaign name must be at least 3 characters long"),
    campaign_description: yup.string().required("campaign description is required").min(3, "campaign description must be at least 3 characters long"),
    channel_id: yup.string().required("Please choose a source"),
    from_date: yup.date().required("Start date is required").nullable(),
    to_date: yup
      .date()
      .required("End date is required")
      .nullable()
      .test("from-to-date", "End date must be after start date", function (value) {
        const { from_date } = this.parent;
        if (!value || !from_date) {
          // Don't validate if either date is missing
          return true;
        }
        return new Date(value) >= new Date(from_date);
      }),
  });
  // Form Methods
  const methods = useForm({
    resolver: yupResolver(validationSchema), // Integrate yup with react-hook-form
    defaultValues: initialState,
  });
  const handleUpdate = (item: any) => {
    //update channel dropdown
    const updatedChannel: OptionType[] = channelData?.filter((channel: any) => channel.value == item.channel_id);
    setSelectedChannel(updatedChannel[0]);

    // Convert date values to yyyy-mm-dd format
    const formattedFromDate = item.from_date ? new Date(item.from_date).toISOString().split("T")[0] : "";
    const formattedToDate = item.to_date ? new Date(item.to_date).toISOString().split("T")[0] : "";

    setFormData((prev) => ({
      ...prev,
      id: item?.id,
      channel_id: item?.channel_id,
      campaign_name: item?.campaign_name,
      campaign_description: item?.campaign_description,
      from_date: formattedFromDate,
      to_date: formattedToDate,
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
          dispatch(deleteCampaign(id));
          // swal.fire("Deleted!", "Your item has been deleted.", "success");
        }
      });
  };
  //handle onchange function
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const updatedValue = value === "" ? null : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
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
          dispatch(updateCampaign(formData.id, formData.channel_id, formData.campaign_name, formData.campaign_description, formData.from_date, formData.to_date, user_id));
          setIsUpdate(false);
        } else {
          // Handle add logic
          dispatch(addCampaign(formData.channel_id, formData.campaign_name, formData.campaign_description, formData.from_date, formData.to_date, user_id));
        }
      }

      setValidationErrors(initialValidationState); // clear form errors
      handleResetFormData(); //clear form data

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
      Header: "Campaign Name",
      accessor: "campaign_name",
      sort: true,
    },
    {
      Header: "Campaign Description",
      accessor: "campaign_description",
      sort: false,
    },
    {
      Header: "Channel Id",
      accessor: "channel_id",
      sort: false,
    },
    {
      Header: "From Date",
      accessor: "from_date",
      sort: false,
      Cell: ({ value }: any) => {
        const formattedDate = value ? new Date(value).toLocaleDateString("en-GB") : "";
        return <span>{formattedDate}</span>;
      },
    },
    {
      Header: "To Date",
      accessor: "to_date",
      sort: true,
      Cell: ({ value }: any) => {
        const formattedDate = value ? new Date(value).toLocaleDateString("en-GB") : "";
        return <span>{formattedDate}</span>;
      },
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
    handleResetFormData();
  };

  const handleResetFormData = () => {
    setFormData((prev) => ({
      ...prev,
      id: "",
      campaign_name: "",
      campaign_description: "",
      channel_id: "",
      from_date: null,
      to_date: null,
      updated_by: "",
    }));
  };
  const handleChannelChange = (selected: any) => {
    setSelectedChannel(selected);
    setFormData((prev) => ({
      ...prev,
      channel_id: selected.value,
    }));
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
              <h4 className="modal-title">Campaign Management</h4>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="campaign_name">
                <Form.Label>Campaign Name</Form.Label>
                <Form.Control type="text" name="campaign_name" value={formData.campaign_name} onChange={handleInputChange} />
                {validationErrors.campaign_name && <Form.Text className="text-danger">{validationErrors.campaign_name}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="campaign_description">
                <Form.Label>Campaign Description</Form.Label>
                <Form.Control as="textarea" rows={5} name="campaign_description" value={formData.campaign_description} onChange={handleInputChange} />
                {validationErrors.campaign_description && <Form.Text className="text-danger">{validationErrors.campaign_description}</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="channel_id">
                <Form.Label>Channel</Form.Label>
                <Select
                  styles={customStyles}
                  className="react-select react-select-container"
                  name="channel_id"
                  classNamePrefix="react-select"
                  options={channelData}
                  value={selectedChannel}
                  onChange={handleChannelChange}
                />

                {validationErrors.channel_id && <Form.Text className="text-danger">{validationErrors.channel_id}</Form.Text>}
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="from_date"
                      value={formData.from_date ? formData.from_date : ""}
                      placeholder="dd-mm-yyyy" // Set a custom placeholder
                      onChange={handleInputChange}
                    />
                    {validationErrors.from_date && <Form.Text className="text-danger">{validationErrors.from_date}</Form.Text>}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" name="to_date" value={formData.to_date ? formData.to_date : ""} onChange={handleInputChange} />
                    {validationErrors.to_date && <Form.Text className="text-danger">{validationErrors.to_date}</Form.Text>}
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="danger"
                id="button-addon2"
                className="mt-3 ms-2"
                onClick={() => (isUpdate ? [handleCancelUpdate(), toggleResponsiveModal()] : toggleResponsiveModal())}
              >
                {isUpdate ? "Cancel" : "Close"}
              </Button>
              <Button type="submit" variant="success" id="button-addon2" className="mt-3">
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
                <i className="mdi mdi-plus-circle"></i> Add Campaign
              </Button>
              <h4 className="header-title mb-4">Manage Campaigns</h4>
              <Table columns={columns} data={records ? records : []} pageSize={10} sizePerPageList={sizePerPageList} isSortable={true} pagination={true} isSearchable={true}
                tableClass="table-striped dt-responsive nowrap w-100"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
});
const Campaign = () => {
  const [channelData, setChannelData] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  //Fetch data from redux store
  const Channel = useSelector((state: RootState) => state?.Channels?.channels?.data);
  const campaign = useSelector((state: RootState) => ({
    state: state.Campaign.campaigns.data,
  }));

  useEffect(() => {
    dispatch(getCampaign());
    dispatch(getChannel());
  }, []);

  useEffect(() => {
    if (Channel) {
      const ChannelArray = Channel?.map((channel: any) => ({
        value: channel.id.toString(),
        label: channel.channel_name, // Replace with the appropriate field from the lead data
      }));
      setChannelData(ChannelArray);
    }
  }, [Channel]);
  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[
          { label: "Master", path: "/master/campaign" },
          { label: "Campaign", path: "/master/campaign", active: true },
        ]}
        title={"Campaigns"}
      />
      <Row>
        <Col>
          <BasicInputElements channelData={channelData} campaignData={campaign.state} />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default Campaign;
