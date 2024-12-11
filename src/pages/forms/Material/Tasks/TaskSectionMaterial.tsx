import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import classNames from "classnames";
import { ReactSortable } from "react-sortablejs";
import calender from "../../../../assets/images/icons/calendar.svg";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.module.css";
import { TaskItemTypes } from "../../../lead_management/Tasks/List/data";
import SkeletonComponent from "../../../lead_management/Tasks/List/StudyPreference/LoadingSkeleton";
import { setColorOpacityRGB } from "../../../../utils/setColorOpacity";
import { calculateDaysAgo, showErrorAlert } from "../../../../constants";
import { Badge, Box, Collapse, Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

interface TaskSectionState {
  title: string;
  tasks: TaskItemTypes[];
  selectTask: (task: TaskItemTypes) => void;
  initialTaskId: number;
  date: string;
  initialLoading: boolean;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  taskPrefix: any;
}

const Task = ({
  task,
  selectTask,
  selectedTaskId,
  taskPrefix,
  title,
}: {
  task: TaskItemTypes;
  selectTask: (task: TaskItemTypes) => void;
  selectedTaskId: number | null;
  taskPrefix: any;
  title: string;
}) => {
  const statusColor = task?.student_name?.preferredCountries[0]?.country_status[0]?.color || "primary";
  const statusName = task?.student_name?.preferredCountries[0]?.country_status[0]?.status_name;
  const currentDate = new Date();

  return (
    <>
      {/* <Row
        className="task__list ribbon-box"
        onClick={() => selectTask(task)}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          // width: "100%",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block", // Prevent content from stretching vertically
          }}
        >
          <label className="form-check-label fs-6" htmlFor={`task-${task.id}`}>
            <span className="text-primary" style={{ fontSize: "12px", fontWeight: "700" }}>
              {taskPrefix + "/" + currentDate.getFullYear() + "/" + (task?.id || "000")}
            </span>
            &nbsp; &nbsp;
            <b style={{ fontSize: "13px" }}>{task.title}</b>
          </label>

          <div className="mt-1">
            {task?.student_name?.flag_details_rows?.map((flag: any) => (
              <small
                style={{
                  color: "black",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 8px",
                  width: "fit-content",
                  fontSize: "10px",
                  borderColor: `${flag?.color}`,
                  height: "max-content",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  opacity: "0.8",
                }}
                className={classNames("rounded-pill me-1 ms-0")}
              >
                {flag?.flag_name}
              </small>
            ))}

            {task?.is_rejected && (
              <small
                style={{
                  backgroundColor: `red`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 6px",
                  fontSize: "0.5rem",
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
        </div>

        <div
          style={{
            whiteSpace: "nowrap",
            textAlign: "right",
            overflow: "hidden",
            display: "flex",
            justifyContent: "start",
            flexDirection: "column",
            gap: "4px",
            padding: "2px 10px 0px 0px",
            backgroundColor: "red",
          }}
        >
          {statusName && (
            <small
              style={{
                backgroundColor: `${statusColor}`,
                color: "white",
                border: `1px solid #122d3d`,
                borderRadius: "5px",
                padding: "2px 10px",
                width: "fit-content",
                fontSize: "0.5rem",
                borderColor: `${statusColor}`,
                height: "max-content",
                textAlign: "center",
                whiteSpace: "nowrap",
                opacity: "0.8",
              }}
              className={classNames("rounded-pill ms-2")}
            >
              {statusName}
            </small>
          )}
          <span style={{ fontSize: "0.65rem" }}>{calculateDaysAgo(task.createdAt)}</span>
        </div>
      </Row> */}

      <div
        className="task__list ribbon-box p-0"
        onClick={() => selectTask(task)}
        style={{
          display: "grid",
          gridTemplateColumns: "9.5fr 2.5fr",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block", // Prevent content from stretching vertically
          }}
          className="p-2"
        >
          <label className="form-check-label fs-6" htmlFor={`task-${task.id}`}>
            <span
              className={classNames(title === "Past" ? "text-danger" : "text-primary")}
              style={{ fontSize: "12px", fontWeight: "700" }}
            >
              {taskPrefix + "/" + currentDate.getFullYear() + "/" + (task?.id || "000")}
            </span>
            &nbsp; &nbsp;
            <b style={{ fontSize: "13px" }}>{task.title}</b>
          </label>

          <div className="mt-1">
            {task?.student_name?.flag_details_rows?.map((flag: any) => (
              <small
                style={{
                  color: "black",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 8px",
                  width: "fit-content",
                  fontSize: "10px",
                  borderColor: `${flag?.color}`,
                  height: "max-content",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  opacity: "0.8",
                }}
                className={classNames("rounded-pill me-1 ms-0")}
              >
                {flag?.flag_name}
              </small>
            ))}

            {task?.is_rejected && (
              <small
                style={{
                  backgroundColor: `red`,
                  color: "white",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 6px",
                  fontSize: "0.5rem",
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
        </div>

        <div
          style={{
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "5px",
            backgroundColor: `${statusColor == "primary" ? "#6C757D40" : statusColor}`,
          }}
        >
          <div className="border_bottom" style={{ textAlign: "center", color: "#fff", fontSize: "10px", fontFamily: "Nunito" }}>
            {statusName}
          </div>
          <div
            className="days_ago"
            style={statusColor == "primary" ? { color: "#000", fontSize: "10px" } : { color: "#fff", fontSize: "10px" }}
          >
            {calculateDaysAgo(task.createdAt)}
          </div>
        </div>
      </div>
    </>
  );
};

const TaskSectionMaterial = ({
  title,
  tasks,
  selectTask,
  initialTaskId,
  initialLoading,
  setSelectedDate,
  taskPrefix,
}: TaskSectionState) => {
  const [taskList, setTaskList] = useState<TaskItemTypes[]>(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(initialTaskId);
  const [collapse, setCollapse] = useState<boolean>(title == "Past" ? false : true);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const handleSelectTask = (task: TaskItemTypes) => {
    setSelectedTaskId(task.id);
    selectTask(task);
  };

  useEffect(() => {
    setSelectedTaskId(initialTaskId);
  }, [initialTaskId]);
  const toggleTask = () => {
    setCollapse(!collapse);
  };

  return (
    <>
      {initialLoading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Link className="text-dark" to="#" onClick={toggleTask}>
            <h5 className="m-0 font-15 py-2">
              {title} <span className="text-muted font-15">({taskList.length})</span>
              <i className={classNames("mdi", { "mdi-chevron-down": collapse, "mdi-chevron-right": !collapse }, "font-18")}></i>
            </h5>
          </Link>
          <Collapse in={collapse}>
            <Card className="mb-0 shadow-none">
              <Card.Body
                className="px-1 pt-1"
                style={{
                  maxHeight: "52vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                  width: "100%",
                  boxSizing: "border-box",
                  scrollbarWidth: "none",
                }}
              >
                {taskList?.length == 0 && <div className="text-left ps-2">No tasks found..</div>}
                <Suspense fallback={null}>
                  <ReactSortable
                    group="taskList1"
                    handle=".task-item"
                    list={taskList}
                    setList={setTaskList}
                    className="task__sort_table"
                  >
                    {(taskList || []).map((task, idx) => (
                      <div
                        key={idx}
                        className={classNames("task-item-one", {
                          [title === "Past" ? "selected-task-pending" : "selected-task"]: task.id === selectedTaskId,
                          [title === "Past" ? "unselected-task-pending" : "unselected-task"]: task.id !== selectedTaskId,
                        })}
                        onClick={() => selectTask(task)}
                        style={{
                          fontFamily: "Nunito",
                        }}
                      >
                        <Task
                          taskPrefix={taskPrefix}
                          selectTask={handleSelectTask}
                          task={task}
                          key={idx}
                          selectedTaskId={selectedTaskId}
                          title={title}
                        />
                      </div>
                    ))}
                  </ReactSortable>
                </Suspense>
              </Card.Body>
            </Card>
          </Collapse>
        </>
      )}
    </>
  );
};

export default TaskSectionMaterial;
