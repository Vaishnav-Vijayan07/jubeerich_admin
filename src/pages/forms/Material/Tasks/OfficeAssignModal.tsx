import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Dropdown, Col } from "react-bootstrap";
import axios from "axios";
import { franchise_id_from_office, corporate_id_from_office, region_id_from_office } from "../../../../constants";
import { showConfirmation } from "../../../../utils/showConfirmation";
import useDropdownData from "../../../../hooks/useDropdownDatas";

interface DropDownItem {
  value: string;
  label: string;
}

interface Props {
  show: boolean;
  handleClose: () => void;
  lead_id: number;
  office_type: number | null;
  region: number | null;
  handleSubmit: (type: string, office_id: number, counselor_id: number, region_id: number, branch_id: number) => void;
}

const OfficeAssignModal: React.FC<Props> = ({ show, handleClose, lead_id, handleSubmit, office_type, region }) => {
  const { dropdownData }: any = useDropdownData("officeType");
  const [counselors, setCounselors] = useState<DropDownItem[]>([]);
  const [regions, setRegions] = useState<DropDownItem[]>([]);
  const [branches, setBranches] = useState<DropDownItem[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<any>(office_type);
  const [selectedCounselor, setSelectedCounselor] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<any>(region);
  const [selectedBranch, setSelectedBranch] = useState<any>("");

  // Fetch offices when modal opens
  useEffect(() => {
    fetchOffices();
  }, [selectedOffice]);

  useEffect(() => {
    if (region) {
      fetchRegionsWiseBranches(region);
    }
  }, []);

  // API Call to Fetch Offices
  const fetchOffices = async () => {
    let type = "";

    if (selectedOffice?.toString() == corporate_id_from_office) {
      type = "corporate";
    } else if (selectedOffice?.toString() == franchise_id_from_office) {
      type = "franchise";
    } else if (selectedOffice?.toString() == region_id_from_office) {
      type = "region";
    }
    try {
      const { data } = await axios.get(`/assign_office`, {
        params: {
          type: selectedOffice !== "" ? type : "corporate",
          lead_id,
        },
      });
      setCounselors(data.counselors);
      setRegions(data.regions);
    } catch (error) {
      console.error("Error fetching offices", error);
    }
  };

  const fetchRegionsWiseBranches = async (region_id: number | string) => {
    try {
      const { data } = await axios.get(`region_wise_branches/${region_id}`);
      setBranches(data.branches);
      setSelectedBranch("");
      setSelectedCounselor("");
    } catch (error) {
      console.error("Error fetching offices", error);
    }
  };

  const handleRegionChange = (region_id: string) => {
    setSelectedRegion(region_id);
    fetchRegionsWiseBranches(region_id);
  };

  const handleOfficeChange = (office: any) => {
    if (office.toString() !== region_id_from_office) {
      setSelectedCounselor("");
      setSelectedRegion("");
    }
    setSelectedOffice(office);
  };

  const officeSwitch = () => {
    let type = "";
    switch (selectedOffice.toString()) {
      case corporate_id_from_office:
        type = "corporate";
        break;
      case region_id_from_office:
        type = "region";
        break;
      case franchise_id_from_office:
        type = "franchise";
        break;
      default:
        type = "corporate";
        break;
    }
    return type;
  };

  const counselorSwitch = () => {
    let counselor_id = "";
    switch (selectedOffice.toString()) {
      case corporate_id_from_office:
        counselor_id = selectedCounselor;
        break;
      case region_id_from_office:
        counselor_id = selectedRegion;
        break;
      case franchise_id_from_office:
        counselor_id = selectedCounselor;
        break;
      default:
        counselor_id = "";
        break;
    }
    return counselor_id == "" ? 0 : parseInt(counselor_id);
  };

  const handleSave = async () => {
    const result = await showConfirmation("Do you want to proceed?", "Yes");
    if (!result.isConfirmed) return;
    const type = officeSwitch();
    const office_id = parseInt(selectedOffice);
    const counselor_id = type == "region" ? 0 : counselorSwitch();
    const region_id = type == "region" ? parseInt(selectedRegion) : 0;
    const branch_id = type == "region" ? parseInt(selectedBranch) : 0;
    handleSubmit(type, office_id, counselor_id, region_id, branch_id);
  };

  console.log(regions);
  console.log(selectedRegion);
  console.log(regions?.find((option: DropDownItem) => option.value === selectedRegion)?.label);
  console.log(region);

  const disableButton = () => {
    if (selectedOffice?.toString() == region_id_from_office) {
      return selectedRegion == "" || selectedBranch == "";
    }
    return selectedCounselor == "";
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
                  {(dropdownData?.officeTypes && dropdownData?.officeTypes?.find((option: DropDownItem) => option.value === selectedOffice)?.label) ||
                    "Select Office"}
                </Dropdown.Toggle>

                <Dropdown.Menu className="w-100">
                  {dropdownData?.officeTypes &&
                    dropdownData?.officeTypes?.map((option: DropDownItem) => (
                      <Dropdown.Item key={option.value} onClick={() => handleOfficeChange(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          {selectedOffice?.toString() !== region_id_from_office && (
            <Col>
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
                    {counselors?.length > 0 ? (
                      counselors?.map((option: DropDownItem) => (
                        <Dropdown.Item key={option.value} onClick={() => setSelectedCounselor(option.value)}>
                          {option.label}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled className="text-muted">
                        No data available
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>
          )}

          <Col>
            {selectedOffice.toString() == region_id_from_office && (
              <Form.Group className="mb-3">
                <Form.Label>Select Region</Form.Label>
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
                      <Dropdown.Item key={option.value} onClick={() => handleRegionChange(option.value)}>
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            )}
          </Col>

          <Col>
            {selectedOffice?.toString() == region_id_from_office && (
              <Form.Group className="mb-3">
                <Form.Label>Select Branch</Form.Label>
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
                    {branches?.find((option: DropDownItem) => option.value === selectedBranch)?.label || "Select Branch"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100">
                    {branches?.length > 0 ? (
                      branches?.map((option: DropDownItem) => (
                        <Dropdown.Item key={option.value} onClick={() => setSelectedBranch(option.value)}>
                          {option.label}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled className="text-muted">
                        No data available
                      </Dropdown.Item>
                    )}
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
        <Button variant="primary" disabled={disableButton()} onClick={handleSave}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfficeAssignModal;
