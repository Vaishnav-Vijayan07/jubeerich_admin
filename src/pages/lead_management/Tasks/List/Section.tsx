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
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";

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

            {task?.student_name?.status?.status_name && (
              <small
                style={{
                  backgroundColor: `${task?.student_name?.status?.color}`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "6px 10px",
                  width: "fit-content",
                  fontSize: "0.6rem",
                  borderColor: `${task?.student_name?.status?.color}`,
                  height: "max-content",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  opacity: "0.8",
                }}
                className={classNames("rounded-pill ms-2")}
              >
                {task?.student_name?.status?.status_name}
              </small>
            )}
          </div>

          <div>
            {task?.student_name?.preferredCountries?.map((country: any) => (
              <small
                style={{
                  backgroundColor: "#9dd3f5",
                  color: "#122d3d",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "2px 8px",
                  fontSize: "0.6rem",
                  opacity: "0.8",
                }}
                className={classNames("rounded-pill me-1 ms-0")}
              >
                {country?.country_name}
              </small>
            ))}

            {task?.is_rejected && (
              <small
                style={{
                  backgroundColor: `red`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "2px 8px",
                  fontSize: "0.6rem",
                  opacity: "0.8",
                  borderColor: `red`,
                  height: "max-content",
                }}
                className={classNames("rounded-pill me-1")}
              >
                Rejected
              </small>
            )}
          </div>
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
  initialLoading: boolean;
  setSelectedDate: Dispatch<SetStateAction<string>>;
}

const TaskSection = ({ title, tasks, selectTask, initialTaskId, initialLoading }: TaskSectionState) => {
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

  const handleDateChange = (date: Date) => {};

  const date = new Date();

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
        {title !== "Completed Task" && (
          <div className="d-flex align-items-center justify-content-end">
            <img src={calender} alt="date logo" width={16.3} className="calender-img" />
            <ReactDatePicker
              onChange={handleDateChange}
              selected={new Date()}
              dateFormat={"dd-MM-yyyy"}
              className="custom-react-date-picker"
            />
          </div>
        )}
      </div>

      {initialLoading ? (
        <SkeletonComponent />
      ) : taskList.length > 0 ? (
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
