import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Select, { ActionMeta, OptionsType } from "react-select";
import {
  Row,
  Col,
  Card,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import classNames from "classnames";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// dummy data
import { TaskItemTypes, taskStatusTypes } from "./data";
import { formatTimestamp, showSuccessAlert } from "../../../constants";
import { Form } from "react-bootstrap";
import axios from "axios";

// const Task = (task: TaskItemTypes) => {
const Task = ({ task, updateStatus, clearForm }: { task: TaskItemTypes;  updateStatus: (form: any, selected: any) => void; clearForm: any}) => {
  
  const [completed, setCompleted] = useState<boolean>(task?.stage === "Done");
  const [formData, setFormData] = useState({ id: '', title: '', description: '', status: '', priority: '', due_date: '', user_id: '' });
  const [selectedStatus, setselectedStatus] = useState<any>(null);
  
  useEffect(() => {
   setFormData(task);
   handleDropdownUpdate(task?.status)
  }, [task])

  useEffect(() => {
    setselectedStatus(null)
    setFormData({ id: '', title: '', description: '', status: '', priority: '', due_date: '', user_id: '' })
   }, [clearForm])

  const handleDropdownUpdate = (value: string) => {

    const filteredStatus = taskStatusTypes.filter((data: any) => data.value == value);
    setselectedStatus(filteredStatus[0])

  }

  const handleInputSelect = async(selected: any,  { name }: any) => {
    setselectedStatus(selected);
    updateStatus(formData, selected)
  }
  
  /*
   * mark completd on selected task
   */
  const markCompleted = (e: any) => setCompleted(e.target.checked);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <React.Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <div>
                { selectedStatus && <Form.Group  controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Select
                    className="react-select react-select-container select-wrapper"
                    classNamePrefix="react-select"
                    name="status"
                    options={[{ value: null, label: "All" }, ...taskStatusTypes]}
                    value={selectedStatus}
                    onChange={handleInputSelect}
                  />
                </Form.Group> }
              </div>

              <div className="clearfix"></div>

              <hr className="my-2" />
            </Col>
          </Row>

          <Row>
            <Col>
              { task?.title && <h4>{task?.title}</h4>}

              <Row>
                <Col>
                  <p className="mt-2 mb-1 text-muted">Due Date</p>
                  <div className="d-flex align-items-start">
                    <i className="mdi mdi-calendar-month-outline font-18 text-success me-1"></i>
                    <div className="w-100">
                      { task?.due_date && <h5 className="mt-1 font-size-14">{formatTimestamp(task?.due_date)}</h5>}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData?.description}
                    onChange={handleChange}
                    placeholder="Enter your text here..."
                    disabled={true}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Task;
