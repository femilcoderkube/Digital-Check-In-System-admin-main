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

const GuidanceList = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const { inputValue, handleInputChange } = useSearchData();

  const {
    currentPage,
    perPage,
    handleRowsPerPageChange,
    rowsPerPageOptions,
    handlePageChange,
    total,
    lastPage,
  } = usePaginationData({ total: 0, per_page: 10, last_page: 1 });

  const fetchData = async () => {
    setStatus("loading");
    try {
      const response = await getCall(
        `/guidance/getGuidance?page=${currentPage}&limit=${perPage}&search=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setData(response?.data || []);
      console.log("response", response?.data);
    } catch (error) {
      console.error("Error fetching guidance data", error);
      setData([]);
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
      const idsToDelete = selectedIds.length > 0 ? selectedIds : [deleteId];
      await Promise.all(
        idsToDelete.map((id) =>
          deleteCall(`/guidance/deleteGuidance?guidance_id=${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      setData((prevData) =>
        prevData.filter((item) => !idsToDelete.includes(item._id))
      );
      setSelectedIds([]);
      handleDeleteClose();
    } catch (error) {
      console.error("Error deleting guidance:", error);
    }
  };

  const showDeleteConfirmation = (id) => {
    if (Array.isArray(id)) {
      setSelectedIds(id);
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setSelectedIds([]);
    }
    setShowDeleteModal(true);
  };

  const handleSelectAllOnPage = (e) => {
    const allIdsOnPage = data?.map((item) => item._id) || [];
    if (e.target.checked) {
    //   InflatedTableCell from "@mui/material";
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
      key: "primaryFeeling",
      label: "Primary Feeling",
      render: (item) => item.primaryFeeling?.name || "N/A",
    },
    {
      key: "secondaryFeeling",
      label: "Secondary Feeling",
      render: (item) => item.secondaryFeeling?.name || "N/A",
    },
    {
      key: "description",
      label: "Description",
      render: (item) => item.description,
    },
  ];

  return (
    <>
      <CommonLayout title="Guidance List">
        <div className="search-main mb-3">
          <CommonSearchBar
            searchQuery={inputValue}
            setSearchQuery={handleInputChange}
            placeholder="Search guidance"
          />
          <div className="btn-container">
            {selectedIds.length > 0 ? (
              <BulkDeleteButton
                onClick={() => showDeleteConfirmation(selectedIds)}
              />
            ) : (
              <AddLinkButton to="/add-guidance" />
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
                onClick={() => navigate(`/edit-guidance/${item._id}`)}
              />
              <ViewButton
                onClick={() => navigate(`/view-guidance/${item._id}`)}
              />
              <DeleteButton onClick={() => showDeleteConfirmation(item._id)} />
            </>
          )}
          rowClick={(item) => navigate(`/guidance/${item._id}`)}
        />

        {data?.length > 0 && (
          <PaginationData
            currentPage={currentPage}
            perPage={perPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            handlePageChange={handlePageChange}
            totalPage={total}
            lastPage={lastPage}
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
            ? "these guidance entries"
            : "this guidance entry"
        }?`}
      />
    </>
  );
};

export default GuidanceList;