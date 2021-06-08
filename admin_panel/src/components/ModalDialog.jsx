import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalDialog(show, handleClose, deleteUser) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={() => deleteUser()}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalDialog;
