import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCall } from "../../utils/api";

const photoSchema = Yup.object().shape({
  name: Yup.string()
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
      return ["image/gif"].includes(value.type);
    }),
});

const KidsFeelingForm = ({
  onSubmit,
  editCategoryData,
  isEdit = false,
  isLoading,
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [primaryFeelings, setPrimaryFeelings] = useState([]);
  const [kidsData, setKidsData] = useState([]);
  const [secondaryFeelings, setSecondaryFeelings] = useState([]);
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(false);

  const formik = useFormik({
    initialValues: {
      kid_id: "",
      primary_feeling_id: "",
      secondary_feeling_id: "",
      note: "",
    },
    validationSchema: photoSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("kid_id", values.kid_id);
      formData.append("primary_feeling_id", values.primary_feeling_id);
      formData.append("secondary_feeling_id", values.secondary_feeling_id);
      formData.append("note", values.note);

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
    const fetchKids = async () => {
      setFetchStatus("loading");
      try {
        // Fetch primary feelings
        const kidsResponse = await getCall("/kids/getKids", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Ensure response.data is an array
        setKidsData(Array.isArray(kidsResponse?.data) ? kidsResponse.data : []);
      } catch (error) {
        console.error("Error fetching primary feelings:", error);
        setKidsData([]);
      } finally {
        setFetchStatus("succeeded");
      }
    };

    fetchFeelings();
    fetchKids();
  }, []);

  // Fetch secondary feelings based on primary feeling
  const fetchSecondaryFeelings = async (primaryId) => {
    if (!primaryId) {
      setSecondaryFeelings([]);
      return;
    }

    setIsLoadingSecondary(true);
    try {
      const secondaryResponse = await getCall(
        `/admin/getSecondaryFeelings?primary_feeling_id=${primaryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update to handle nested secondary_feelings structure
      const secondaryFeelingsData =
        secondaryResponse?.data?.secondary_feelings || [];
      setSecondaryFeelings(secondaryFeelingsData);

      // Reset secondary feeling if it doesn't exist in the new list
      if (formik.values.secondary_feeling_id) {
        const exists = secondaryFeelingsData.some(
          (feeling) => feeling._id === formik.values.secondary_feeling_id
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
    if (isEdit && editCategoryData) {
      setPreviewImage(editCategoryData?.profile_photo || null);
      formik.setValues({
        title: editCategoryData.title || "",
        primary_feeling_id: editCategoryData.primary_feeling_id?._id || "",
        secondary_feeling_id: editCategoryData.secondary_feeling_id?._id || "",
        description: editCategoryData.description || "",
        profile_photo: editCategoryData?.profile_photo || null,
      });

      // Fetch secondary feelings for the selected primary feeling when in edit mode
      if (editCategoryData.primary_feeling_id?._id) {
        fetchSecondaryFeelings(editCategoryData.primary_feeling_id._id);
      }
    }
  }, [editCategoryData, isEdit]);

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
      {/* Primary Feeling */}
      <div className="row mb-3">
        <label htmlFor="kid_id" className="col-sm-3 col-form-label">
          Kids<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <select
            id="kid_id"
            name="kid_id"
            className="form-control"
            value={formik.values.kid_id}
            onChange={handlePrimaryFeelingChange}
            onBlur={formik.handleBlur}
            disabled={fetchStatus === "loading"}
          >
            <option value="">Select kids</option>
            {kidsData.map((kid) => (
              <option key={kid._id} value={kid._id}>
                {kid.name}
              </option>
            ))}
          </select>
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
          {formik.touched.primary_feeling_id &&
            formik.errors.primary_feeling_id && (
              <div style={{ color: "red" }}>
                {formik.errors.primary_feeling_id}
              </div>
            )}
        </div>
      </div>

      {/* Secondary Feeling */}
      <div className="row mb-3">
        <label
          htmlFor="secondary_feeling_id"
          className="col-sm-3 col-form-label"
        >
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
            disabled={
              fetchStatus === "loading" ||
              isLoadingSecondary ||
              !formik.values.primary_feeling_id
            }
          >
            <option value="">Select Secondary Feeling</option>
            {secondaryFeelings.map((feeling) => (
              <option key={feeling._id} value={feeling._id}>
                {feeling.name}
              </option>
            ))}
          </select>
          {isLoadingSecondary && <div>Loading secondary feelings...</div>}
          {!isLoadingSecondary &&
            formik.values.primary_feeling_id &&
            secondaryFeelings.length === 0 && (
              <div style={{ color: "red" }}>
                No secondary feelings available for this primary feeling
              </div>
            )}
          {formik.touched.secondary_feeling_id &&
            formik.errors.secondary_feeling_id && (
              <div style={{ color: "red" }}>
                {formik.errors.secondary_feeling_id}
              </div>
            )}
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="note" className="col-sm-3 col-form-label">
          Note<span style={{ color: "red" }}>*</span>
        </label>
        <div className="col-sm-9">
          <input
            type="text"
            id="note"
            name="note"
            className="form-control"
            placeholder="Enter note"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.note && formik.errors.note && (
            <div style={{ color: "red" }}>{formik.errors.note}</div>
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

export default KidsFeelingForm;
