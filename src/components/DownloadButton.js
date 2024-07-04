
import React from 'react';
import axios from 'axios';

const DownloadButton = () => {
  const handleDownload = async () => {
    const response = await axios.get('http:localhost:5000/api/download', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'allocation_results.csv');
    document.body.appendChild(link);
    link.click();
  };

  return <button onClick={handleDownload} className="btn btn-secondary" >Download Allocation Results</button>;
};

export default DownloadButton;
