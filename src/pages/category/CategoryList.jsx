import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddLinkButton,
  BulkDeleteButton,
  CommonSearchBar,
  DeleteButton,
  EditButton,
  ViewButton,
} from "../../components/buttons/Buttons";
import CommonTable from "../../components/commonTable/CommonTable";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import usePaginationData from "../../hook/usePaginationData";
import PaginationData from "../../components/pagination/PaginationData";
import useSearchData from "../../hook/useSearchData";
import DeleteConfirmationModal from "../../components/deleteModel/DeleteConfirmationModal";
import { deleteCall, getCall } from "../../utils/api";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [dataPagination, setDataPagination] = useState([]);
  const [status, setStatus] = useState("idle");
  const [deleteId, setDeleteId] = useState(null); // For single deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); // For bulk deletion
  const navigate = useNavigate();

  const { inputValue, handleInputChange } = useSearchData();

  const {
    currentPage,
    perPage,
    handleRowsPerPageChange,
    rowsPerPageOptions,
    handlePageChange,
  } = usePaginationData({
    total: dataPagination?.totalCount || 0,
    per_page: dataPagination?.pageSize || 10,
    last_page: dataPagination?.totalPages || 1,
  });

  // Fetch data
  const fetchData = async () => {
    setStatus("loading");
    try {
      const response = await getCall(
        `/admin/getPrimaryFeelings?search=${inputValue}&page=${currentPage}&per_page=${perPage}`
      );
      setData(response?.data || []);
      setDataPagination(response);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching data", error);
      setData([]);
      setDataPagination([]);
    } finally {
      setStatus("succeeded");
    }
  };

  useEffect(() => {
    fetchData();
  }, [inputValue, currentPage, perPage]);

  const handleDeleteClose = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      // Determine IDs to delete: use selectedIds for bulk, or deleteId for single
      const idsToDelete = selectedIds.length > 0 ? selectedIds : [deleteId];

      // Perform deletion for each ID
      await Promise.all(
        idsToDelete.map((id) =>
          deleteCall(`/admin/deletePrimaryFeeling?primary_feeling_id=${id}`)
        )
      );

      // Update local state to remove deleted items
      setData((prevData) =>
        prevData.filter((item) => !idsToDelete.includes(item._id))
      );

      // Clear selections and close modal
      setSelectedIds([]);
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting categories:", error);
    }
  };

  const showDeleteConfirmation = (id) => {
    if (Array.isArray(id)) {
      // Bulk delete
      setSelectedIds(id);
      setDeleteId(null);
    } else {
      // Single delete
      setDeleteId(id);
      setSelectedIds([]);
    }
    setShowDeleteModal(true);
  };

  const handleSelectAllOnPage = (e) => {
    const allIdsOnPage = data?.map((item) => item._id) || [];
    if (e.target.checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...allIdsOnPage])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.includes(id)));
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const isAllOnPageSelected =
    data?.length > 0 && data?.every((item) => selectedIds.includes(item._id));

  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={isAllOnPageSelected}
          onChange={handleSelectAllOnPage}
        />
      ),
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item._id)}
          onChange={() => handleSelect(item._id)}
        />
      ),
    },
    {
      key: "categoryName",
      label: "Category Name",
      render: (item) => item.name,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => item.status,
    },
    {
      key: "color_code",
      label: "Color Code",
      render: (item) => item.color_code,
    },
    {
      key: "icon",
      label: "Icon",
      render: (item) =>
        item.icon ? (
          <img
            key={item?._id}
            src={item.icon}
            alt={item.name}
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          "No Icon"
        ),
    },
  ];

  return (
    <>
      <CommonLayout title="Category List">
        <div className="search-main mb-3">
          <CommonSearchBar
            searchQuery={inputValue}
            setSearchQuery={handleInputChange}
            placeholder="Search category"
          />
          <div className="btn-container">
            {selectedIds.length > 0 ? (
              <BulkDeleteButton
                onClick={() => showDeleteConfirmation(selectedIds)}
              />
            ) : (
              <AddLinkButton to="/add-category" />
            )}
          </div>
        </div>

        <CommonTable
          columns={columns}
          data={data}
          isLoading={status === "loading"}
          actions={(item) => (
            <>
              <EditButton
                onClick={() => navigate(`/edit-category/${item._id}`)}
              />
              <ViewButton
                onClick={() => navigate(`/view-category/${item._id}`)}
              />
              <DeleteButton onClick={() => showDeleteConfirmation(item._id)} />
            </>
          )}
          rowClick={(item) =>
            navigate(`/${item.name.toLowerCase().replace(/\s+/g, "")}list`)
          }
        />

        {/* Uncomment and update if pagination is needed */}
        {data?.length > 0 && (
          <PaginationData
            currentPage={dataPagination?.currentPage}
            perPage={dataPagination?.pageSize}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            handlePageChange={handlePageChange}
            totalPage={dataPagination?.totalCount}
            lastPage={dataPagination?.totalPages || 1}
          />
        )}
      </CommonLayout>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        isDeleting={status}
        message={`Are you sure you want to delete ${
          selectedIds.length > 1 || (selectedIds.length === 0 && !deleteId)
            ? "these categories"
            : "this category"
        }?`}
      />
    </>
  );
};

export default CategoryList;
