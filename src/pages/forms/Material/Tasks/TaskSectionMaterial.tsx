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
import { calculateDaysAgo } from "../../../../constants";
import { Badge, Box, Tab, Tabs } from "@mui/material";

interface TaskSectionState {
  title: string;
  tasks: TaskItemTypes[];
  selectTask: (task: TaskItemTypes) => void;
  initialTaskId: number;
  date: string;
  initialLoading: boolean;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  incompleteTasks: TaskItemTypes[]
}

const Task = ({
  task,
  selectTask,
  selectedTaskId,
}: {
  task: TaskItemTypes;
  selectTask: (task: TaskItemTypes) => void;
  selectedTaskId: number | null;
}) => {

  
  const statusColor = task?.student_name?.preferredCountries[0]?.country_status[0]?.color || "primary";

  const badgeStyle = {
    '& .MuiBadge-dot': {
      transform: 'translateX(1px) translateY(5px)',
      // transform: 'translateY(-6px) translateX(6px)',
      zIndex: 0,
      bgcolor: statusColor
    },
  }

  return (
    <>
      <Row
        className={classNames("task__list ribbon-box unselected-task", {
          "selected-task": task.id === selectedTaskId,
        })}
        onClick={() => selectTask(task)}
        style={{
          fontFamily: "Nunito",
          borderBottom: "1.3px solid #70707033",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          width: "100%",
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
            <span className="text-primary" style={{ fontSize: "12px", fontWeight: "700" }}>{`JBR${task.id}`}</span>
            &nbsp; &nbsp;
            <b style={{ fontSize: "13px"}}>{task.title}</b>
          </label>

          <div>
            {task?.student_name?.flag_details_rows?.map((flag: any) => (
              <small
                style={{
                  backgroundColor: setColorOpacityRGB(flag?.color),
                  color: "black",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "1px 8px",
                  width: "fit-content",
                  fontSize: "0.5rem",
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

        <Badge className="w-100" color={statusColor} variant="dot" sx={{...badgeStyle}} >
        {/* <Badge className="w-100" color={statusColor} variant="dot" sx={{...badgeStyle}} > */}
        <div
          style={{
            whiteSpace: "nowrap",
            textAlign: "right",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap:"4px"
          }}
        >
          <span style={{fontSize: "0.7rem"}}>{calculateDaysAgo(task.createdAt)}</span>
          {task?.student_name?.status?.status_name && (
            <small
              style={{
                backgroundColor: `${task?.student_name?.status?.color}`,
                color: "white",
                border: `1px solid #122d3d`,
                borderRadius: "5px",
                padding: "2px 10px",
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
    </Badge>
      </Row>
      {/* <Row
        className={classNames("task__list ribbon-box unselected-task", {
          "selected-task": task.id === selectedTaskId,
        })}
        onClick={() => selectTask(task)}
        style={{
          fontFamily: "Nunito",
          borderBottom: "1.3px solid #70707033",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "100%", // Ensure the container takes full width of its grid cell
          }}
        >
          <label className="form-check-label fs-5" htmlFor={`task-${task.id}`}>
            <span className="text-primary" style={{ fontSize: "14px", fontWeight: "700" }}>{`JBR${task.id}`}</span>
            &nbsp; &nbsp;
            <b>{task.title}</b>
          </label>
        </div>
        <div
          style={{
            whiteSpace: "nowrap",
            textAlign: "right",
            overflow: "hidden",
            flexShrink: 0, // Prevent the right content from shrinking and making the text wrap
          }}
        >
          <span>{calculateDaysAgo(task.createdAt)}</span>
        </div>
      </Row> */}

      {/* <Row
        className={classNames("justify-content-sm-between task__list ribbon-box unselected-task", {
          "selected-task": task.id === selectedTaskId,
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
            {task?.student_name?.flag_details_rows?.map((flag: any) => (
              <small
                style={{
                  backgroundColor: setColorOpacityRGB(flag?.color),
                  color: "black",
                  border: `1px solid #122d3d`,
                  borderRadius: "5px",
                  padding: "2px 10px",
                  width: "fit-content",
                  fontSize: "0.6rem",
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
      </Row> */}
    </>
  );
};

const TaskSectionMaterial = ({ title, tasks, selectTask, initialTaskId, initialLoading, setSelectedDate, incompleteTasks }: TaskSectionState) => {
  const [taskList, setTaskList] = useState<TaskItemTypes[]>(tasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(initialTaskId);
  const [selectedFollowupDate, setSelectedFollowupDate] = useState<any>("");
  const [tabValue, setTabValue] = React.useState('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const tabsStyle = {
    "& .MuiTabs-indicator": {
      backgroundColor: "#26BCA2",
      height: "4px",
    },
  };

  const individualTabStyle = {
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 400,
  fontSize: "12px", 
  maxHeight: "32px",
    "&.Mui-selected": {
      color: "black",
      fontFamily: "'Nunito', sans-serif",
      fontWeight: 700,
      fontSize: "12px",
    },
  };

  const badgeStyle = {
    '& .MuiBadge-badge': {
      transform: 'translate(80%, -60%)',
      backgroundColor: '#1976d2',
      color: '#fff',
      fontSize: '10px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '50%',
      padding: '0 6px',
    },
  };

  const pendingBadgeStyle = {
    '& .MuiBadge-badge': {
      transform: 'translate(85%, -60%)',
      backgroundColor: '#1976d2',
      color: '#fff',
      fontSize: '10px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '50%',
      padding: '0 6px',
    },
  };

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

  const handleFollowupFilter = (date: any) => {
    setSelectedFollowupDate(date);
    setSelectedDate(date);
  };

  return (
    <>
      <div>
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
              <img src={calender} alt="date logo" width={16.3} className="calender-img" style={{ paddingBottom: "3px" }} />
              <ReactDatePicker
                onChange={(date) => handleFollowupFilter(date)}
                selected={selectedFollowupDate || new Date()}
                dateFormat={"dd-MM-yyyy"}
                onKeyDown={(e) => e.preventDefault()}
                className="custom-react-date-picker"
              />
            </div>
          )}
        </div>
      </div>

      {initialLoading ? (
        <SkeletonComponent />
      ) : taskList.length > 0 ? (
        <Card className="mb-0 shadow-none" style={{ borderTop: "1.3px solid #70707033" }}>
          <Card.Body
            className="px-0 mt-2 pt-0"
            style={{
              maxHeight: "52vh",
              overflowY: "auto",
              overflowX: "hidden",
              width: "100%",
              boxSizing: "border-box",
              scrollbarWidth: "none",
            }}
          >
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                  sx={{ ...tabsStyle }}
                >
                  <Tab value="all" label={
                    <Badge badgeContent={taskList?.length || 0} color="primary" sx={{...badgeStyle}}>
                      All
                    </Badge>
                  }
                    sx={{ ...individualTabStyle }} />
                  <Tab value="pending" label={
                    <Badge badgeContent={incompleteTasks?.length || 0} color="primary" sx={{...pendingBadgeStyle}}>
                      Pending
                    </Badge>
                  }sx={{ ...individualTabStyle }} />
                </Tabs>
              </Box>

              <Box sx={{ mt: 2 }}>

                {tabValue === "all" && (
                  <Suspense fallback={null}>
                    <ReactSortable group="taskList1" handle=".task-item" list={taskList} setList={setTaskList}>
                      {(taskList || []).map((task, idx) => (
                        <div key={idx} className="task-item-one">
                          <Task selectTask={handleSelectTask} task={task} key={idx} selectedTaskId={selectedTaskId} />
                        </div>
                      ))}
                    </ReactSortable>
                  </Suspense>
                )}

                {tabValue === "pending" && (
                  <Suspense fallback={null}>
                    <ReactSortable group="taskList1" handle=".task-item" list={taskList} setList={setTaskList}>
                      {(incompleteTasks || []).map((task, idx) => (
                        <div key={idx} className="task-item-one">
                          <Task selectTask={handleSelectTask} task={task} key={idx} selectedTaskId={selectedTaskId} />
                        </div>
                      ))}
                    </ReactSortable>
                  </Suspense>
                )}
                
              </Box>

            {/* <ReactSortable group="taskList1" handle=".task-item" list={taskList} setList={setTaskList}>
              {(taskList || []).map((task, idx) => (
                <div key={idx} className="task-item-one">
                  <Task selectTask={handleSelectTask} task={task} key={idx} selectedTaskId={selectedTaskId} />
                </div>
              ))}
            </ReactSortable> */}
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

export default TaskSectionMaterial;
