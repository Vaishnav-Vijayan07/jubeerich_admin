import React, { useEffect, useRef, useState } from "react";
import { Badge, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import FeatherIcons from "feather-icons-react";
import axios from "axios";
import { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";
import { getTimeFromTimestamp, handleDateFormat, showErrorAlert, showSuccessAlert } from "../../../../constants";
import classNames from "classnames";
import SkeletonComponent from "./StudyPreference/LoadingSkeleton";

const Comments = ({ studentId }: any) => {
  const commentBox = useRef<any>(null);

  const [isUpdate, setisUpdate] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [commentText, setCommentText] = useState("");
  const [commentArray, setCommentArray] = useState([]);
  const [commentId, setCommentId] = useState(null);

  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => ({
    user: state.Auth.user,
  }));

  const scrollToTextarea = () => {
    console.log("outside");
    if (commentBox?.current) {
      console.log("here");

      commentBox.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  const fetchAllComments = async (countryId: any) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`comment/${studentId}/${countryId}`);
      setCommentArray(data.data.formattedComments);
      if (countryId === "all") setCountries(data.data.countries);
    } catch (error: any) {
      console.error("Error fetching comments:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setisUpdate(false);
    setCommentText("");
    setCommentId(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        const response = await axios.put(`comment/${commentId}`, {
          comment: commentText,
        });
        setCommentText("");
        showSuccessAlert(response?.data?.message);
        setisUpdate(false);
        fetchAllComments(selectedCountry);
      } else {
        const response = await axios.post("comment", {
          lead_id: studentId,
          user_id: user?.user_id,
          comment: commentText,
        });
        setCommentText("");
        showSuccessAlert(response?.data?.message);
        fetchAllComments(selectedCountry);
      }
    } catch (error: any) {
      console.error("Error fetching comments:", error.message);
      showErrorAlert("An error occured");
    }
  };

  const handleCommentUpdate = (comment: any) => {
    scrollToTextarea();
    setisUpdate(true);
    setCommentText(comment.comment);
    setCommentId(comment.id);
  };

  useEffect(() => {
    fetchAllComments(selectedCountry);
  }, [selectedCountry]);

  const handleCountryWiseHistory = (countryId: any, countryName: any) => {
    console.log(countryId, countryName);

    setSelectedCountry(countryId);
    console.log(selectedCountry);
  };

  // if (loading) {
  //   return (
  //     <Spinner
  //       animation="border"
  //       style={{ position: "absolute", top: "100%", left: "50%" }}
  //     />
  //   );
  // }

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <>
          <Row className="mb-3 mt-3">
            <Col md={6}>
              <div className="d-flex flex-wrap">
                <small
                  style={{
                    backgroundColor: selectedCountry === "all" ? "#00ce64" : "#9dd3f5",
                    color: "#122d3d",
                    padding: "4px 10px",
                  }}
                  className={classNames("rounded-pill fs-6 me-1 cursor-pointer")}
                  onClick={() => handleCountryWiseHistory("all", "All Countries")}
                >
                  All Countries
                </small>
                {countries.length > 0 &&
                  countries.map((country: any) => (
                    <small
                      key={country.id}
                      style={{
                        backgroundColor: selectedCountry === country.id ? "#00ce64" : "#9dd3f5",
                        color: "#122d3d",
                        padding: "4px 10px",
                      }}
                      className={classNames("rounded-pill fs-6 me-1 cursor-pointer")}
                      onClick={() => handleCountryWiseHistory(country.id, country.country)}
                    >
                      {country.country}
                    </small>
                  ))}
              </div>
            </Col>
          </Row>
          <div>
            <div className="row">
              <div className="col">
                <h5 className="mb-2 font-size-16">Comments</h5>
                {commentArray.length == 0 && <p>No comments...</p>}

                {/* comments */}
                {commentArray?.map((comment: any, idx: any) => (
                  <React.Fragment key={idx}>
                    <div key={idx} className="d-flex align-items-start mt-3 p-1">
                      <div
                        className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
                        style={{ width: "30px", height: "30px", fontSize: "13px" }}
                      >
                        {comment?.user?.name.charAt(0)}
                      </div>
                      <div className="w-100">
                        {comment?.user_id === user.user_id && (
                          <FeatherIcons
                            icon="edit"
                            size="13"
                            className="cursor-pointer float-end ms-2 mt-0"
                            onClick={() => {
                              handleCommentUpdate(comment);
                            }}
                          />
                        )}
                        <h5 className="mt-0 mb-0 font-size-14">
                          <span className="float-end text-muted font-12 ms-1">{getTimeFromTimestamp(comment.createdAt)}</span>
                          <span className="float-end text-muted font-12">{handleDateFormat(comment.createdAt)}</span>
                          {comment?.user?.name}
                        </h5>
                        <Badge>{comment?.country ? comment?.country?.country_name : null}</Badge>
                        <p className="mt-1 mb-0 text-muted">{comment.comment}</p>
                      </div>
                    </div>
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <Row className="mt-3">
              <Col>
                <div className="border rounded" ref={commentBox}>
                  <form onSubmit={handleSubmit}>
                    <textarea
                      rows={3}
                      className="form-control border-0 resize-none"
                      placeholder="Your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                    ></textarea>
                    <div className="p-2 bg-light d-flex justify-content-between align-items-center">
                      <div></div>
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
          </div>
        </>
      )}
    </>
  );
};

export default Comments;
