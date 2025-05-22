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

const KidsFeelingList = () => {
  const [data, setData] = useState([]);
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
  } = usePaginationData({ total: 0, per_page: 10, last_page: 1 });

  // Fetch data
  const fetchData = async () => {
    setStatus("loading");
    try {
      const response = await getCall(
        `/kidsFeelings/getAllKidsFeelings?search=${inputValue}`
      );

      // Process the response to extract secondary kids
      let processedData = [];
      if (response?.data) {
        // If a single object with secondary_kids array
        if (!Array.isArray(response.data) && response.data.secondary_kids) {
          processedData = response.data.secondary_kids;
        }
        // If an array of objects with secondary_kids arrays
        else if (Array.isArray(response.data)) {
          response.data.forEach((item) => {
            if (item.secondary_kids && Array.isArray(item.secondary_kids)) {
              processedData = [...processedData, ...item.secondary_kids];
            } else {
              processedData.push(item);
            }
          });
        }
        // If direct array of secondary kids
        else {
          processedData = Array.isArray(response.data)
            ? response.data
            : [response.data];
        }
      }

      setData(processedData);
      console.log("Processed data:", processedData);
    } catch (error) {
      console.error("Error fetching data", error);
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
      // Determine IDs to delete: use selectedIds for bulk, or deleteId for single
      const idsToDelete = selectedIds.length > 0 ? selectedIds : [deleteId];

      // Perform deletion for each ID
      await Promise.all(
        idsToDelete.map((id) =>
          deleteCall(`/admin/deleteSecondaryFeeling?secondary_feeling_id=${id}`)
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
      console.error("Error deleting kids:", error);
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
      key: "kid_id",
      label: "Kids",
      render: (item) =>
        item?.kid_id?.first_name + " " + item?.kid_id?.last_name || "N/A",
    },
    {
      key: "primary_feeling_id",
      label: "Primary Feeling",
      render: (item) => item?.primary_feeling_id?.name || "N/A",
    },
    {
      key: "secondary_feeling_id",
      label: "Secondary Feeling",
      render: (item) => item?.secondary_feeling_id?.name || "N/A",
    },
  ];

  return (
    <>
      <CommonLayout title="Kids feeling List">
        <div className="search-main mb-3">
          <CommonSearchBar
            searchQuery={inputValue}
            setSearchQuery={handleInputChange}
            placeholder="Search feeling"
          />
          <div className="btn-container">
            {selectedIds.length > 0 ? (
              <BulkDeleteButton
                onClick={() => showDeleteConfirmation(selectedIds)}
              />
            ) : (
              // <AddLinkButton to="/add-kids-feeling" />
              ""
            )}
          </div>
        </div>

        <CommonTable
          columns={columns}
          data={data}
          isLoading={status === "loading"}
          actions={(item) => (
            <>
              {/* <EditButton
                onClick={() => navigate(`/edit-feeling/${item._id}`)}
              /> */}
              <ViewButton
                onClick={() => navigate(`/view-feeling/${item._id}`)}
              />
              <DeleteButton onClick={() => showDeleteConfirmation(item._id)} />
            </>
          )}
        />

        {/* Uncomment and update if pagination is needed */}
        {/* {data?.length > 0 && (
          <PaginationData
            currentPage={currentPage}
            perPage={perPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            handlePageChange={handlePageChange}
            totalPage={data.length}
            lastPage={1}
          />
        )} */}
      </CommonLayout>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleDelete}
        isDeleting={status}
        message={`Are you sure you want to delete ${
          selectedIds.length > 1 || (selectedIds.length === 0 && !deleteId)
            ? "these kids"
            : "this feeling"
        }?`}
      />
    </>
  );
};

export default KidsFeelingList;
