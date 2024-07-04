
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUpload }) => {
  const [groupFile, setGroupFile] = useState(null);
  const [hostelFile, setHostelFile] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('groupFile', groupFile);
    formData.append('hostelFile', hostelFile);
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    onUpload(response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="file-upload-form">
      <div className="form-group">
        <label>Group Information CSV</label>
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, setGroupFile)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Hostel Information CSV</label>
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, setHostelFile)} className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary">Upload</button>
    </form>
  );
};

export default FileUpload;
