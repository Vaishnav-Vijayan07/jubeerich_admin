import React from "react";
import { Card, Col, NavDropdown, Row } from "react-bootstrap";
import { DateReverse, lost_id, setColorOpacity, spam_id } from "../../../../constants";
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";
import classNames from "classnames";
import { icons } from "../../../../assets/images/icons";

const TaskStatusChange = ({ taskObject, updateChecklistStatus, openModal, handleNextStatusChange, handleStatusChange }: any) => {
  return (
    <Card>
      <Card.Body>
        <Row className="grid-container">
          <Col className="max-content">
            <p className="text-muted fw-light mt-1 mb-1">Current Status</p>
            <div className="d-flex align-items-center">
              {taskObject.next_actions?.length > 0 ? (
                <div style={{ backgroundColor: setColorOpacity(taskObject.color), color: taskObject.color, border: `1px solid ${taskObject.color}`, borderRadius: "5px" }}>
                  <NavDropdownMenu className="current_status px-2 py-1" title={taskObject.status_name} id="collasible-nav-dropdown">
                    {taskObject.next_actions?.map((item: any, idx: any) => (
                      <>
                        {item.sub_status?.[0]?.items?.length > 0 ? (
                          <DropdownSubmenu title={item?.status_name} key={item.id}>
                            {/* <NavDropdown.Item
                                href="#"
                                key={item?.status_name}
                                onClick={(e) => [handleStatusChange(item.id), handleNextStatusChange(null), handleUpdateStatus(id, "", "", "")]}
                              >
                                {item?.status_name}
                              </NavDropdown.Item> */}
                            {item.sub_status[0].items.map((subItem: any) => (
                              <NavDropdown.Item
                                href="#"
                                key={subItem.sub_status_id}
                                onClick={(e) => {
                                  if (subItem.sub_status_id == spam_id || subItem.sub_status_id == lost_id) {
                                    handleStatusChange(item?.id);
                                    handleNextStatusChange(subItem.sub_status_id);
                                  } else {
                                    openModal(subItem.sub_status_id, item?.id);
                                  }
                                }}
                              >
                                {subItem.sub_status_name}
                              </NavDropdown.Item>
                            ))}
                          </DropdownSubmenu>
                        ) : (
                          <NavDropdown.Item
                            href="#"
                            //  onClick={(e) => [handleStatusChange(item.id), handleNextStatusChange(null)]}
                            onClick={() => openModal("", item?.id)}
                            key={item.id}
                          >
                            {item?.status_name}
                          </NavDropdown.Item>
                        )}
                      </>
                    ))}
                  </NavDropdownMenu>
                </div>
              ) : (
                <small
                  style={{
                    backgroundColor: setColorOpacity(taskObject.color),
                    color: taskObject.color,
                    border: `1px solid ${taskObject.color}`,
                    borderRadius: "5px",
                    padding: "10px 12px",
                  }}
                  className={classNames("badge fs-6 me-1")}
                  // style={{ fontSize: "10px" }}
                >
                  {taskObject.status_name}
                </small>
              )}
            </div>
          </Col>

          <Col className="max-content">
            <p className="mt-1 mb-1 text-muted fw-light">Due Date</p>
            <div className="d-flex align-items-center">
              <img src={icons.calender_time} alt="phone" className="me-1" width="16" />
              <h5 className="m-0 font-size-14">{DateReverse(taskObject.due_date)}</h5>
            </div>
          </Col>

          <Col className="max-content">
            <>
              <p className="text-muted fw-light mt-1 mb-1">Next Status</p>
              {taskObject.next_status && (
                <div className="d-flex align-items-center">
                  <small
                    style={{
                      backgroundColor: setColorOpacity(taskObject.next_status_color),
                      color: taskObject.next_status_color,
                      border: `1px solid ${taskObject.next_status_color}`,
                      borderRadius: "5px",
                      padding: "10px 12px",
                    }}
                    className={classNames("badge fs-6  me-1")}
                    // style={{ fontSize: "10px" }}
                  >
                    {taskObject.next_status_name}
                  </small>
                </div>
              )}
            </>
          </Col>
          <Col></Col>
        </Row>

        <Row className="mt-3 mb-2">
          <p className="mt-1 mb-1 text-muted fw-light">Checklists</p>
          <div className="grid-container">
            {(taskObject.checklists || []).map((checklist: any, index: any) => (
              <div className="form-check mt-1" key={index}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checklist-${checklist.id}`}
                  checked={checklist.status}
                  onChange={(e) => updateChecklistStatus(checklist.id, e, checklist.title)}
                />
                <label
                  className={classNames("form-check-label", {
                    strikethrough: checklist.status,
                  })}
                  htmlFor={`checklist-${checklist.id}`}
                >
                  {checklist.title}
                </label>
              </div>
            ))}
          </div>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TaskStatusChange;
