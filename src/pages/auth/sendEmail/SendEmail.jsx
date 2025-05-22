import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { sendEmailSchema } from "../../../validationSchemas/validationSchemas";
import axios from "axios";
import { BASE_URL } from "../../../utils/api";

const SendEmail = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: sendEmailSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const res = await axios.post(`${BASE_URL}/admin/forgotPassword`, {
          email: values?.email,
        });

        if (res?.data?.status === 200) {
          toast.success(res?.data?.message);
          navigate("/login");
        }
        // const res = await dispatch(requestOtp(values?.email));
        // localStorage.setItem("email", JSON.stringify(values.email));
        // if (res?.payload?.statusState === "success") {
        //   navigate("/otp-verify");
        // }
      } catch (error) {
        toast.error("something wrong");
      }
    },
  });

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <Link
                    to="/login"
                    className="logo d-flex align-items-center w-auto"
                  >
                    {/* <img src={logo} alt="" /> */}
                    <span className="d-none d-lg-block">
                      Digital Check In System
                    </span>
                  </Link>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Forgot Password?
                      </h5>
                      <p className="text-center small">
                        Don't worry! it occurs. Please enter the email address
                        linked with your account.
                      </p>
                    </div>

                    <form className="row g-3 needs-validation" novalidate>
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="email"
                            className={`form-control ${
                              formik.touched.email && formik.errors.email
                                ? "input-offer-error"
                                : "input-bg-error"
                            }`}
                            id="email"
                            style={{ paddingRight: "10%" }}
                            required
                            placeholder="Enter Email"
                            value={formik.values.email}
                            onChange={(e) => {
                              formik.setFieldValue(
                                "email",
                                e.target.value.trimStart()
                              );
                            }}
                            onBlur={formik.handleBlur}
                          />
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "10px",
                              cursor: "pointer",
                              transform: "translateY(-50%)",
                            }}
                          >
                            <i className="bi bi-envelope"></i>
                          </span>
                        </div>
                        {formik.touched.email && formik.errors.email && (
                          <div style={{ color: "red" }}>
                            {formik.errors.email}
                          </div>
                        )}
                      </div>

                      <div className="col-12 forgot-pwd">
                        <Link className="btn btn-primary " to="/login">
                          Back to login
                        </Link>
                        <button
                          className="btn btn-primary"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            formik.handleSubmit(e);
                          }}
                        >
                          Send Email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SendEmail;
