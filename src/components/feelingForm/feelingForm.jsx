import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCall } from "../../utils/api";
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
  primary_feeling_id: Yup.string().required("Primary feeling is required"),
  status: Yup.string().required("Status is required"),
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

const FeelingForm = ({
  onSubmit,
  editFeelingData,
  isEdit = false,
  isLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [primaryFeelings, setPrimaryFeelings] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [color, setColor] = useState("#fff");

  const formik = useFormik({
    initialValues: {
      name: "",
      color_code: "",
      icon: null,
      primary_feeling_id: "",
      status: "Active", // Default status
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
      formData.append("primary_feeling_id", values.primary_feeling_id);
      formData.append("status", values.status); // Added status field

      onSubmit(formData);
    },
  });

  // Fetch primary feelings
  useEffect(() => {
    const fetchFeelings = async () => {
      setFetchStatus("loading");
      try {
        // Fetch primary feelings
        const primaryResponse = await getCall("/admin/getPrimaryFeelings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Ensure response.data is an array
        setPrimaryFeelings(
          Array.isArray(primaryResponse?.data) ? primaryResponse.data : []
        );
      } catch (error) {
        console.error("Error fetching primary feelings:", error);
        setPrimaryFeelings([]);
      } finally {
        setFetchStatus("succeeded");
      }
    };

    fetchFeelings();
  }, []);

  // Handle setting form values when editing
  useEffect(() => {
    if (isEdit && editFeelingData) {
      console.log("Setting form values with edit data:", editFeelingData);

      // Set preview to the existing icon URL
      if (editFeelingData.icon) {
        setPreviewImage(editFeelingData.icon);
      }

      // Format primary_feeling_id if it's an object
      let primaryFeelingId = editFeelingData.primary_feeling_id;
      if (typeof primaryFeelingId === "object" && primaryFeelingId?._id) {
        primaryFeelingId = primaryFeelingId._id;
      }

      // Set form values
      formik.setValues({
        name: editFeelingData.name || "",
        color_code: editFeelingData.color_code || "",
        icon: editFeelingData.icon || null,
        primary_feeling_id: primaryFeelingId || "",
        status: editFeelingData.status || "Active",
      });

      console.log("Form values set:", formik.values);
    }
  }, [editFeelingData, isEdit]);

  useEffect(() => {
    return () => {
      if (previewImage && typeof previewImage !== "string") {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-4">
      {/* Primary Feeling Dropdown */}
      <div className="row mb-3">
        <label htmlFor="primary_feeling_id" className="col-sm-3 col-form-label">
          Primary Feeling<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <div className="select-wrapper">
            <select
              id="primary_feeling_id"
              name="primary_feeling_id"
              className="form-control"
              value={formik.values.primary_feeling_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={fetchStatus === "loading"}
            >
              <option value="" disabled>
                Select Primary Feeling
              </option>
              {primaryFeelings.map((feeling) => (
                <option key={feeling._id} value={feeling._id}>
                  {feeling.name}
                </option>
              ))}
            </select>
            <span className="dropdown-icon">
              <i class="bi bi-chevron-down"></i>
            </span>
          </div>
          {fetchStatus === "loading" && <div>Loading feelings...</div>}
          {fetchStatus === "succeeded" && primaryFeelings.length === 0 && (
            <div style={{ color: "red" }}>No primary feelings available</div>
          )}
          {formik.touched.primary_feeling_id &&
            formik.errors.primary_feeling_id && (
              <div style={{ color: "red" }}>
                {formik.errors.primary_feeling_id}
              </div>
            )}
        </div>
      </div>

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
          {/* <input
            type="text"
            id="color_code"
            name="color_code"
            className="form-control"
            placeholder="#FFFF00"
            value={formik.values.color_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.color_code && formik.errors.color_code && (
            <div style={{ color: "red" }}>{formik.errors.color_code}</div>
          )} */}
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

      {/* Icon Upload */}
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
              <p>{isEdit ? "Current Icon" : "Preview"}</p>
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
                file || editFeelingData?.icon || null
              );
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage(editFeelingData?.icon || null); // Revert to existing URL
              }
            }}
            // onBlur={formik.handleBlur}
          />
          {formik.touched.icon && formik.errors.icon && (
            <div style={{ color: "red" }}>{formik.errors.icon}</div>
          )}
        </div>
      </div>

      {/* Status */}
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

      {/* Submit Button */}
      <div className="row">
        <div className="col-sm-9 offset-sm-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || fetchStatus === "loading"}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FeelingForm;
