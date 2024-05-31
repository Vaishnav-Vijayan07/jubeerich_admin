import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Select, { OptionsType } from "react-select";
import makeAnimated from "react-select/animated";
import LeadTable from "./LeadTable";
import { ModalComponent } from "./ModalComponent";
import { TicketDetailsItems } from "./data";
import axios from "axios";
import Spinner from "../../components/Spinner";
import moment from "moment";

interface ManageTicketsProps {
  ticketDetails: TicketDetailsItems[];
  statusData: any;
  show: boolean;
  usersData: any;
  onHide: () => void;
  onSubmit: () => void;
}

interface OptionType {
  value: number;
  label: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minWidth: "150px", // Adjust the width as needed
    fontSize: "12px",
  }),
};

const ManageTickets: React.FC<ManageTicketsProps> = ({ statusData, usersData }) => {
  const [standard, setStandard] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedUser, setSelectedUser] = useState<OptionType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OptionType[]>([]);
  const [selectedStatusString, setSelectedStatusString] = useState<string | null>(null);
  const [reportData, setreportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClear, setIsClear] = useState(false);

  const animatedComponents = makeAnimated();

  //function to handle multiple status selection
  const handleStatusChange = (selectedOptions: OptionType[] | OptionsType<OptionType> | null) => {
    if (Array.isArray(selectedOptions)) {
      setSelectedStatus(selectedOptions);

      //convert the selected status into a comma seperated string
      const valuesString = selectedOptions.map((option) => option.value).join(",");
      setSelectedStatusString(valuesString);
    }
  };

  const handleUserChange = (e: any) => {
    setSelectedUser(e);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const getLeadsReport = () => {
    setLoading(true);
    axios
      .get("/leads_report", {
        params: {
          status_ids: selectedStatusString,
          date: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
          user_id: selectedUser?.value,
        },
      })
      .then((res) => {
        setreportData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getLeadsReport();
  }, [isClear]);

  const handleClear = () => {
    setSelectedDate(null);
    setSelectedStatus([]);
    setSelectedStatusString(null);
    setSelectedUser(null);

    setIsClear(!isClear);
  };

  return (
    <Card>
      {loading && (
        <div className="loading-overlay">
          <Spinner className="custom-spinner" />
        </div>
      )}
      <Card.Body>
        <div className="mb-5">
          <div className="float-end d-flex flex-column gap-2">
            <div className="d-flex">
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                className="react-select react-select-container me-2"
                name="next_status"
                styles={customStyles}
                classNamePrefix="react-select"
                placeholder="Choose status.."
                options={statusData}
                value={selectedStatus}
                onChange={handleStatusChange as any}
              />

              <Select
                className="react-select react-select-container me-2"
                name="country"
                classNamePrefix="react-select"
                options={usersData}
                value={selectedUser}
                styles={customStyles}
                placeholder="Choose a user.."
                onChange={handleUserChange}
              />

              <DatePicker selected={selectedDate} onChange={handleDateChange} placeholderText="Choose a date" className="custom-html-date-input" />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                style={{ maxHeight: "38px" }}
                className="btn-sm btn-danger waves-effect waves-light float-end px-3"
                onClick={() => {
                  handleClear();
                }}
              >
                Clear
              </Button>
              <Button style={{ maxHeight: "38px" }} className="btn-sm btn-blue waves-effect waves-light float-end px-3" onClick={() => getLeadsReport()}>
                Apply
              </Button>
            </div>
          </div>

          <h4 className="header-title mb-4">Lead Reports</h4>
        </div>

        <LeadTable leadsData={reportData} setStandard={setStandard} setSelectedLead={setSelectedLead} />

        <ModalComponent setStandard={setStandard} standard={standard} selectedLead={selectedLead} />
      </Card.Body>
    </Card>
  );
};

export default ManageTickets;
