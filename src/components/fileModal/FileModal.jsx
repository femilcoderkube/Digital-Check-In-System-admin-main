import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { useDropzone } from "react-dropzone";
import { fileCSVSchema } from "../../validationSchemas/validationSchemas";

const FileModal = ({
  show,
  handleClose,
  initialValues,
  onSubmit,
  darkMode,
  isLoadingCSV,
  onDownload,
  title,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);

  const isLoading = isLoadingCSV === "loading";

  useEffect(() => {
    setErrorMessage("");
    setFile(initialValues?.file || null);
  }, [initialValues]);

  const formik = useFormik({
    initialValues: {
      file: initialValues?.file || null,
    },
    validationSchema: fileCSVSchema,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  const handleCloseWithReset = () => {
    formik.resetForm();
    handleClose();
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (
          selectedFile.type === "text/csv" ||
          selectedFile.name.endsWith(".csv")
        ) {
          formik.setFieldValue("file", selectedFile);
          setFile(selectedFile);
          setErrorMessage("");
        } else {
          formik.setFieldValue("file", null);
          setErrorMessage("Only CSV files are accepted.");
        }
      } else if (rejectedFiles.length > 0) {
        formik.setFieldValue("file", null);
        setErrorMessage("Only CSV files are accepted.");
      }
    },
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleDownload = () => {
    const { url } = onDownload();
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseWithReset}
      dialogClassName={darkMode ? "dark-mode" : ""}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title} Import/Export CSV File</Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <label className="col-sm-6 col-form-label">
              {title} CSV File
              <span style={{ color: "red", fontSize: "25px" }}>*</span>
            </label>

            <div className="col-sm-12">
              <div
                {...getRootProps()}
                className={`dropzone ${
                  isDragActive ? "dropzone-active" : ""
                } form-control ${
                  formik.touched.file && formik.errors.file && !errorMessage
                    ? "input-offer-error"
                    : "input-bg-error"
                }`}
              >
                <input {...getInputProps()} name="file" id="file" />
                {isDragActive ? (
                  <p className="m-0 pt-2">Drop the file here...</p>
                ) : (
                  <p className="m-0 pt-2">
                    Drag & drop your file here, or click to browse.
                  </p>
                )}
              </div>
              {errorMessage ? (
                <div style={{ color: "red", marginTop: "5px" }}>
                  {errorMessage}
                </div>
              ) : (
                formik.touched.file &&
                formik.errors.file && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {formik.errors.file}
                  </div>
                )
              )}
              {formik.values.file && (
                <div>
                  <strong>Selected File:</strong> {formik.values.file.name}
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <button
            type="button"
            className="btn btn-outline-secondary btn-add w-10"
            onClick={handleCloseWithReset}
          >
            Close
          </button> */}
          {onDownload && (
            <button
              type="button"
              className="btn btn-outline-primary btn-add"
              title="Download"
              onClick={handleDownload}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-download"
                viewBox="0 0 16 16"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
              </svg>
              <span className="ms-2">Download Sample</span>
            </button>
          )}
          <button
            type="submit"
            className="btn btn-outline-primary btn-add w-10"
            disabled={isLoading || !!errorMessage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-upload"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
            </svg>{" "}
            <span className="ms-2">{isLoading ? "Upload..." : "Upload"}</span>
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FileModal;
