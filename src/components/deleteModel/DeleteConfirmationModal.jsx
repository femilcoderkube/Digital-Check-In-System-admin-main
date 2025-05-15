import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteConfirmationModal = ({
  show,
  handleClose,
  handleDelete,
  isDeleting,
  message = "Are you sure you want to delete this item?",
}) => {
  const isLoading = isDeleting === "loading";
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
