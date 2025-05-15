import React from "react";

const ImagePreview = ({
  previewImage,
  setPreviewImage,
  setErrorMessage,
  formik,
  fieldName,
  colsize = "col-sm-2 col-form-label",
  user,
}) => {
  if (!previewImage) return null;

  return (
    <div className="row mb-3">
      <label className={colsize}></label>
      <div
        className="col-sm-10 position-relative"
        style={{ width: "fit-content" }}
      >
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            height={user ? 130 : 70}
            width={130}
            className={
              user
                ? "border border-primary rounded-circle"
                : "border border-primary rounded"
            }
          />
        )}
        <button
          type="button"
          className="btn-close position-absolute"
          aria-label="Close"
          style={{ top: "-10px", right: "-10px" }}
          onClick={() => {
            formik.setFieldValue(fieldName, null);
            setPreviewImage(null);
            setErrorMessage(""); 
          }}
        ></button>
      </div>
    </div>
  );
};

export default ImagePreview;
