import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Collapse,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import classNames from "classnames";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2";

// dummy data
import { actionTypes, TaskItemTypes } from "./data";
import { formatTimestamp } from "../../../constants";

const Task = withSwal(({
  task,
  selectTask,
  actionFunction,
  selectedTaskId,
  swal
}: {
  task: TaskItemTypes;
  selectTask: (task: TaskItemTypes) => void;
  actionFunction?: (item: any, action: string) => void;
  selectedTaskId: any
  swal: any
}) => {
  const [completed, setCompleted] = useState<boolean>(task.stage === "Done");

  /*
   * mark completd on selected task
   */
  const markCompleted = (e: any) => {
    setCompleted(e.target.checked);
    selectTask(task);
  };

  const handleActionFucntion = (item: any, action: string) => {
    if (actionFunction) {

      if (actionTypes.update == action) {
        actionFunction(item, action)
      } else {
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
              actionFunction(item, action)
            }
          });
      }
    }
  }

  return (
    <>
      <Row className="justify-content-sm-between">
        <span className="task-item"></span>
        <Col md={6} className="mb-2 ps-3">
          <div className="form-check">
            <label
              className={`form-check-label ${task.id == selectedTaskId ? 'text-danger' : ''}`}
              htmlFor={`task-${task.id}`}
              onClick={() => selectTask(task)}
            >
              {task.title}
            </label>
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-end">
            <div className="mt-3 mt-sm-0">
              <ul className="list-inline font-13 text-end">
                <li className="list-inline-item pe-1">
                  <i className="mdi mdi-calendar-month-outline font-16 me-1"></i>{" "}
                  {formatTimestamp(task.due_date)}
                </li>
                <li className="list-inline-item">
                  <span
                    className={classNames(
                      "badge",
                      {
                        "badge-soft-danger": task.priority === "high",
                        "badge-soft-info": task.priority === "medium",
                        "badge-soft-success": task.priority === "low",
                      },
                      "p-1"
                    )}
                  >
                    {task.priority}
                  </span>
                  <span onClick={() => handleActionFucntion(task, actionTypes.update)} className="mdi mdi-pencil ps-1 fs-4" />
                  <span onClick={() => handleActionFucntion(task, actionTypes.delete)} className="mdi mdi-delete ps-1 fs-4" />
                </li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
});

interface TaskSectionState {
  title: string;
  tasks: TaskItemTypes[];
  selectTask: (task: TaskItemTypes) => void;
  actionFunction?: (item: any, action: string) => void;
  selectedTaskId: any
}

const TaskSection = ({ title, tasks, selectTask, actionFunction, selectedTaskId }: TaskSectionState) => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [taskList, setTaskList] = useState<TaskItemTypes[]>(tasks);

  useEffect(() => {
    setTaskList(tasks)
  }, [tasks])

  /*
   * toggle task-dropdown
   */
  const toggleTask = () => setCollapse(!collapse);

  return (
    <>
      <Link className="text-dark" to="#" onClick={toggleTask}>
        <h5 className="m-0">
          <i
            className={classNames(
              "mdi",
              { "mdi-chevron-down": collapse, "mdi-chevron-right": !collapse },
              "font-18"
            )}
          ></i>
          {title}{" "}
          <span className="text-muted font-14">({taskList.length})</span>
        </h5>
      </Link>
      <Collapse in={collapse}>
        <Card className="mb-0 shadow-none">
          <Card.Body className="pb-0">
            <ReactSortable
              group="taskList1"
              handle=".task-item"
              list={taskList}
              setList={setTaskList}
            >
              {(taskList || [])?.map((task, idx) => (
                <Task selectedTaskId={selectedTaskId} selectTask={selectTask} task={task} key={idx} actionFunction={actionFunction} />
              ))}
            </ReactSortable>
          </Card.Body>
        </Card>
      </Collapse>
    </>
  );
};

export default TaskSection;
