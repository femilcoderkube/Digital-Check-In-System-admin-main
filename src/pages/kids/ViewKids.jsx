import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";
import { getById, getCall } from "../../utils/api";
import CommonTable from "../../components/commonTable/CommonTable";
import moment from "moment/moment";

const ViewKids = () => {
  const { id } = useParams();
  const [kidsData, setKidsData] = useState({});
  const [kidsLogData, setKidsLogData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryFeelings, setPrimaryFeelings] = useState([]);
  const [secondaryFeelings, setSecondaryFeelings] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("idle");
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(false);
  const [filters, setFilters] = useState({
    primary_feeling_id: "",
    secondary_feeling_id: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fetch primary feelings
  useEffect(() => {
    const fetchFeelings = async () => {
      setFetchStatus("loading");
      try {
        const primaryResponse = await getCall("/admin/getPrimaryFeelings");
        setPrimaryFeelings(
          Array.isArray(primaryResponse?.data) ? primaryResponse.data : []
        );
      } catch (error) {
        console.error("Error fetching primary feelings:", error);
        setPrimaryFeelings([]);
      } finally {
        setFetchStatus("succeeded");
      }
    };

    fetchFeelings();
  }, []);

  // Fetch secondary feelings based on primary feeling
  const fetchSecondaryFeelings = async (primaryId) => {
    if (!primaryId) {
      setSecondaryFeelings([]);
      return;
    }

    setIsLoadingSecondary(true);
    try {
      const secondaryResponse = await getCall(
        `/admin/getSecondaryFeelingsBasedOnPrimaryFeeling?primary_feeling_id=${primaryId}`
      );
      setSecondaryFeelings(secondaryResponse?.data || []);
    } catch (error) {
      console.error("Error fetching secondary feelings:", error);
      setSecondaryFeelings([]);
    } finally {
      setIsLoadingSecondary(false);
    }
  };

  // Handle primary feeling change
  const handlePrimaryFeelingChange = (e) => {
    const primaryId = e.target.value;
    setFilters((prev) => ({
      ...prev,
      primary_feeling_id: primaryId,
      secondary_feeling_id: "",
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSecondaryFeelings(primaryId);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(pagination.total / pagination.limit)
    ) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Fetch kids data with filters and pagination
  const fetchKidsData = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.primary_feeling_id) {
        queryParams.append(
          "primary_feeling_search",
          filters.primary_feeling_id
        );
      }
      if (filters.secondary_feeling_id) {
        queryParams.append(
          "secondary_feeling_search",
          filters.secondary_feeling_id
        );
      }
      if (filters.startDate) {
        queryParams.append("start_date", filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append("end_date", filters.endDate);
      }
      queryParams.append("page", pagination.page);
      queryParams.append("limit", pagination.limit);

      // Fetch kids data
      const [kidsResponse, feelingsResponse] = await Promise.all([
        getById("/kids/getKidsByID?kid_id", id, false),
        getCall(
          `/kidsFeelings/getKidsFeelingByKidId?kid_id=${id}&${queryParams.toString()}`,
          false
        ),
      ]);

      setKidsData(kidsResponse?.data || {});
      setKidsLogData(feelingsResponse?.data || []);
      setPagination((prev) => ({
        ...prev,
        total: feelingsResponse?.pagination?.totalRecords || 0,
      }));
    } catch (error) {
      console.error("Error fetching kids data:", error);
      setKidsData({});
      setKidsLogData([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch and when filters/pagination change
  useEffect(() => {
    fetchKidsData();
  }, [id, filters, pagination.page, pagination.limit]);

  // Extract properties directly from kidsData
  const { username, email, first_name, last_name, is_deleted } = kidsData;

  const data = [
    { key: "Username", value: username || "N/A" },
    { key: "Email", value: email || "N/A" },
    { key: "First Name", value: first_name || "N/A" },
    { key: "Last Name", value: last_name || "N/A" },
    { key: "Status", value: is_deleted === 0 ? "Active" : "Deactive" || "N/A" },
  ];

  const columns = [
    {
      key: "checkinDate",
      label: "Check In",
      render: (item) =>
        moment(item?.checkinDate).format("MMMM D, YYYY [at] h:mm A"),
    },
    {
      key: "primary_feeling_id",
      label: "Primary Name",
      render: (item) => item.primary_feeling_id?.name || "N/A",
    },
    {
      key: "secondary_feeling_id",
      label: "Secondary Feeling",
      render: (item) => item.secondary_feeling_id?.name || "N/A",
    },
    {
      key: "is_enable_want_to_talk_someone",
      label: "Want To Talk",
      render: (item) => item.is_enable_want_to_talk_someone || "N/A",
    },
  ];

  // Calculate the range of records being displayed
  const startRecord = (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <>
      <CommonView
        title="Kids Details"
        name={username}
        data={data}
        isLoading={isLoading}
      />

      {/* Filters Section */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="primary_feeling_id" className="form-label">
                Primary Feeling
              </label>
              <div className="select-wrapper">
                <select
                  id="primary_feeling_id"
                  name="primary_feeling_id"
                  className="form-control"
                  value={filters.primary_feeling_id}
                  onChange={handlePrimaryFeelingChange}
                  disabled={fetchStatus === "loading"}
                >
                  <option value="">All Primary Feelings</option>
                  {primaryFeelings.map((feeling) => (
                    <option key={feeling._id} value={feeling._id}>
                      {feeling.name}
                    </option>
                  ))}
                </select>
                <span className="dropdown-icon">
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="secondary_feeling_id" className="form-label">
                Secondary Feeling
              </label>
              <div className="select-wrapper">
                <select
                  id="secondary_feeling_id"
                  name="secondary_feeling_id"
                  className="form-control"
                  value={filters.secondary_feeling_id}
                  onChange={handleFilterChange}
                  disabled={
                    fetchStatus === "loading" ||
                    isLoadingSecondary ||
                    !filters.primary_feeling_id
                  }
                >
                  <option value="">All Secondary Feelings</option>
                  {secondaryFeelings.map((feeling) => (
                    <option key={feeling._id} value={feeling._id}>
                      {feeling.name}
                    </option>
                  ))}
                </select>
                <span className="dropdown-icon">
                  <i className="bi bi-chevron-down"></i>
                </span>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="startDate" className="form-label">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3 mb-3">
              <label htmlFor="endDate" className="form-label">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      </div>

      <CommonTable columns={columns} data={kidsLogData} isLoading={isLoading} />

      {/* Pagination Controls */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <label className="me-2">Rows per page:</label>
                <select
                  className="form-select"
                  style={{ width: "auto" }}
                  value={pagination.limit}
                  onChange={handleLimitChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="ms-3">
                  Showing {startRecord}-{endRecord} of {pagination.total}{" "}
                  records
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end">
                <nav aria-label="Page navigation">
                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${
                        pagination.page === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((pageNum) => (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          pagination.page === pageNum ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        pagination.page >= totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewKids;
