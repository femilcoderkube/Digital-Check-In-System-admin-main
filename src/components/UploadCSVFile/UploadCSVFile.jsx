import React, { useState } from 'react';

const UploadCSVFile = () => {
  const [uploadedData, setUploadedData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const csv = e.target.result;
        processCSV(csv);
      };

      reader.readAsText(file);
    }
  };

  const processCSV = (csv) => {
    const rows = csv.split("\n");
    const parsedData = rows.slice(1).map((row) => {
      const [id, name, email] = row.split(",");
      return { id, name, email };
    });
    
    setUploadedData(parsedData);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {uploadedData.length > 0 && (
        <div>
          <h3>Uploaded Users</h3>
          <ul>
            {uploadedData.map((user, index) => (
              <li key={index}>
                {user.id} - {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadCSVFile;
