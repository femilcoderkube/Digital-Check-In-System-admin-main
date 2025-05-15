import React from "react";

const CustomDateInput = React.forwardRef(({ value, onClick, formik }, ref) => (
  <div className="input-group">
    <input
      type="text"
      className={`form-control ${
        formik.touched.end_date && formik.errors.end_date
          ? "input-date-error"
          : "input-bg-error input-group-error"
      }`}
      onClick={onClick}
      value={value ? value : ""}
      ref={ref}
      placeholder={value ? "" : "Select end date"}
      readOnly
    />
    <div className="input-group-append">
      <span 
      className={`input-group-text date-icon ${
        formik.touched.end_date && formik.errors.end_date
          // ? "input-date-error"
          // : "input-bg-error input-group-error"
      }`}
      onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-calendar-fill"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5" />
        </svg>
      </span>
    </div>
  </div>
));

export default CustomDateInput;
