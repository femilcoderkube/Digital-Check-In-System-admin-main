import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import useImageDropzone from "../../hook/useImageDropzone";
import ImagePreview from "../imagePreview/ImagePreview";
import { SubmitAddButton, SubmitEditButton } from "../buttons/Buttons";

const CommonModal = ({
  show,
  handleClose,
  initialValues,
  onSubmit,
  validationSchema,
  isEdit,
  darkMode,
  isLoading,
  fields,
  withImage = false,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
    setPreviewImage(initialValues?.image);
  }, [isEdit, initialValues]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  const handleCloseWithReset = () => {
    formik.resetForm();
    handleClose();
    if (withImage) setPreviewImage(null);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    previewImage,
    file,
    setPreviewImage,
    setFile,
  } = useImageDropzone(formik, "image", setErrorMessage);

  useEffect(() => {
    let objectUrl;

    if (isEdit) {
      if (file) {
        objectUrl = URL.createObjectURL(file);
        setPreviewImage(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (initialValues?.image) {
        setPreviewImage(initialValues.image);
      } else {
        setPreviewImage(null);
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isEdit, initialValues, file]);

  useEffect(() => {
    setPreviewImage(initialValues?.image);
  }, [initialValues?.image]);

  return (
    <Modal
      show={show}
      onHide={handleCloseWithReset}
      dialogClassName={darkMode ? "dark-mode" : ""}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? `Edit ${fields.title}` : `Add ${fields.title}`}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          {fields.inputs.map((field) => (
            <div className="row mb-3" key={field.name}>
              <label htmlFor={field.name} className="col-sm-6 col-form-label">
                {field.label}
                {field.required && (
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>
                )}
              </label>
              <div className="col-sm-12">
                <input
                  type={field.type || "text"}
                  name={field.name}
                  className={`form-control ${
                    formik.touched[field.name] && formik.errors[field.name]
                      ? "input-offer-error"
                      : "input-bg-error"
                  }`}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formik.values[field.name]}
                  onChange={(e) => {
                    formik.setFieldValue(
                      field.name,
                      e.target.value.trimStart()
                    );
                  }}
                />
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <div style={{ color: "red" }}>
                    {formik.errors[field.name]}
                  </div>
                )}
              </div>
            </div>
          ))}

          {withImage && (
            <>
              <div className="row mb-3">
                <label className="col-sm-6 col-form-label">
                  {fields.imageLabel}
                  <span style={{ color: "red", fontSize: "25px" }}>*</span>
                </label>
                <div className="col-sm-12">
                  <div
                    {...getRootProps()}
                    className={`dropzone ${
                      isDragActive ? "dropzone-active" : ""
                    } form-control ${
                      formik.touched.image &&
                      formik.errors.image &&
                      !errorMessage
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
                  colsize="col-sm-0 col-form-label"
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary btn-add w-10"
            onClick={handleCloseWithReset}
          >
            Close
          </button>
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
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CommonModal;
