import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { cardFormSchema } from "../../validationSchemas/validationSchemas";
import useImageDropzone from "../../hook/useImageDropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import ImagePreview from "../imagePreview/ImagePreview";
import { SubmitAddButton, SubmitEditButton } from "../buttons/Buttons";

const CardForm = ({ editCardData, onSubmit, isEdit = false, isLoading }) => {
  const [isClearable] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setPreviewImage(editCardData?.image);
  }, [isEdit, editCardData]);

  const formik = useFormik({
    initialValues: {
      cardName: editCardData?.name || "",
      bank: editCardData?.bank_id,
      network: editCardData?.network_id,
      cardType: editCardData?.type || "",
      benefits: editCardData?.benefits || "",
      image: editCardData?.image || null,
      isFeatured: false,
      cardCategory: "",
    },
    validationSchema: cardFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values?.cardName);
      if (values?.bank) {
        formData.append("bank_id", values?.bank);
      }

      formData.append("network_id", values?.network || null);
      formData.append("type", values?.cardType);
      formData.append("benefits", values?.benefits);
      if (values.image && typeof values.image !== "string") {
        formData.append("image", values.image);
      }
      formData.append("isFeatured", values.isFeatured);
      formData.append("cardCategory", values.cardCategory);

      try {
        await onSubmit(formData);
        formik.resetForm();
        setPreviewImage(null);
      } catch (error) {
        console.log("Something went wrong");
      }
    },
  });

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    setFile,
  } = useImageDropzone(formik, "image", setErrorMessage);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const bankOptions = useMemo(() => {
    return [
      { value: "1", label: "Bank of America" },
      { value: "2", label: "Chase Bank" },
      { value: "3", label: "Wells Fargo" },
    ];
  }, []);

  const handleBankChange = (selectedOption) => {
    formik.setFieldValue("bank", selectedOption?.value || "");
  };

  const networkOptions = useMemo(() => {
    return [
      { value: "1", label: "Visa" },
      { value: "2", label: "Mastercard" },
      { value: "3", label: "American Express" },
    ];
  }, []);

  const handleNetworkChange = (selectedOption) => {
    formik.setFieldValue("network", selectedOption?.value || "");
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row mb-3">
        <label htmlFor="cardType" className="col-sm-2 col-form-label">
          Card Type<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <select
            name="cardType"
            className={`form-select ${
              formik.touched.cardType && formik.errors.cardType
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="cardType"
            value={formik.values.cardType}
            onChange={(e) => {
              formik.setFieldValue("cardType", e.target.value);
            }}
            onBlur={formik.handleBlur}
          >
            <option value="" label="Select card type" />
            <option value="debit" label="Debit Card" />
            <option value="credit" label="Credit Card" />
            <option value="loyalty" label="Loyalty Card" />
            <option value="membership" label="Membership Card" />
          </select>

          {formik.touched.cardType && formik.errors.cardType && (
            <div style={{ color: "red" }}>{formik.errors.cardType}</div>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="bank" className="col-sm-2 col-form-label">
          Bank Name
        </label>
        <div className="col-sm-10">
          <Select
            className={`basic-single ${
              formik.touched.bank && formik.errors.bank
                ? "input-select-error"
                : "input-select-bg-error"
            }`}
            classNamePrefix="select"
            isClearable={isClearable}
            options={bankOptions}
            value={bankOptions?.find(
              (option) => option.value === formik.values.bank
            )}
            onChange={handleBankChange}
            onBlur={() => formik.setFieldTouched("bank", true)}
            placeholder="Select a bank"
          />
          {formik.touched.bank && formik.errors.bank && (
            <div style={{ color: "red" }}>{formik.errors.bank}</div>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <label htmlFor="cardName" className="col-sm-2 col-form-label">
          Card Name<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <input
            type="text"
            name="cardName"
            className={`form-control ${
              formik.touched.cardName && formik.errors.cardName
                ? "input-offer-error"
                : "input-bg-error"
            }`}
            id="cardName"
            placeholder="Enter card name"
            value={formik.values.cardName}
            onChange={(e) => {
              formik.setFieldValue("cardName", e.target.value.trimStart());
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cardName && formik.errors.cardName && (
            <div style={{ color: "red" }}>{formik.errors.cardName}</div>
          )}
        </div>
      </div>

      <div className="row mb-3" style={{ height: "250px" }}>
        <label htmlFor="benefits" className="col-sm-2 col-form-label">
          Benefits
          <span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <ReactQuill
            id="benefits"
            name="benefits"
            theme="snow"
            className={`${
              formik.touched.benefits && formik.errors.benefits
                ? "input-react-quill-error"
                : ""
            }`}
            value={formik.values.benefits}
            onChange={(value) => {
              formik.setFieldValue("benefits", value);
              formik.validateField("benefits");
            }}
            onBlur={() => formik.setFieldTouched("benefits", true)}
            style={{ height: "180px", marginBottom: 5 }}
          />
          <div className="mt-5">
            {formik.touched.benefits && formik.errors.benefits && (
              <div style={{ color: "red" }}>{formik.errors.benefits}</div>
            )}
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <label htmlFor="category" className="col-sm-2 col-form-label">
          Network Type<span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
        <div className="col-sm-10">
          <Select
            className={`basic-single ${
              formik.touched.network && formik.errors.network
                ? "input-select-error"
                : "input-select-bg-error"
            }`}
            classNamePrefix="select"
            options={networkOptions}
            value={networkOptions?.find(
              (option) => option.value === formik.values.network
            )}
            onChange={handleNetworkChange}
            onBlur={() => formik.setFieldTouched("network", true)}
            placeholder="Select a network"
          />
          {formik.touched.network && formik.errors.network && (
            <div style={{ color: "red" }}>{formik.errors.network}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">
          Featured Card
        </label>
        <div className="col-sm-10">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formik.values.isFeatured}
            onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">
          Card Category
        </label>
        <div className="col-sm-10">
          <div className="d-flex gap-3">
            <label>
              <input
                type="radio"
                name="cardCategory"
                value="personal"
                checked={formik.values.cardCategory === "personal"}
                onChange={(e) => formik.setFieldValue("cardCategory", e.target.value)}
              />
              Personal
            </label>
            <label>
              <input
                type="radio"
                name="cardCategory"
                value="business"
                checked={formik.values.cardCategory === "business"}
                onChange={(e) => formik.setFieldValue("cardCategory", e.target.value)}
              />
              Business
            </label>
          </div>
          {formik.touched.cardCategory && formik.errors.cardCategory && (
            <div style={{ color: "red" }}>{formik.errors.cardCategory}</div>
          )}
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-2 col-form-label">
          Card Image
          <span style={{ color: "red", fontSize: "25px" }}>*</span>
        </label>
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
            <div style={{ color: "red" }}>{errorMessage}</div>
          ) : (
            formik.touched.image &&
            formik.errors.image && (
              <div style={{ color: "red" }}>{formik.errors.image}</div>
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
        />
      )}

      <div className="row mb-3">
        <div className="col-sm-10 offset-sm-2">
          {isEdit ? (
            <SubmitEditButton
              isLoading={isLoading === "loading"}
              disabled={isLoading === "loading" || !!errorMessage}
            />
          ) : (
            <SubmitAddButton
              isLoading={isLoading === "loading"}
              disabled={isLoading === "loading" || !!errorMessage}
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default CardForm;
