import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/deleteModel/DeleteConfirmationModal";
import FileModal from "../../components/fileModal/FileModal";
import toast from "react-hot-toast";
import {
  AddLinkButton,
  BulkDeleteButton,
  CommonSearchBar,
  DeleteButton,
  EditButton,
  UploadButton,
  ViewButton,
} from "../../components/buttons/Buttons";
import CommonTable from "../../components/commonTable/CommonTable";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import usePaginationData from "../../hook/usePaginationData";
import PaginationData from "../../components/pagination/PaginationData";
import useSearchData from "../../hook/useSearchData";
import InvalidDataModal from "../../components/invalidDataModal/InvalidDataModal";

const CardList = () => {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFile, setShowFile] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showInvalidDataModal, setShowInvalidDataModal] = useState(false);
  const [invalidData, setInvalidData] = useState([]);
  const navigate = useNavigate();

  const { inputValue, handleInputChange } = useSearchData();
  const payload = {
    query: inputValue || undefined,
  };

  const {
    currentPage,
    setCurrentPage,
    perPage,
    handleRowsPerPageChange,
    rowsPerPageOptions,
    handlePageChange,
  } = usePaginationData(data?.meta);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      try {
        // Simulate fetching dummy data
        console.log("Fetching card data...");
        const response = {
          data: [
            { id: 1, name: "Card 1", bank_name: "Bank A", network_type: "Visa", type: "Credit", image: "path/to/image1.jpg" },
            { id: 2, name: "Card 2", bank_name: "Bank B", network_type: "Mastercard", type: "Debit", image: "path/to/image2.jpg" },
            { id: 3, name: "Card 3", bank_name: "Bank C", network_type: "American Express", type: "Credit", image: "path/to/image3.jpg" },
          ],
          meta: { total: 3, per_page: 10, last_page: 1 },
        }; // Mock response
        setData(response);
      } catch (error) {
        console.log("Error fetching card data");
      } finally {
        setStatus("succeeded");
      }
    };

    fetchData();
  }, [inputValue, currentPage, perPage]);

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleMultipleDelete = async () => {
    console.log("Deleting cards with IDs:", selectedIds);
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
      setSelectedIds((prevSelectedIds) => [
        ...new Set([...prevSelectedIds, ...allIdsOnPage]),
      ]);
    } else {
      setSelectedIds((prevSelectedIds) =>
        prevSelectedIds.filter((id) => !allIdsOnPage.includes(id))
      );
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
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
      key: "image",
      label: "Card Image",
      render: (item) => (
        <img
          src={item?.image}
          alt={item?.name}
          style={{ width: "100px", height: "50px" }}
        />
      ),
    },
    {
      key: "name",
      label: "Card Name",
    },
    {
      key: "bank_name",
      label: "Bank Name",
      render: (item) => (item?.bank_name ? item.bank_name : "N/A"),
    },
    {
      key: "network_type",
      label: "Network Type",
    },
    {
      key: "type",
      label: "Card Type",
      render: (item) =>
        item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1),
    },
  ];

  return (
    <>
      <CommonLayout title="Cards">
        <div className="search-main mb-3">
          <CommonSearchBar
            searchQuery={inputValue}
            setSearchQuery={handleInputChange}
            placeholder="Search bank, network, card name, type"
          />
          <div className="btn-container">
            <UploadButton onClick={() => setShowFile(true)} />
            {selectedIds.length > 0 ? (
              <>
                <BulkDeleteButton onClick={() => showDeleteConfirmation(selectedIds)} />
              </>
            ) : (
              <AddLinkButton to="/add-card" />
            )}
          </div>
        </div>

        <CommonTable
          columns={columns}
          data={data?.data}
          isLoading={status === "loading"}
          actions={(item) => (
            <>
              <EditButton onClick={() => navigate(`/edit-card/${item.id}`)} />
              <ViewButton onClick={() => navigate(`/view-card/${item?.id}`)} />
              <DeleteButton onClick={() => showDeleteConfirmation(item.id)} />
            </>
          )}
        />

        {data?.data?.length > 0 && (
          <PaginationData
            currentPage={currentPage}
            perPage={data?.meta?.per_page}
            handleRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            handlePageChange={handlePageChange}
            totalPage={data?.meta?.total}
            lastPage={data?.meta?.last_page}
          />
        )}
      </CommonLayout>
      <InvalidDataModal
        show={showInvalidDataModal}
        handleClose={() => setShowInvalidDataModal(false)}
        invalidData={invalidData}
      />
      <FileModal
        show={showFile}
        handleClose={() => setShowFile(false)}
        initialValues={{ file: null }}
        // onSubmit={handleFileSubmit}
        isLoadingCSV={status === "loading"}
        title="Card"
      />
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={handleDeleteClose}
        handleDelete={handleMultipleDelete}
        message={`Are you sure you want to delete ${
          selectedIds.length > 1 ? "these cards" : "this card"
        }?`}
      />
    </>
  );
};

export default CardList;
