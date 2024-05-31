import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import FileUploader from "../../../../components/FileUploader";
import Attachments from "./Attachments";
import TaskHistory from "./TaskHistory";
import { DateReverse, baseUrl, getTimeFromTimestamp, handleDateFormat, showErrorAlert, showSuccessAlert } from "../../../../constants";
import FeatherIcons from "feather-icons-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getHistoryByLeadId } from "../../../../redux/actions";
import Swal from "sweetalert2";

const TaskDetailsTab = ({ lead_id, getAttachedFiles, attachedFiles, user_id, date }: any) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [commentArray, setCommentArray] = useState<any>([]);
  const [commentId, setCommentId] = useState(null);
  const [commentText, setCommentText] = useState<string>("");

  const dispatch = useDispatch();

  // ============= comments section =============
  const getComments = () => {
    axios.get(`/comments/${lead_id}`).then((res) => {
      setCommentArray(res.data.data);
    });
  };

  const addComment = (e: any) => {
    e.preventDefault();
    axios
      .post(`/comments/${lead_id}`, {
        user_id: user_id,
        comment: commentText,
      })
      .then((res) => {
        // showSuccessAlert(res.data.message);
        getComments();
        setCommentText("");

        axios.post(`leads_history`, { lead_id: lead_id, comments: commentText, date: DateReverse(handleDateFormat(date)) }).then((res) => {
          dispatch(getHistoryByLeadId(lead_id));
        });
      })
      .catch((err) => console.error(err))
      .catch((err) => {
        console.error("Err", err);
        showErrorAlert(err.message);
      });
  };

  const updateComment = (e: any) => {
    e.preventDefault();

    axios
      .put(`/comments/${commentId}`, {
        user_id: user_id,
        comment: commentText,
      })
      .then((res) => {
        // showSuccessAlert(res.data.message);
        getComments();
        setCommentText("");
        setIsUpdate(false);
      })
      .catch((err) => {
        console.error("Err", err);
        showErrorAlert(err.message);
      });
  };

  const handleCommentUpdate = (comment: any) => {
    setCommentText(comment.comment);
    setIsUpdate(true);
    setCommentId(comment.id);
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    setCommentText("");
  };

  // =========== File upload section ==========

  const handleDeleteFile = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`file_upload/${id}`)
          .then((res) => {
            //alert
            showSuccessAlert(res.data.message);
            getAttachedFiles();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  };

  // Create a ref to the target element you want to scroll to
  const targetRef = useRef<HTMLDivElement | null>(null);
  const headerHeight = 100; // Adjust this to match your actual header height
  const scrollToStartOfTarget = () => {
    if (targetRef.current) {
      const topOffset = targetRef.current.getBoundingClientRect().top - headerHeight;
      window.scrollTo({
        top: window.scrollY + topOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (lead_id) {
      getComments();
    }
  }, [lead_id]);
  return (
    <Card>
      <Card.Body>
        <Tabs defaultActiveKey="comments" id="uncontrolled-tab-example" className="mb-0">
          <Tab eventKey="comments" title="Comments">
            {/* add comments */}
            <Row className="mt-1">
              <Col>
                <div className="border rounded" ref={targetRef}>
                  <form onSubmit={isUpdate ? updateComment : addComment}>
                    <textarea
                      rows={3}
                      className="form-control border-0 resize-none"
                      placeholder="Your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    ></textarea>
                    <div className="p-2 bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <Link to="#" className="btn btn-sm px-2 font-16 btn-light">
                          <i className="mdi mdi-cloud-upload-outline"></i>
                        </Link>
                        <Link to="#" className="btn btn-sm px-2 font-16 btn-light">
                          <i className="mdi mdi-at"></i>
                        </Link>
                      </div>
                      <div>
                        {isUpdate && (
                          <button type="reset" className="btn btn-sm btn-danger me-2" onClick={() => handleCancelUpdate()}>
                            <i className="mdi mdi-cancel me-1"></i>Cancel
                          </button>
                        )}
                        <button type="submit" className="btn btn-sm btn-success">
                          <i className="mdi mdi-send me-1"></i>
                          {isUpdate ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
            <div className="row">
              <div className="col">
                {/* <h5 className="mb-2 font-size-16">Comments</h5> */}

                {/* comments */}
                {commentArray?.map((comment: any, idx: any) => (
                  <React.Fragment key={idx}>
                    <div key={idx} className="d-flex align-items-start mt-3 p-1">
                      <img src={`${baseUrl}/${comment.author_avatar}`} className="me-2 rounded-circle" height="36" width="36" alt={comment.author} />
                      <div className="w-100">
                        <FeatherIcons
                          icon="edit"
                          size="13"
                          className="cursor-pointer float-end ms-2 mt-0"
                          onClick={() => {
                            handleCommentUpdate(comment);
                            scrollToStartOfTarget();
                          }}
                        />
                        <h5 className="mt-0 mb-0 font-size-14">
                          <span className="float-end text-muted font-12 ms-1">{getTimeFromTimestamp(comment.created_at)}</span>
                          <span className="float-end text-muted font-12">{handleDateFormat(comment.created_at)}</span>
                          {comment.author}
                        </h5>

                        <p className="mt-1 mb-0 text-muted">{comment.comment}</p>
                      </div>
                    </div>
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Tab>

          <Tab eventKey="attachments" title="Attachments">
            <Row>
              <Col md={6}>
                <FileUploader leadId={lead_id} getAttachedFiles={getAttachedFiles} />
              </Col>

              <Col md={6}>
                {attachedFiles?.map((f: any, index: any) => {
                  const ext = f.file_name.substr(f.file_name.lastIndexOf(".") + 1);
                  return <Attachments key={f.file_name} ext={ext} f={f} index={index} handleDeleteFile={handleDeleteFile} />;
                })}
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="task_history" title="Task history">
            <TaskHistory leadId={lead_id} />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default TaskDetailsTab;