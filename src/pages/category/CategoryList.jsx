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

const CategoryList = () => {
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
  } = usePaginationData({ total: 4, per_page: 10, last_page: 1 });

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      try {
        const response = {
          data: [
            { id: 1, categoryName: "Happy" },
            { id: 2, categoryName: "Sad" },
            { id: 3, categoryName: "Social" },
            { id: 4, categoryName: "AntiSocial" },
          ],
          meta: { total: 4, per_page: 10, last_page: 1 },
        };
        setData(response);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setStatus("succeeded");
      }
    };

    fetchData();
  }, [inputValue, currentPage, perPage]);

  const handleDeleteClose = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };

  const handleMultipleDelete = () => {
    console.log("Deleting categories with IDs:", selectedIds);
    setSelectedIds([]);
    handleDeleteClose();
  };

  const showDeleteConfirmation = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleSelectAllOnPage = (e) => {
    const allIdsOnPage = data?.data?.map((item) => item.id);
    if (e.target.checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...allIdsOnPage])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.includes(id)));
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const isAllOnPageSelected =
    data?.data?.length > 0 &&
    data?.data?.every((item) => selectedIds.includes(item.id));

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
          checked={selectedIds.includes(item.id)}
          onChange={() => handleSelect(item.id)}
        />
      ),
    },
    {
      key: "categoryName",
      label: "Category Name",
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
              <BulkDeleteButton onClick={() => showDeleteConfirmation(selectedIds)} />
            ) : (
              <AddLinkButton to="/add-category" />
            )}
          </div>
        </div>

        <CommonTable
          columns={columns}
          data={data?.data}
          isLoading={status === "loading"}
          actions={(item) => (
            <>
              {/* Optional action buttons */}
              {/* <EditButton onClick={() => navigate(`/edit-category/${item.id}`)} />
              <ViewButton onClick={() => navigate(`/view-category/${item.id}`)} />
              <DeleteButton onClick={() => showDeleteConfirmation(item.id)} /> */}
            </>
          )}
          rowClick={(item) =>
            navigate(`/${item.categoryName.toLowerCase().replace(/\s+/g, "")}list`)
          }
        />

        {data?.data?.length > 0 && (
          <PaginationData
            currentPage={currentPage}
            perPage={perPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            handlePageChange={handlePageChange}
            totalPage={data?.meta?.total}
            lastPage={data?.meta?.last_page}
          />
        )}
      </CommonLayout>

      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleMultipleDelete}
        message={`Are you sure you want to delete ${
          selectedIds.length > 1 ? "these categories" : "this category"
        }?`}
      />
    </>
  );
};

export default CategoryList;
