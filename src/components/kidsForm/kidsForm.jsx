import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const kidsSchema = Yup.object().shape({
  username: Yup.string()
    .max(100, "Username must be under 100 characters")
    .required("Username is required"),
  first_name: Yup.string()
    .max(100, "First name must be under 100 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .max(100, "Last name must be under 100 characters")
    .required("Last name is required"),
});

const KidsForm = ({
  onSubmit,
  editkidsData,
  isEdit = false,
  isLoading,
}) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
    },
    validationSchema: kidsSchema,
    onSubmit: (values) => {

      let data = {
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
      }
      onSubmit(data);
    },
  });

  useEffect(() => {
    if (isEdit && editkidsData) {
      formik.setValues({
        username: editkidsData.username || "",
        first_name: editkidsData.first_name || "",
        last_name: editkidsData.last_name || "",
      });
    }
  }, [editkidsData, isEdit]);

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-4">
      <div className="row mb-3">
        <label htmlFor="username" className="col-sm-3 col-form-label">
          Username<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            placeholder="Enter username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <div style={{ color: "red" }}>{formik.errors.username}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="first_name" className="col-sm-3 col-form-label">
          First Name<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-control"
            placeholder="Enter first name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.first_name && formik.errors.first_name && (
            <div style={{ color: "red" }}>{formik.errors.first_name}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="last_name" className="col-sm-3 col-form-label">
          Last Name<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-control"
            placeholder="Enter last name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.last_name && formik.errors.last_name && (
            <div style={{ color: "red" }}>{formik.errors.last_name}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-9 offset-sm-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default KidsForm;
