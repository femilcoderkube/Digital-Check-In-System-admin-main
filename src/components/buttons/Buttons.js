import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// CloseButton Component
export const CloseButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="btn-close position-absolute"
      aria-label="Close"
      style={{ top: "-30px", right: "-10px" }}
      onClick={onClick}
    ></button>
  );
};

// EditButton Component
export const EditButton = ({ onClick }) => {
  return (
    <button
      title="Edit"
      className="btn btn-md btn-outline-secondary me-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className="bi bi-pencil"
        viewBox="0 0 16 16"
      >
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
      </svg>
    </button>
  );
};

// UploadButton Component
export const UploadButton = ({ onClick }) => {
  return (
    <button
      className="btn btn-outline-primary btn-md btn-add w-10 ms-1"
      onClick={onClick}
      title="Upload CSV"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className="bi bi-upload"
        viewBox="0 0 16 16"
      >
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
      </svg>{" "}
      <span className="d-none d-lg-inline">Upload</span>
    </button>
  );
};

// DeleteButton Component
export const DeleteButton = ({ onClick }) => {
  return (
    <button
      title="Delete"
      className="btn btn-outline-danger btn-md"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className="bi bi-trash3"
        viewBox="0 0 16 16"
      >
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
      </svg>
    </button>
  );
};

// Bulkdelete btton
export const BulkDeleteButton = ({ onClick }) => {
  return (
    <button
      title="Delete"
      className="btn btn-outline-danger btn-md btn-add w-10 ms-1"
      // className={`btn btn-outline-primary btn-md btn-add w-10 ms-1`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="14.5"
        fill="currentColor"
        className="bi bi-trash3"
        viewBox="0 0 16 16"
      >
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
      </svg>
    </button>
  );
};

// ViewButton Component
export const ViewButton = ({ onClick }) => {
  return (
    <button
      title="View"
      className="btn btn-md btn-outline-success me-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        className="bi bi-eye-fill"
        viewBox="0 0 16 16"
      >
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
      </svg>
    </button>
  );
};

// AddLinkButton Component
export const AddLinkButton = ({ to }) => {
  return (
    <Link
      className={`btn btn-outline-primary btn-md btn-add w-10`}
      title="Add"
      to={to}
    >
      <i className="bi bi-plus-circle"></i>
    </Link>
  );
};

// AddButton Component
export const AddButton = ({ onClick }) => {
  return (
    <button
      className={`btn btn-outline-primary btn-md btn-add w-10 ms-1`}
      onClick={onClick}
      title="Add"
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="14.5"
        fill="currentColor"
        class="bi bi-plus-circle"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
      </svg> */}
      <i className="bi bi-plus-circle"></i>
    </button>
  );
};

// SearchBar Component
export const CommonSearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search",
}) => {
  return (
    <div className="search-bar search-txt">
      <input
        type="text"
        name="query"
        value={searchQuery}
        onChange={(e) => {
          e.preventDefault();
          setSearchQuery(e.target.value.trimStart());
        }}
        placeholder={placeholder}
        title="Enter search keyword"
      />
      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="currentColor"
        className="bi bi-search search-icon"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
      {/* Clear Icon */}
      {searchQuery && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="currentColor"
          className="bi bi-x-circle clear-icon"
          viewBox="0 0 16 16"
          onClick={(e) => {
            e.preventDefault();
            setSearchQuery("");
          }}
        >
          <path d="M16 8a8 8 0 1 0-16 0 8 8 0 0 0 16 0zM3.707 4.293a1 1 0 0 1 1.414 0L8 7.172l2.879-2.879a1 1 0 1 1 1.414 1.414L9.414 8.586l2.879 2.879a1 1 0 0 1-1.414 1.414L8 9.828l-2.879 2.879a1 1 0 1 1-1.414-1.414L6.586 8.586 3.707 5.707a1 1 0 0 1 0-1.414z" />
        </svg>
      )}
    </div>
  );
};

export const ButtonWithLoader = ({
  isLoading,
  buttonText,
  onClick,
  type = "submit",
  className = "btn btn-outline-primary",
  disabled = false,
}) => {
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {!isLoading ? (
        <span>{buttonText}</span>
      ) : (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>{" "}
          Loading...
        </>
      )}
    </button>
  );
};

export const SubmitAddButton = ({ isLoading, disabled, ...rest }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="btn btn-outline-primary btn-add-left w-10"
      {...rest}
    >
      {isLoading ? "Add..." : "Add"}
    </button>
  );
};
export const SubmitEditButton = ({ isLoading, disabled, ...rest }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="btn btn-outline-primary btn-add-left w-10"
      {...rest}
    >
      {isLoading ? "Update..." : "Update"}
    </button>
  );
};
