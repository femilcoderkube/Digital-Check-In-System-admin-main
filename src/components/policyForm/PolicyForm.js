import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SubmitEditButton } from "../buttons/Buttons";

const PolicyForm = ({ title, formik, isLoading }) => {
  return (
    <section className="section">
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Edit {title}</h5>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      formik.touched.title && formik.errors.title
                        ? "input-offer-error"
                        : "input-bg-error"
                    }`}
                    id="title"
                    name="title"
                    placeholder="Enter title"
                    value={formik.values.title}
                    onChange={(e) => {
                      formik.setFieldValue("title", e.target.value.trimStart());
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-danger">{formik.errors.title}</div>
                  ) : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <ReactQuill
                    id="description"
                    name="description"
                    theme="snow"
                    placeholder="Enter description"
                    className={`input-react-quill ${
                      formik.touched.description && formik.errors.description
                        ? "input-react-quill-error"
                        : ""
                    }`}
                    value={formik.values.description}
                    onChange={(value) => {
                      formik.setFieldValue("description", value);
                      formik.validateField("description");
                    }}
                    onBlur={() => formik.setFieldTouched("description", true)}
                    style={{ height: "300px", marginBottom: 5 }}
                  />
                </div>
                <div className="mt-5">
                  {formik.touched.description && formik.errors.description && (
                    <div style={{ color: "red" }}>
                      {formik.errors.description}
                    </div>
                  )}
                </div>
                <SubmitEditButton isLoading={isLoading === "loading"} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default PolicyForm;
