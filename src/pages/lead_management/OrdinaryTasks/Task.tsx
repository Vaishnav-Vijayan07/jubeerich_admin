import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { TaskItemTypes } from "./data";
import { formatTimestamp } from "../../../constants";
import { Form } from "react-bootstrap";

const Task = (task: TaskItemTypes) => {
  const [completed, setCompleted] = useState<boolean>(task.stage === "Done");
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
   setFormData(task)
  }, [])
  
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
              <div className="form-check float-start">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="completedCheck"
                  checked={completed}
                  onChange={markCompleted}
                />
                <label className="form-check-label" htmlFor="completedCheck">
                  Mark as completed
                </label>
              </div>

              <div className="clearfix"></div>

              <hr className="my-2" />
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>{task.title}</h4>

              <Row>
                <Col>
                  <p className="mt-2 mb-1 text-muted">Due Date</p>
                  <div className="d-flex align-items-start">
                    <i className="mdi mdi-calendar-month-outline font-18 text-success me-1"></i>
                    <div className="w-100">
                      <h5 className="mt-1 font-size-14">{formatTimestamp(task.due_date)}</h5>
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
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter your text here..."
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
