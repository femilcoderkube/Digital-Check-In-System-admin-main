import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo.png";
import { forgotPasswordSchema } from "../../../validationSchemas/validationSchemas";
import toast from "react-hot-toast";
import { ButtonWithLoader } from "../../../components/buttons/Buttons";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const userEmail = JSON.parse(localStorage.getItem("email"));
      const token = JSON.parse(localStorage.getItem("reset-token"));

      const body = {
        email: userEmail,
        token: token || null,
        password: values?.newPassword,
        password_confirmation: values?.confirmNewPassword,
      };

      try {
        console.log("Form submitted with values:", body);

        // Example success behavior
        toast.success("Password reset successfully!");
        localStorage.removeItem("reset-token");
        localStorage.removeItem("email");
        navigate("/login");
      } catch (error) {
        toast.error("Something went wrong!");
      }
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
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <Link
                    to="/login"
                    className="logo d-flex align-items-center w-auto"
                  >
                    <img src={logo} alt="Logo" />
                    <span className="d-none d-lg-block">
                      Digital Check In System
                    </span>
                  </Link>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Create new password
                      </h5>
                      <p className="text-center small">
                        Your new password must be unique from those previously
                        used.
                      </p>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                      {/* New Password */}
                      <div className="row mb-3">
                        <label
                          htmlFor="newPassword"
                          className="col-md-6 col-lg-5 col-form-label"
                        >
                          New Password
                        </label>
                        <div className="col-md-6 col-lg-7">
                          <div style={{ position: "relative" }}>
                            <input
                              className={`form-control ${
                                formik.touched.newPassword &&
                                formik.errors.newPassword
                                  ? "input-offer-error"
                                  : "input-bg-error"
                              }`}
                              placeholder="Please enter new password"
                              type={showPassword.new ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.newPassword}
                              style={{ paddingRight: "20%" }}
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
                                <i className="bi bi-eye"></i>
                              ) : (
                                <i className="bi bi-eye-slash"></i>
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

                      {/* Confirm Password */}
                      <div className="row mb-3">
                        <label
                          htmlFor="confirmNewPassword"
                          className="col-md-6 col-lg-5 col-form-label"
                        >
                          Confirm Password
                        </label>
                        <div className="col-md-6 col-lg-7">
                          <div style={{ position: "relative" }}>
                            <input
                              className={`form-control ${
                                formik.touched.confirmNewPassword &&
                                formik.errors.confirmNewPassword
                                  ? "input-offer-error"
                                  : "input-bg-error"
                              }`}
                              placeholder="Please enter confirm password"
                              type={showPassword.confirm ? "text" : "password"}
                              id="confirmNewPassword"
                              name="confirmNewPassword"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirmNewPassword}
                              style={{ paddingRight: "20%" }}
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
                                <i className="bi bi-eye"></i>
                              ) : (
                                <i className="bi bi-eye-slash"></i>
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

                      {/* Submit */}
                      <div className="d-flex justify-content-center mb-3">
                        <ButtonWithLoader
                          isLoading={false}
                          buttonText="Reset Password"
                          type="submit"
                          className="btn btn-outline-primary"
                        />
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
};

export default ForgotPassword;
