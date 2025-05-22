import React, { useEffect, useState } from "react";

import { useFormik } from "formik";

import { profileSchema } from "../../validationSchemas/validationSchemas";
import logo from "../../assets/img/logo.png";
import useImageDropzone from "../../hook/useImageDropzone";
import { SubmitEditButton } from "../../components/buttons/Buttons";
import ChangePasswordForm from "../auth/changePassword/ChangePassword";
import { getById } from "../../utils/api";
import { use } from "react";

const Demoprofile = () => {
  const userData = {};
  const userid = JSON.parse(localStorage.getItem("adminData"));
  const isLoading = false;

  // state hooks
  const [errorMessage, setErrorMessage] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [isImageNull, setIsImageNull] = useState(0);

  // store data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getById(
        "/admin/getProfile?admin_id",
        userid?._id,
        false
      );
      console.log("response", response);
    } catch (error) {
      console.log("err", error);
    }
  };

  //   const setFormikValues = () => {
  //     formik.setFieldValue("first_name", userData?.first_name);
  //     formik.setFieldValue("last_name", userData?.last_name);
  //     formik.setFieldValue("email", userData?.email);
  //     formik.setFieldValue("contact_no", userData?.contact_no);
  //     formik.setFieldValue("image", userData?.image);
  //   };

  const formik = useFormik({
    initialValues: {
      first_name: profileData?.first_name || "",
      last_name: profileData?.last_name || "",
      email: profileData?.email || "",
      contact_no: profileData?.contact_no || "",
      image: profileData?.image || null,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("last_name", values.last_name);
        formData.append("email", values.email);
        formData.append("contact_no", values.contact_no);
        formData.append("isImageNull", isImageNull);

        // if (values?.image && typeof values.image !== "string") {
        // formData.append("image", values.image);
        // }
        if (values.image instanceof File) {
          formData.append("image", values.image);
        }

        setIsImageNull(0);
      } catch (error) {
        console.log("Something went wrong");
      }
    },
  });

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
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
  return (
    <>
      <div className="pageTitle">
        <h1>Profile</h1>
      </div>

      <section className="section profile">
        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
                {isLoading ? (
                  ""
                ) : userData?.image ? (
                  <img
                    src={userData?.image}
                    alt="Profile"
                    className="rounded-circle"
                    height={100}
                    width={100}
                  />
                ) : (
                  <img src={logo} alt="Profile" className="rounded-circle" />
                )}
                <h2>
                  {userData?.first_name} {userData?.last_name}
                </h2>
                <h3>{userData?.email}</h3>
                {/* <div className="social-links mt-2">
                  <a href="#" className="twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="linkedin">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div> */}
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="card">
              <div className="card-body pt-3">
                <ul className="nav nav-tabs nav-tabs-bordered">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-overview"
                    >
                      Overview
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-edit"
                    >
                      Edit Profile
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-change-password"
                    >
                      Change Password
                    </button>
                  </li>
                </ul>
                <div className="tab-content pt-2">
                  <div
                    className="tab-pane fade show active profile-overview"
                    id="profile-overview"
                  >
                    <h5 className="card-title">Profile Details</h5>

                    <div className="row">
                      <div className="col-lg-3 col-md-4 label ">Full Name</div>
                      <div className="col-lg-9 col-md-8">
                        {userData?.first_name} {userData?.last_name}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Phone</div>
                      <div className="col-lg-9 col-md-8">
                        {userData?.contact_no}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-3 col-md-4 label">Email</div>
                      <div className="col-lg-9 col-md-8">{userData?.email}</div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade profile-edit pt-3"
                    id="profile-edit"
                  >
                    <form onSubmit={formik.handleSubmit}>
                      <div className="row mb-3">
                        <label
                          htmlFor="first_name"
                          className="col-sm-2 col-form-label"
                        >
                          First Name
                          <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            name="first_name"
                            className={`form-control ${
                              formik.touched.first_name &&
                              formik.errors.first_name
                                ? "input-offer-error"
                                : "input-bg-error"
                            }`}
                            id="first_name"
                            placeholder="Enter first name"
                            value={formik.values.first_name}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "first_name",
                                e.target.value.trimStart()
                              );
                            }}
                          />
                          {formik.touched.first_name &&
                            formik.errors.first_name && (
                              <div style={{ color: "red" }}>
                                {formik.errors.first_name}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="last_name"
                          className="col-sm-2 col-form-label"
                        >
                          Last Name
                          <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            name="last_name"
                            className={`form-control ${
                              formik.touched.last_name &&
                              formik.errors.last_name
                                ? "input-offer-error"
                                : "input-bg-error"
                            }`}
                            id="last_name"
                            placeholder="Enter last name"
                            value={formik.values.last_name}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "last_name",
                                e.target.value.trimStart()
                              );
                            }}
                          />
                          {formik.touched.last_name &&
                            formik.errors.last_name && (
                              <div style={{ color: "red" }}>
                                {formik.errors.last_name}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="email"
                          className="col-sm-2 col-form-label"
                        >
                          Email
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${
                              formik.touched.email && formik.errors.email
                                ? "input-offer-error"
                                : "input-bg-error"
                            }`}
                            id="email"
                            disabled
                            placeholder="Enter email"
                            value={formik.values.email}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "email",
                                e.target.value.trimStart()
                              );
                            }}
                          />

                          {formik.touched.email && formik.errors.email && (
                            <div style={{ color: "red" }}>
                              {formik.errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label
                          htmlFor="contact_no"
                          className="col-sm-2 col-form-label"
                        >
                          Contact No
                          <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span>
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            name="contact_no"
                            className={`form-control ${
                              formik.touched.contact_no &&
                              formik.errors.contact_no
                                ? "input-offer-error"
                                : "input-bg-error"
                            }`}
                            id="contact_no"
                            placeholder="Enter contact no"
                            maxLength={10}
                            value={formik.values.contact_no}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value?.length > 0 && value?.[0] !== "0") {
                                formik.setFieldValue(
                                  "contact_no",
                                  `0${value.trimStart()}`
                                );
                              } else {
                                formik.setFieldValue(
                                  "contact_no",
                                  value.trimStart()
                                );
                              }
                            }}
                          />
                          {formik.touched.contact_no &&
                            formik.errors.contact_no && (
                              <div style={{ color: "red" }}>
                                {formik.errors.contact_no}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          Profile Image
                          {/* <span style={{ color: "red", fontSize: "25px" }}>
                            *
                          </span> */}
                        </label>
                        <div className="col-sm-10">
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
                                    setErrorMessage(
                                      "Only image files are accepted."
                                    );
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
                            <div style={{ color: "red", marginTop: "5px" }}>
                              {errorMessage}
                            </div>
                          ) : (
                            formik.touched.image &&
                            formik.errors.image && (
                              <div style={{ color: "red", marginTop: "5px" }}>
                                {formik.errors.image}
                              </div>
                            )
                          )}
                          {formik.values.image && (
                            <div>
                              <strong>Selected File:</strong>{" "}
                              {formik.values.image.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {(previewImage || profileData?.image) && (
                        <div className="row mb-3">
                          <label
                            htmlFor="profileImage"
                            className="col-md-0 col-lg-0 col-form-label"
                          ></label>
                          <div
                            className="col-sm-10 offset-sm-2 position-relative"
                            style={{ width: "fit-content" }}
                          >
                            <img
                              src={previewImage || profileData?.image}
                              alt="Profile"
                              height={130}
                              width={130}
                              className="border border-primary rounded-circle profile-image"
                            />
                            <button
                              type="button"
                              className="btn-close position-absolute"
                              aria-label="Close"
                              style={{ top: "-10px", right: "-10px" }}
                              onClick={() => {
                                formik.setFieldValue("image", null);
                                setIsImageNull(1);
                                setPreviewImage(null);
                                setErrorMessage("");

                                setProfileData((prevData) => ({
                                  ...prevData,
                                  image: null,
                                }));
                              }}
                            ></button>
                          </div>
                        </div>
                      )}

                      <SubmitEditButton
                        isLoading={isLoading}
                        disabled={!!errorMessage}
                      />
                    </form>
                  </div>

                  <div
                    className="tab-pane fade pt-3"
                    id="profile-change-password"
                  >
                    <ChangePasswordForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Demoprofile;
