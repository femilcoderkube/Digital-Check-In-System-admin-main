import React, { useState } from "react";
import { useFormik } from "formik";
import { changePasswordSchema } from "../../../validationSchemas/validationSchemas";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../utils/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();
  const userid = JSON.parse(localStorage.getItem("adminData"));
  const token = localStorage.getItem("token");
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      console.log("Form Values:", values);

      try {
        const response = await axios.post(
          `${BASE_URL}/admin/changePassword`,
          {
            admin_id: userid?._id,
            old_password: values?.currentPassword,
            new_password: values?.confirmNewPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.data) {
          console.log("response?.data?.data", response?.data?.data);
          localStorage.removeItem("token");
          localStorage.removeItem("adminData");
          navigate("/login");
          // localStorage.setItem(
          //   "adminData",
          //   JSON.stringify(response?.data?.data)
          // );
          // localStorage.setItem("token", response?.data?.data?.authToken);
        }
        toast.success(response.data.message || "change password successfully!");
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
    <form onSubmit={formik.handleSubmit}>
      {/* Current Password */}
      <div className="row mb-3">
        <label
          className="col-md-4 col-lg-3 col-form-label"
          htmlFor="currentPassword"
        >
          Current Password
          <span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-md-8 col-lg-9">
          <div style={{ position: "relative" }}>
            <input
              type={showPassword.current ? "text" : "password"}
              className={`form-control ${
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? "input-offer-error"
                  : "input-bg-error"
              }`}
              placeholder="Please enter current password"
              id="currentPassword"
              name="currentPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              style={{ paddingRight: "10%" }}
            />
            <span
              onClick={() => togglePasswordVisibility("current")}
              style={{
                position: "absolute",
                top: "60%",
                right: "10px",
                cursor: "pointer",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword.current ? (
                <i className="bi bi-eye" />
              ) : (
                <i className="bi bi-eye-slash" />
              )}
            </span>
          </div>
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <div style={{ color: "red" }}>{formik.errors.currentPassword}</div>
          )}
        </div>
      </div>

      {/* New Password */}
      <div className="row mb-3">
        <label
          className="col-md-4 col-lg-3 col-form-label"
          htmlFor="newPassword"
        >
          New Password<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-md-8 col-lg-9">
          <div style={{ position: "relative" }}>
            <input
              type={showPassword.new ? "text" : "password"}
              className={`form-control ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? "input-offer-error"
                  : "input-bg-error"
              }`}
              placeholder="Please enter new password"
              id="newPassword"
              name="newPassword"
              // onChange={formik.handleChange}
              onChange={(e) => {
                const noSpaces = e.target.value.replace(/\s/g, ""); // Remove all spaces
                formik.setFieldValue("newPassword", noSpaces);
              }}
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
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div style={{ color: "red" }}>{formik.errors.newPassword}</div>
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
          <span style={{ color: "red", fontSize: "25px" }}>*</span>
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
              // onChange={formik.handleChange}
              onChange={(e) => {
                const noSpaces = e.target.value.replace(/\s/g, "");
                formik.setFieldValue("confirmNewPassword", noSpaces);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.confirmNewPassword}
              style={{ paddingRight: "10%" }}
            />
            <span
              onClick={() => togglePasswordVisibility("confirm")}
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
        <button type="submit" className="btn btn-outline-primary">
          Change Password
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
