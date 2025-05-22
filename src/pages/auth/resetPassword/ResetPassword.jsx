import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../../../validationSchemas/validationSchemas";
import { BASE_URL } from "../../../utils/api";

function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      navigate("/login");
    }
  }, [tokenFromUrl]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      console.log("Form Values:", values);

      try {
        const response = await axios.post(
          `${BASE_URL}/admin/resetPassword`,
          { new_password: values?.newPassword, token: token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("res", response);
        if (response?.status === 200) {
          localStorage.removeItem("token");
          localStorage.removeItem("adminData");
          navigate("/login");
        }
        toast.success(response.data.message || "reset password successfully!");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update password"
        );
      }
      formik.resetForm();
    },
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <Link
                    to="/login"
                    className="logo d-flex align-items-center w-auto"
                  >
                    {/* <img src={logo} alt="" /> */}
                    <span className="d-none d-lg-block">
                      Digital Check In System
                    </span>
                  </Link>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <form onSubmit={formik.handleSubmit}>
                      {/* New Password */}
                      <div className="row mb-3">
                        <label
                          className="col-md-4 col-lg-3 col-form-label"
                          htmlFor="newPassword"
                        >
                          New Password
                          <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span>
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <div style={{ position: "relative" }}>
                            <input
                              type={showPassword.new ? "text" : "password"}
                              className={`form-control ${
                                formik.touched.newPassword &&
                                formik.errors.newPassword
                                  ? "input-offer-error"
                                  : "input-bg-error"
                              }`}
                              placeholder="Please enter new password"
                              id="newPassword"
                              name="newPassword"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.newPassword}
                              style={{ paddingRight: "10%" }}
                            />
                            <span
                              onClick={() => togglePasswordVisibility("new")}
                              style={{
                                position: "absolute",
                                top: "60%",
                                right: "10px",
                                cursor: "pointer",
                                transform: "translateY(-50%)",
                              }}
                            >
                              {showPassword.new ? (
                                <i className="bi bi-eye" />
                              ) : (
                                <i className="bi bi-eye-slash" />
                              )}
                            </span>
                          </div>
                          {formik.touched.newPassword &&
                            formik.errors.newPassword && (
                              <div style={{ color: "red" }}>
                                {formik.errors.newPassword}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div className="row mb-3">
                        <label
                          className="col-md-4 col-lg-3 col-form-label"
                          htmlFor="confirmNewPassword"
                        >
                          Re-enter New Password
                          <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span>
                        </label>
                        <div className="col-md-8 col-lg-9">
                          <div style={{ position: "relative" }}>
                            <input
                              type={showPassword.confirm ? "text" : "password"}
                              className={`form-control ${
                                formik.touched.confirmNewPassword &&
                                formik.errors.confirmNewPassword
                                  ? "input-offer-error"
                                  : "input-bg-error"
                              }`}
                              placeholder="Please re-enter new password"
                              id="confirmNewPassword"
                              name="confirmNewPassword"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirmNewPassword}
                              style={{ paddingRight: "10%" }}
                            />
                            <span
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                              style={{
                                position: "absolute",
                                top: "60%",
                                right: "10px",
                                cursor: "pointer",
                                transform: "translateY(-50%)",
                              }}
                            >
                              {showPassword.confirm ? (
                                <i className="bi bi-eye" />
                              ) : (
                                <i className="bi bi-eye-slash" />
                              )}
                            </span>
                          </div>
                          {formik.touched.confirmNewPassword &&
                            formik.errors.confirmNewPassword && (
                              <div style={{ color: "red" }}>
                                {formik.errors.confirmNewPassword}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-flex justify-content-center mb-3">
                        <button
                          type="submit"
                          className="btn btn-outline-primary"
                        >
                          Reset Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ResetPassword;
