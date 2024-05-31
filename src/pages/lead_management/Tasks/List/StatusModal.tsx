import React, { Dispatch, SetStateAction, useState } from "react";
import { Row, Col, Card, Button, Modal, Accordion, useAccordionButton, DropdownButton, Dropdown } from "react-bootstrap";
import avatarImg4 from "../../../../assets/images/users/user_circle_icon.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import axios from "axios";
import { showSuccessAlert } from "../../../../constants";
import FeatherIcon from "feather-icons-react";

interface NextActionItems {
  id: number;
  status_name: string;
  color: string;
}

interface stateTypes {
  standard: boolean;
  setStandard: Dispatch<SetStateAction<boolean>>;
  getTaskList: () => void;
  id: number;
  status_id: number;
  lead_id: string;
  next_actions: Array<NextActionItems>;
}
export const StatusModal = ({ standard, setStandard, id, status_id, lead_id, getTaskList, next_actions }: stateTypes) => {
  // const [standard, setStandard] = useState<boolean>(true);

  /**
   * Show/hide the modal
   */
  const toggleStandard = () => {
    setStandard(!standard);
  };

  const setBgColor = (color: string) => {
    const rgbaComponents = color?.match(/\d+(\.\d+)?/g);
    let updatedColor;
    if (rgbaComponents && rgbaComponents.length === 4) {
      // Update the alpha (opacity) value to 0.2 (20% opacity)
      rgbaComponents[3] = "0.2";

      // Reconstruct the updated RGBA color value
      updatedColor = `rgba(${rgbaComponents.join(", ")})`;
    }
    return updatedColor;
  };

  const handleUpdateStatus = (item: any) => {
    axios
      .put(`/update_status/${lead_id}`, {
        user_id: "1",
        status: item.id,
      })
      .then((res) => {
        getTaskList();
        showSuccessAlert(res.data.message ? res.data.message : "Updated Successfull");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <Modal show={standard} onHide={toggleStandard}>
      <Modal.Header onHide={toggleStandard} closeButton>
        <h4 className="modal-title">INTR{id}</h4>
      </Modal.Header>
      <Modal.Body className="w-100">
        <div className="d-flex w-100 gap-2" style={{ flexWrap: "wrap" }}>
          {!next_actions && "No next actions found."}

          {next_actions?.map((item: any) => (
            <>
              {item.sub_status?.[0]?.items?.length > 0 ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    id="dropdown-basic"
                    style={{
                      backgroundColor: `${setBgColor(item.color)}`,
                      color: `${item.color}`,
                      border: "none",
                    }}
                  >
                    <span className="d-flex justify-content-center align-items-center">
                      {item?.status_name} <FeatherIcon icon="chevron-down" size="16" />
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {item.sub_status[0].items.map((subItem: any) => (
                      <Dropdown.Item onClick={() => console.log("pressed")} key={subItem.id}>
                        {subItem.sub_status_name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <button
                  className="btn btn-primary w-25"
                  key={item.id}
                  style={{
                    backgroundColor: `${setBgColor(item.color)}`,
                    color: `${item.color}`,
                    border: "none",
                  }}
                  onClick={() => handleUpdateStatus(item)}
                >
                  {item?.status_name}
                </button>
              )}
            </>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};
