import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const InvalidDataModal = ({ show, handleClose, invalidData }) => {
  const [visibleCount, setVisibleCount] = useState(10); 

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 10); 
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Invalid Data Entries</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}> 
        {invalidData.length > 0 ? (
          <ul>
            {invalidData.slice(0, visibleCount).map((item, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <div><strong>Row:</strong> {item.row || "N/A"}</div>
                <div><strong>Columns:</strong> {item.columns || "N/A"}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No invalid data entries.</p>
        )}
        {visibleCount < invalidData.length && (
          <Button variant="link" onClick={handleShowMore}>
            Show More
          </Button>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvalidDataModal;
