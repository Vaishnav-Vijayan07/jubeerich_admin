import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeatherIcons from "feather-icons-react";
import axios from 'axios';
import { RootState } from '../../../../redux/store';
import { useSelector } from 'react-redux';
import { getTimeFromTimestamp, handleDateFormat, showErrorAlert, showSuccessAlert } from '../../../../constants';

const Comments = ({ studentId }: any) => {
    const [isUpdate, setisUpdate] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [commentArray, setCommentArray] = useState([])
    const [commentId, setCommentId] = useState(null);


    const { user } = useSelector((state: RootState) => ({ user: state.Auth.user }));

    console.log("user ==> ", user);


    const fetchAllComments = async () => {
        try {
            const response = await axios.get(`comment/${studentId}`);
            console.log("Comments fetched successfully:", response.data);
            setCommentArray(response.data.data)

        } catch (error: any) {
            console.error("Error fetching comments:", error.message);
        }
    };

    const handleCancelUpdate = () => {
        setisUpdate(false);
        setCommentText("");
        setCommentId(null)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            if (isUpdate) {
                const response = await axios.put(`comment/${commentId}`, {
                    comment: commentText
                })
                setCommentText("")
                showSuccessAlert(response?.data?.message)
                setisUpdate(false)
                fetchAllComments()
            } else {
                const response = await axios.post("comment", {
                    lead_id: studentId,
                    user_id: user?.user_id,
                    comment: commentText
                })
                setCommentText("")
                showSuccessAlert(response?.data?.message)
                fetchAllComments()
            }
        } catch (error: any) {
            console.error("Error fetching comments:", error.message);
            showErrorAlert("An error occured")
        }
    }

    const handleCommentUpdate = (comment: any) => {
        setisUpdate(true)
        setCommentText(comment.comment)
        setCommentId(comment.id)
    }

    useEffect(() => {
        fetchAllComments()
    }, [])

    return (
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
                                    style={{ width: '30px', height: '30px', fontSize: '13px' }}
                                >{comment?.user?.charAt(0)}</div>
                                <div className="w-100">
                                    {comment?.user_id === user.user_id &&
                                        <FeatherIcons
                                            icon="edit"
                                            size="13"
                                            className="cursor-pointer float-end ms-2 mt-0"
                                            onClick={() => {
                                                handleCommentUpdate(comment);
                                            }}
                                        />
                                    }
                                    <h5 className="mt-0 mb-0 font-size-14">
                                    <span className="float-end text-muted font-12 ms-1">{getTimeFromTimestamp(comment.createdAt)}</span>
                                    <span className="float-end text-muted font-12">{handleDateFormat(comment.createdAt)}</span>
                                        {comment?.user}
                                    </h5>

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
                    <div className="border rounded">
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
        </div>
    )
}

export default Comments