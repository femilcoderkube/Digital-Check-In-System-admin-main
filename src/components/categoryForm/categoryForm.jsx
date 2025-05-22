import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ColorPicker from "react-pick-color";

const photoSchema = Yup.object().shape({
  name: Yup.string()
    .trim("Name cannot be just blank spaces") // Removes leading/trailing spaces
    .strict(true) // Ensures .trim() is actually enforced
    .max(100, "Name must be under 100 characters")
    .required("Feeling name is required"),
  color_code: Yup.string()
    .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color code")
    .required("Color code is required"),
  icon: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      // Allow null, undefined, or string (existing URL like "http://192.168.1.11:8089/uploads/icon-1747386054804-121253819.gif")
      if (!value || typeof value === "string") return true;
      // Only validate size for File objects
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test("fileType", "Unsupported file format", (value) => {
      // Allow null, undefined, or string
      if (!value || typeof value === "string") return true;
      // Only validate type for File objects
      return ["image/gif", "image/jpg", "image/png", "image/jpeg"].includes(
        value.type
      );
    }),
});

const CategoryForm = ({
  onSubmit,
  editCategoryData,
  isEdit = false,
  isLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [color, setColor] = useState("#fff");

  const formik = useFormik({
    initialValues: {
      name: "",
      color_code: "",
      icon: null,
      status: "Active",
    },
    validationSchema: photoSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("color_code", values.color_code);
      // Only append icon if it's a File object (new upload)
      if (values.icon && values.icon instanceof File) {
        formData.append("icon", values.icon);
      }
      formData.append("status", values.status);
      onSubmit(formData);
    },
  });

  useEffect(() => {
    if (isEdit && editCategoryData) {
      // Set preview to the existing icon URL (e.g., "http://192.168.1.11:8089/uploads/icon-1747386054804-121253819.gif")
      setPreviewImage(editCategoryData?.icon || null);
      formik.setValues({
        name: editCategoryData.name || "", // e.g., "Melting"
        color_code: editCategoryData.color_code || "", // e.g., "#FF00FF"
        icon: editCategoryData?.icon || null, // e.g., URL or null
        status: editCategoryData?.status || "", // e.g., "Active"
      });
    }
  }, [editCategoryData, isEdit]);

  useEffect(() => {
    return () => {
      if (previewImage && typeof previewImage !== "string") {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-4">
      {/* Name */}
      <div className="row mb-3">
        <label htmlFor="name" className="col-sm-3 col-form-label">
          Name<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Enter feeling name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red" }}>{formik.errors.name}</div>
          )}
        </div>
      </div>
      {/* Color Code */}
      <div className="row mb-3">
        <label htmlFor="color_code" className="col-sm-3 col-form-label">
          Color Code<span style={{ color: "red" }}>*</span>
        </label>

        <div className="col-sm-9">
          <ColorPicker
            color={formik.values.color_code}
            onChange={(color) => {
              const selectedColor = color.hex;
              formik.setFieldValue("color_code", selectedColor);
              setColor(selectedColor); // Optional: only if you also manage local color state
            }}
          />
          {formik.touched.color_code && formik.errors.color_code && (
            <div style={{ color: "red" }}>{formik.errors.color_code}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="icon" className="col-sm-3 col-form-label">
          Upload Icon<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          {previewImage && (
            <div className="mb-2">
              <img
                src={previewImage}
                alt="Icon preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
              <p>
                {isEdit && formik.values.icon === editCategoryData?.icon
                  ? "Current Icon"
                  : "Preview"}
              </p>
            </div>
          )}
          <input
            type="file"
            id="icon"
            name="icon"
            className="form-control"
            accept="image/gif"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              formik.setFieldValue(
                "icon",
                file || editCategoryData?.icon || null
              );
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage(editCategoryData?.icon || null); // Revert to existing URL
              }
            }}
            // onBlur={formik.handleBlur}
          />
          {formik.touched.icon && formik.errors.icon && (
            <div style={{ color: "red" }}>{formik.errors.icon}</div>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="status" className="col-sm-3 col-form-label">
          Status<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <div className="select-wrapper">
            <select
              id="status"
              name="status"
              className="form-control"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <span className="dropdown-icon">
              <i class="bi bi-chevron-down"></i>
            </span>
          </div>
          {formik.touched.status && formik.errors.status && (
            <div style={{ color: "red" }}>{formik.errors.status}</div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-sm-9 offset-sm-3">
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

export default CategoryForm;
