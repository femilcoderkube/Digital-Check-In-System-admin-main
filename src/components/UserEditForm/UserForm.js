import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { UsersSchema } from "../../validationSchemas/validationSchemas";
import { useDispatch } from "react-redux";
import useImageDropzone from "../../hook/useImageDropzone";
import ImagePreview from "../imagePreview/ImagePreview";

const UserForm = ({ editUserData, onSubmit, isEdit = false, isLoading }) => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, [dispatch, editUserData]);

  useEffect(() => {
    if (isEdit && editUserData?.image) {
      setPreviewImage(editUserData?.image);
    }
    setErrorMessage("");
  }, [isEdit, editUserData]);

  const formik = useFormik({
    initialValues: {
      firstName: editUserData?.first_name || "",
      lastName: editUserData?.last_name || "",
      email: editUserData?.email || "",
      contactNo: editUserData?.contact_no || "",
      LoginType: editUserData?.social_type,
      isVerified: editUserData?.is_verified,
      image: editUserData?.image || null,
    },
    validationSchema: UsersSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("first_name", values?.firstName);
      formData.append("last_name", values?.lastName || null);
      formData.append("email", values?.email || null);
      formData.append("contact_no", values?.contactNo || null);
      formData.append("social_type", values?.LoginType);
      formData.append("is_verified", values?.isVerified);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      try {
        await onSubmit(formData);
        formik.resetForm();
      } catch (error) {
        console.log("Something went wrong");
      }
    },
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    previewImage,
    file,
    setPreviewImage,
    setFile,
  } = useImageDropzone(formik, "image", setErrorMessage);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row mb-3">
        <label htmlFor="firstName" className="col-sm-2 col-form-label">
          First Name<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="firstName"
            className={`form-control ${
              formik.touched.firstName && formik.errors.firstName
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="firstName"
            placeholder="Enter first name"
            value={formik.values.firstName}
            onChange={(e) => {
              formik.setFieldValue("firstName", e.target.value.trimStart());
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div style={{ color: "red" }}>{formik.errors.firstName}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="lastName" className="col-sm-2 col-form-label">
          Last Name<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="lastName"
            className={`form-control ${
              formik.touched.lastName && formik.errors.lastName
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="lastName"
            placeholder="Enter last name"
            value={formik.values.lastName}
            onChange={(e) => {
              formik.setFieldValue("lastName", e.target.value.trimStart());
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div style={{ color: "red" }}>{formik.errors.lastName}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="email" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="email"
            className={`form-control ${
              formik.touched.email && formik.errors.email
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="email"
            placeholder="Enter email"
            value={formik.values.email}
            disabled
          />
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="contactNo" className="col-sm-2 col-form-label">
          Contact No.<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="contactNo"
            className={`form-control ${
              formik.touched.contactNo && formik.errors.contactNo
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="contactNo"
            maxLength={10}
            placeholder="Enter contact no"
            value={formik.values.contactNo}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              if (numericValue?.length > 0 && numericValue?.[0] !== "0") {
                formik.setFieldValue(
                  "contactNo",
                  `0${numericValue.trimStart()}`
                );
              } else {
                formik.setFieldValue("contactNo", numericValue.trimStart());
              }
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.contactNo && formik.errors.contactNo && (
            <div style={{ color: "red" }}>{formik.errors.contactNo}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="LoginType" className="col-sm-2 col-form-label">
          Login Type
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="LoginType"
            className={`form-control ${
              formik.touched.LoginType && formik.errors.LoginType
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="LoginType"
            placeholder="Social Type"
            value={
              formik.values.LoginType
                ? formik.values.LoginType.charAt(0).toUpperCase() +
                  formik.values.LoginType.slice(1)
                : ""
            }
            disabled
          />
          {formik.touched.LoginType && formik.errors.LoginType && (
            <div style={{ color: "red" }}>{formik.errors.LoginType}</div>
          )}
        </div>
      </div>

      {/* <div className="row mb-3">
        <label htmlFor="isVerified" className="col-sm-2 col-form-label">
          Verified
        </label>
        <div className="col-sm-10">
          <div className="form-check">
            <input
              type="checkbox"
              name="isVerified"
              className="form-check-input"
              id="isVerified"
              checked={formik.values.isVerified === 1}
              onChange={(e) => {
                formik.setFieldValue("isVerified", e.target.checked ? 1 : 0);
              }}
            />
            <label className="form-check-label" htmlFor="isVerified">
              {formik.values.isVerified === 1}
            </label>
          </div>
          {formik.touched.isVerified && formik.errors.isVerified && (
            <div style={{ color: "red" }}>{formik.errors.isVerified}</div>
          )}
        </div>
      </div> */}

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">User Image</label>
        <div className="col-sm-10">
          <div
            {...getRootProps()}
            className={`dropzone ${
              isDragActive ? "dropzone-active" : ""
            } form-control ${
              formik.touched.image && formik.errors.image && !errorMessage
                ? "input-offer-error"
                : "input-bg-error"
            }`}
          >
            <input
              {...getInputProps()}
              name="image"
              id="image"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.type.startsWith("image/")) {
                    formik.setFieldValue("image", file);
                    setFile(file);
                    setPreviewImage(URL.createObjectURL(file));
                    setErrorMessage("");
                  } else {
                    setPreviewImage(null);
                    formik.setFieldValue("image", null);
                    setErrorMessage("Only image files are accepted.");
                  }
                }
              }}
            />
            {isDragActive ? (
              <p className="m-0 pt-2">Drop the file here...</p>
            ) : (
              <p className="m-0 pt-2">
                Drag & drop your file here, or click to browse.
              </p>
            )}
          </div>
          {errorMessage ? (
            <div style={{ color: "red", marginTop: "5px" }}>{errorMessage}</div>
          ) : (
            formik.touched.image &&
            formik.errors.image && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {formik.errors.image}
              </div>
            )
          )}
          {formik.values.image && (
            <div>
              <strong>Selected File:</strong> {formik.values.image.name}
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <ImagePreview
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          setErrorMessage={setErrorMessage}
          formik={formik}
          fieldName="image"
          colsize="col-sm-2 col-form-label"
          user={true}
        />
      )}

      <div className="row mb-3">
        <div className="col-sm-10 offset-sm-2">
          <button
            type="submit"
            disabled={isLoading === "loading" || !!errorMessage}
            className="btn btn-outline-primary"
          >
            {isLoading === "loading"
              ? isEdit
                ? "Update..."
                : "Add..."
              : isEdit
              ? "Update"
              : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;
