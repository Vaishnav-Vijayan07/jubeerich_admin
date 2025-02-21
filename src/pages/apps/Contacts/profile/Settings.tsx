import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import { FormInput } from "../../../../components";
import axios from "axios";

const Settings = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage("");
    setSuccess(false);
    
    try {
      const response = await axios.post("/reset_password", {
        oldpassword: data.oldPassword,
        newpassword: data.newPassword,
      });

      setMessage(response.data.message);
      setSuccess(true);
      reset(); // Clear form fields on success
    } catch (error: any) {
      console.log(error);
      setMessage(error);
      setSuccess(false);
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-start mt-4">
          <h5 className="mb-2 text-uppercase">
            <i className="mdi mdi-account-circle me-1"></i> Change Password
          </h5>
          <Row>
            <Col md={6}>
              <FormInput
                label="Old Password"
                type="password"
                placeholder="Enter old password"
                register={register}
                errors={errors}
                name="oldPassword"
                required={true}
              />
            </Col>
            <Col md={6}>
              <FormInput
                label="New Password"
                type="password"
                placeholder="Enter new password"
                register={register}
                errors={errors}
                name="newPassword"
                required={true}
              />
            </Col>
          </Row>
          {message && (
            <p className={`mt-2 ${success ? "text-success" : "text-danger"}`}>
              {message}
            </p>
          )}
          <button type="submit" className="btn btn-success mt-2" disabled={loading}>
            {loading ? (
              "Saving..."
            ) : (
              <>
                <i className="mdi mdi-content-save"></i> Save
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Settings;