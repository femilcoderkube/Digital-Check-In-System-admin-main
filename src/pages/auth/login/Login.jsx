import { useFormik } from "formik";
import React, { useState } from "react";
import logo from "../../../assets/img/logo.png";
import logo2 from "../../../assets/img/2.png";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../../validationSchemas/validationSchemas";
import { ButtonWithLoader } from "../../../components/buttons/Buttons";
import { postCall } from "../../../utils/api";


const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Simulate an API call
        console.log("Logging in with:", values);
        // Here you would typically call your API to log in
        const response = await postCall("/auth/login",values);
        console.log(response);
        
        if (response.userData.authToken) {
          localStorage.setItem("token", response.userData.authToken);
           console.log("token:", response.userData.authToken); 
          navigate("/");
        } else {
          console.log("Login failed");
        }
        navigate("/"); // Simulate successful login
      } catch (error) {
        console.log("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
                    <img src={logo} alt="" />
                    <span className="d-none d-lg-block">Heu Admin</span>
                  </Link>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Login
                      </h5>
                      <p className="text-center small">
                        Enter your username & password to login
                      </p>
                    </div>

                    <form
                      className="row g-3 needs-validation"
                      novalidate
                      onSubmit={formik.handleSubmit}
                    >
                      <div className="col-12">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          className={`form-control ${
                            formik.touched.username && formik.errors.username
                              ? "input-offer-error"
                              : "input-bg-error"
                          }`}
                          id="username"
                          placeholder="Enter username"
                          value={formik.values.username}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "username",
                              e.target.value.trimStart()
                            );
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.username && formik.errors.username && (
                          <div style={{ color: "red" }}>
                            {formik.errors.username}
                          </div>
                        )}
                      </div>

                      <div className="col-12">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <div>
                          <div style={{ position: "relative" }}>
                            <input
                              name="password"
                              type={showPassword ? "text" : "password"}
                              style={{ paddingRight: "12%" }}
                              className={`form-control  ${
                                formik.touched.password &&
                                formik.errors.password
                                  ? "input-offer-error"
                                  : "input-bg-error"
                              }`}
                              id="password"
                              placeholder="Enter Password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <span
                              onClick={togglePasswordVisibility}
                              style={{
                                position: "absolute",
                                top: "60%",
                                right: "10px",
                                cursor: "pointer",
                                transform: "translateY(-50%)",
                              }}
                            >
                              {showPassword ? (
                                <i className="bi bi-eye"></i>
                              ) : (
                                <i className="bi bi-eye-slash"></i>
                              )}
                            </span>
                          </div>
                          {formik.touched.password &&
                            formik.errors.password && (
                              <div style={{ color: "red" }}>
                                {formik.errors.password}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="col-12 forgot-pwd">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            value="true"
                            id="rememberMe"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </label>
                        </div>

                        <div>
                          <Link to="/send-username" className="forgot_pass">
                            Forgot password ?
                          </Link>
                        </div>
                      </div>
                      <div className="col-12">
                        <ButtonWithLoader
                          isLoading={isLoading}
                          buttonText="Login"
                          type="submit"
                          className="btn btn-primary w-100 btn-lg"
                        />
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

export default Login;
