import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCall } from "../../utils/api";

const guidanceSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  primary_feeling_id: Yup.string().required("Primary feeling is required"),
  secondary_feeling_id: Yup.string().required("Secondary feeling is required"),
  description: Yup.string()
    .max(500, "Description must be under 500 characters")
    .required("Description is required"),
  profile_photo: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 5 * 1024 * 1024; // 5MB limit
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});

const GuidanceForm = ({
  onSubmit,
  editGuidanceData,
  isEdit = false,
  isLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [primaryFeelings, setPrimaryFeelings] = useState([]);
  const [secondaryFeelings, setSecondaryFeelings] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      primary_feeling_id: "",
      secondary_feeling_id: "",
      description: "",
      profile_photo: null,
    },
    validationSchema: guidanceSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("primary_feeling_id", values.primary_feeling_id);
      formData.append("secondary_feeling_id", values.secondary_feeling_id);
      formData.append("description", values.description);
      if (values.profile_photo && values.profile_photo instanceof File) {
        formData.append("profile_photo", values.profile_photo);
      }
      onSubmit(formData);
    },
  });

  // Fetch primary feelings
  useEffect(() => {
    const fetchFeelings = async () => {
      setFetchStatus("loading");
      try {
        // Fetch primary feelings
        const primaryResponse = await getCall("/admin/getPrimaryFeelings");
        // Ensure response.data is an array
        setPrimaryFeelings(Array.isArray(primaryResponse?.data) ? primaryResponse.data : []);
      } catch (error) {
        console.error("Error fetching primary feelings:", error);
        setPrimaryFeelings([]);
      } finally {
        setFetchStatus("succeeded");
      }
    };

    fetchFeelings();
  }, []);

  // Fetch secondary feelings based on primary feeling
  const fetchSecondaryFeelings = async (primaryId) => {
    if (!primaryId) {
      setSecondaryFeelings([]);
      return;
    }
    
    setIsLoadingSecondary(true);
    try {
      const secondaryResponse = await getCall(`/admin/getSecondaryFeelingsBasedOnPrimaryFeeling?primary_feeling_id=${primaryId}`);
      
      // Update to handle nested secondary_feelings structure
      const secondaryFeelingsData = secondaryResponse?.data || [];
      setSecondaryFeelings(secondaryFeelingsData);
      
      // Reset secondary feeling if it doesn't exist in the new list
      if (formik.values.secondary_feeling_id) {
        const exists = secondaryFeelingsData.some(
          feeling => feeling._id === formik.values.secondary_feeling_id
        );
        if (!exists) {
          formik.setFieldValue("secondary_feeling_id", "");
        }
      }
    } catch (error) {
      console.error("Error fetching secondary feelings:", error);
      setSecondaryFeelings([]);
      formik.setFieldValue("secondary_feeling_id", "");
    } finally {
      setIsLoadingSecondary(false);
    }
  };

  // Handle primary feeling change
  const handlePrimaryFeelingChange = (e) => {
    const primaryId = e.target.value;
    formik.setFieldValue("primary_feeling_id", primaryId);
    formik.setFieldValue("secondary_feeling_id", ""); // Reset secondary feeling
    fetchSecondaryFeelings(primaryId);
  };

  // Handle edit mode
  useEffect(() => {

    console.log(editGuidanceData)

    if (isEdit && editGuidanceData) {
      setPreviewImage(editGuidanceData?.profile_photo || null);
      formik.setValues({
        title: editGuidanceData.title || "",
        primary_feeling_id: editGuidanceData.primary_feeling_id?._id || "",
        secondary_feeling_id: editGuidanceData.secondary_feeling_id?._id || "",
        description: editGuidanceData.description || "",
        profile_photo: editGuidanceData?.profile_photo || null,
      });
      
      // Fetch secondary feelings for the selected primary feeling when in edit mode
      if (editGuidanceData.primary_feeling_id?._id) {
        fetchSecondaryFeelings(editGuidanceData.primary_feeling_id._id);
      }
    }
  }, [editGuidanceData, isEdit]);

  // Clean up preview image URL
  useEffect(() => {
    return () => {
      if (previewImage && typeof previewImage !== "string") {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <form onSubmit={formik.handleSubmit} className="container mt-4">
      {/* Title */}
      <div className="row mb-3">
        <label htmlFor="title" className="col-sm-3 col-form-label">
          Title<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Enter guidance title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <div style={{ color: "red" }}>{formik.errors.title}</div>
          )}
        </div>
      </div>

    

      {/* Primary Feeling */}
      <div className="row mb-3">
        <label htmlFor="primary_feeling_id" className="col-sm-3 col-form-label">
          Primary Feeling<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <select
            id="primary_feeling_id"
            name="primary_feeling_id"
            className="form-control"
            value={formik.values.primary_feeling_id}
            onChange={handlePrimaryFeelingChange}
            onBlur={formik.handleBlur}
            disabled={fetchStatus === "loading"}
          >
            <option value="">Select Primary Feeling</option>
            {primaryFeelings.map((feeling) => (
              <option key={feeling._id} value={feeling._id}>
                {feeling.name}
              </option>
            ))}
          </select>
          {fetchStatus === "loading" && <div>Loading feelings...</div>}
          {fetchStatus === "succeeded" && primaryFeelings.length === 0 && (
            <div style={{ color: "red" }}>No primary feelings available</div>
          )}
          {formik.touched.primary_feeling_id && formik.errors.primary_feeling_id && (
            <div style={{ color: "red" }}>{formik.errors.primary_feeling_id}</div>
          )}
        </div>
      </div>

      {/* Secondary Feeling */}
      <div className="row mb-3">
        <label htmlFor="secondary_feeling_id" className="col-sm-3 col-form-label">
          Secondary Feeling<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <select
            id="secondary_feeling_id"
            name="secondary_feeling_id"
            className="form-control"
            value={formik.values.secondary_feeling_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={fetchStatus === "loading" || isLoadingSecondary || !formik.values.primary_feeling_id}
          >
            <option value="">Select Secondary Feeling</option>
            {secondaryFeelings.map((feeling) => (
              <option key={feeling._id} value={feeling._id}>
                {feeling.name}
              </option>
            ))}
          </select>
          {isLoadingSecondary && <div>Loading secondary feelings...</div>}
          {!isLoadingSecondary && formik.values.primary_feeling_id && secondaryFeelings.length === 0 && (
            <div style={{ color: "red" }}>No secondary feelings available for this primary feeling</div>
          )}
          {formik.touched.secondary_feeling_id && formik.errors.secondary_feeling_id && (
            <div style={{ color: "red" }}>{formik.errors.secondary_feeling_id}</div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="row mb-3">
        <label htmlFor="description" className="col-sm-3 col-form-label">
          Description<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <textarea
            id="description"
            name="description"
            className="form-control"
            placeholder="Enter guidance description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows="4"
          />
          {formik.touched.description && formik.errors.description && (
            <div style={{ color: "red" }}>{formik.errors.description}</div>
          )}
        </div>
      </div>

        {/* Profile Photo Upload */}
        <div className="row mb-3">
        <label htmlFor="profile_photo" className="col-sm-3 col-form-label">
          Upload Photo
        </label>
        <div className="col-sm-9">
          {previewImage && (
            <div className="mb-2">
              <img
                src={previewImage}
                alt="Photo preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
              <p>
                {isEdit && formik.values.profile_photo === editGuidanceData?.profile_photo
                  ? "Current Photo"
                  : "Preview"}
              </p>
            </div>
          )}
          <input
            type="file"
            id="profile_photo"
            name="profile_photo"
            className="form-control"
            accept="image/jpeg,image/png,image/gif"
            onChange={(event) => {
              const file = event.currentTarget.files[0];
              formik.setFieldValue("profile_photo", file || editGuidanceData?.profile_photo || null);
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage(editGuidanceData?.profile_photo || null);
              }
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.profile_photo && formik.errors.profile_photo && (
            <div style={{ color: "red" }}>{formik.errors.profile_photo}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-sm-9 offset-sm-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || fetchStatus === "loading" || isLoadingSecondary}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GuidanceForm;