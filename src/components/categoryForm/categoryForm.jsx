import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const photoSchema = Yup.object().shape({
  photoTitle: Yup.string()
    .max(100, "Title must be under 100 characters")
    .required("Photo title is required"),
  photoDescription: Yup.string()
    .max(500, "Description must be under 500 characters")
    .required("Photo description is required"),
  photo: Yup.mixed()
    .required("Photo is required")
    .test("fileSize", "File too large", (value) =>
      value ? value.size <= 5 * 1024 * 1024 : false
    )
    .test("fileType", "Unsupported file format", (value) =>
      value ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type) : false
    ),
});

const CategoryForm = ({ onSubmit, isLoading = false }) => {
  const formik = useFormik({
    initialValues: {
      photoTitle: "",
      photoDescription: "",
      photo: null,
    },
    validationSchema: photoSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("photoTitle", values.photoTitle);
      formData.append("photoDescription", values.photoDescription);
      formData.append("photo", values.photo);
      onSubmit(formData);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-4">
      
      {/* Photo Upload */}
      <div className="row mb-3">
        <label htmlFor="photo" className="col-sm-2 col-form-label">
          Upload Photo<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="file"
            id="photo"
            name="photo"
            className="form-control"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("photo", event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.photo && formik.errors.photo && (
            <div style={{ color: "red" }}>{formik.errors.photo}</div>
          )}
        </div>
      </div>
      {/* Title */}
      <div className="row mb-3">
        <label htmlFor="photoTitle" className="col-sm-2 col-form-label">
           Title<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            id="photoTitle"
            name="photoTitle"
            className="form-control"
            placeholder="Enter photo title"
            value={formik.values.photoTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.photoTitle && formik.errors.photoTitle && (
            <div style={{ color: "red" }}>{formik.errors.photoTitle}</div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="row mb-3">
        <label htmlFor="photoDescription" className="col-sm-2 col-form-label">
          Description<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-10">
          <textarea
            id="photoDescription"
            name="photoDescription"
            className="form-control"
            placeholder="Enter photo description"
            rows="4"
            value={formik.values.photoDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></textarea>
          {formik.touched.photoDescription &&
            formik.errors.photoDescription && (
              <div style={{ color: "red" }}>
                {formik.errors.photoDescription}
              </div>
            )}
        </div>
      </div>


      {/* Submit Button */}
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CategoryForm;
