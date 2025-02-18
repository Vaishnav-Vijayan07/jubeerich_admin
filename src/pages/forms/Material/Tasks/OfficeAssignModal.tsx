import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown, Col } from "react-bootstrap";
import axios from "axios";
import { franchise_id_from_office, corporate_id_from_office, region_id_from_office } from "../../../../constants";

interface DropDownItem {
  value: string;
  label: string;
}

interface Props {
  show: boolean;
  handleClose: () => void;
  lead_id: number;
}

const OfficeAssignModal: React.FC<Props> = ({ show, handleClose, lead_id }) => {
  const [offices, setOffices] = useState<DropDownItem[]>([]);
  const [counselors, setCounselors] = useState<DropDownItem[]>([]);
  const [franchsiees, setFranchises] = useState<DropDownItem[]>([]);
  const [regions, setRegions] = useState<DropDownItem[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [selectedFranchise, setSelectedFranchise] = useState<string>("");
  const [selectedCounselor, setSelectedCounselor] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Fetch offices when modal opens
  useEffect(() => {
    if (show) {
      fetchOffices();
    }
  }, [show]);

  // API Call to Fetch Offices
  const fetchOffices = async () => {
    try {
      const { data } = await axios.get(`/assign_office/${lead_id}`); // Replace with your API endpoint
      setOffices(data.offices);
      setCounselors(data.counselors);
      setFranchises(data.franchisees);
      setRegions(data.regions);

      if (data?.office) {
        setSelectedOffice(data.office);

        if (data?.office.toString() === corporate_id_from_office && data.counselors.length > 0) {
          setSelectedCounselor(data.counselors[0].value);
        } else if (data?.office.toString() === region_id_from_office && data.regions.length > 0) {
          setSelectedRegion(data.regions[0].value);
        } else if (data?.office.toString() === franchise_id_from_office && data.franchisees.length > 0) {
          setSelectedFranchise(data.franchisees[0].value);
        }
      }
    } catch (error) {
      console.error("Error fetching offices", error);
    }
  };

  const handleOfficeChange = (office: any) => {
    setSelectedOffice(office);

    if (office.toString() === corporate_id_from_office && counselors.length > 0) {
      setSelectedCounselor(counselors[0].value);
    } else {
      setSelectedCounselor("");
    }

    if (office.toString() === region_id_from_office && regions.length > 0) {
      setSelectedRegion(regions[0].value);
    } else {
      setSelectedRegion("");
    }

    if (office.toString() === franchise_id_from_office && franchsiees.length > 0) {
      setSelectedFranchise(franchsiees[0].value);
    } else {
      setSelectedFranchise("");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Move to Counsellor</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Select Office</Form.Label>
              <Dropdown className="w-100">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="office-dropdown"
                  className="btn-sm btn-outline-secondary text-truncate w-100"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {offices?.find((option: DropDownItem) => option.value === selectedOffice)?.label || "Select Office"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {offices?.map((option: DropDownItem) => (
                    <Dropdown.Item key={option.value} onClick={() => handleOfficeChange(option.value)}>
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>

          <Col>
            {selectedOffice.toString() == corporate_id_from_office && (
              <Form.Group className="mb-3">
                <Form.Label>Select Counselor</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="counselor-dropdown"
                    className="btn-sm btn-outline-secondary text-truncate w-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {counselors?.find((option: DropDownItem) => option.value === selectedCounselor)?.label || "Select Counselor"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    {counselors?.map((option: DropDownItem) => (
                      <Dropdown.Item key={option.value} onClick={() => setSelectedCounselor(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            )}
          </Col>

          <Col>
            {selectedOffice.toString() == region_id_from_office && (
              <Form.Group className="mb-3">
                <Form.Label>Select Reegion</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="franchise-dropdown"
                    className="btn-sm btn-outline-secondary text-truncate w-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {regions?.find((option: DropDownItem) => option.value === selectedRegion)?.label || "Select Region"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    {regions?.map((option: DropDownItem) => (
                      <Dropdown.Item key={option.value} onClick={() => setSelectedRegion(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            )}
          </Col>

          <Col>
            {selectedOffice.toString() == franchise_id_from_office && (
              <Form.Group className="mb-3">
                <Form.Label>Select Franchise</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="franchise-dropdown"
                    className="btn-sm btn-outline-secondary text-truncate w-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {franchsiees?.find((option: DropDownItem) => option.value === selectedFranchise)?.label || "Select Franchise"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    {franchsiees?.map((option: DropDownItem) => (
                      <Dropdown.Item key={option.value} onClick={() => setSelectedFranchise(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            )}
          </Col>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary">Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfficeAssignModal;
