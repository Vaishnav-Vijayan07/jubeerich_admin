import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Collapse, OverlayTrigger, Tooltip } from "react-bootstrap";
import classNames from "classnames";
import { ReactSortable } from "react-sortablejs";
import calender from "../../../../assets/images/icons/calendar.svg";

// dummy data
import { TaskItemTypes } from "./data";
import { DateReverse, handleDateFormat, setColorOpacity } from "../../../../constants";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";

const Task = ({
  task,
  selectTask,
  selectedTaskId, // Add selectedTaskId prop
}: {
  task: TaskItemTypes;
  selectTask: (task: TaskItemTypes) => void;
  selectedTaskId: number | null; // Track selected task's ID
}) => {
  return (
    <>
      <Row
        className={classNames("justify-content-sm-between task__list ribbon-box unselected-task", {
          "selected-task": task.id === selectedTaskId, // Add a class when the task is selected
        })}
        onClick={() => selectTask(task)}
        style={{ fontFamily: "Nunito", borderBottom: "1.3px solid #70707033" }}
      >
        <Col className="py-1 px-2 d-flex flex-column gap-2 cursor-pointer" md={12}>
          <div className="d-flex justify-content-between gap-3">
            <label className="form-check-label fs-5 truncate-text" htmlFor={`task-${task.id}`}>
              <span className="text-primary" style={{ fontSize: "14px", fontWeight: "700" }}>{`JBR${task.id}`}</span>
              &nbsp; &nbsp;
              <b>{task.title}</b>
            </label>

            {task?.student_name?.user_primary_flags?.flag_name && (
              <small
                style={{
                  opacity: 0.7,
                  backgroundColor: `${task?.student_name?.user_primary_flags?.color}`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "2px 12px",
                  fontSize: "0.7rem",
                  borderColor: `${task?.student_name?.user_primary_flags?.color}`,
                  height: "max-content",
                }}
                className={classNames("rounded-pill me-1 ms-2")}
              >
                {task?.student_name?.user_primary_flags?.flag_name}
              </small>
            )}
          </div>
          {/* <div>
            {task?.student_name?.user_primary_flags?.flag_name && (
              <small
                style={{
                  opacity: 0.7,
                  backgroundColor: `${task?.student_name?.user_primary_flags?.color}`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 5px",
                  fontSize: "0.6rem",
                  borderColor: `${task?.student_name?.user_primary_flags?.color}`,
                }}
                className={classNames("rounded-pill me-1 ms-2")}
              >
                {task?.student_name?.user_primary_flags?.flag_name}
              </small>
            )}
          </div> */}
        </Col>
      </Row>
    </>
  );
};

interface TaskSectionState {
  title: string;
  tasks: TaskItemTypes[];
  selectTask: (task: TaskItemTypes) => void;
  initialTaskId: number;
  date: string;
  setSelectedDate: Dispatch<SetStateAction<string>>;
}

const TaskSection = ({ title, tasks, selectTask, initialTaskId }: TaskSectionState) => {
  const [taskList, setTaskList] = useState<TaskItemTypes[]>(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(initialTaskId); // Track selected task's ID
  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  // Update the selected task ID when a task is selected
  const handleSelectTask = (task: TaskItemTypes) => {
    setSelectedTaskId(task.id);
    selectTask(task);
  };

  useEffect(() => {
    setSelectedTaskId(initialTaskId);
  }, [initialTaskId]);

  return (
    <>
      <div className="d-flex justify-content-between pb-3 mx-2">
        <div className="text-dark">
          <h5 className=" text-secondary" style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: "16px" }}>
            {title}{" "}
            <span className="text-danger" style={{ fontWeight: 500, fontSize: "14px" }}>
              ({taskList.length})
            </span>
          </h5>
        </div>
        {/* <div className="d-flex align-items-center justify-content-end">
          <img src={calender} alt="date logo" width={16.3} className="calender-img" />
          <ReactDatePicker onChange={handleDateChange} selected={new Date(DateReverse(date))} dateFormat={"dd-MM-yyyy"} className="custom-react-date-picker" />
        </div> */}
      </div>

      {taskList.length > 0 ? (
        <Card className="mb-0 shadow-none" style={{ borderTop: "1.3px solid #70707033" }}>
          <Card.Body className="px-0 pt-0">
            <ReactSortable group="taskList1" handle=".task-item" list={taskList} setList={setTaskList}>
              {(taskList || []).map((task, idx) => (
                <Task
                  selectTask={handleSelectTask}
                  task={task}
                  key={idx}
                  selectedTaskId={selectedTaskId} // Pass selectedTaskId as prop
                />
              ))}
            </ReactSortable>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-0 shadow-none" style={{ borderTop: "1.3px solid #70707033" }}>
          <Card.Body className="px-0 text-center pt-4 pb-4">
            <span>No tasks found...</span>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default TaskSection;
