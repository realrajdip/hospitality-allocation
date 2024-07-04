// src/App.js
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AllocationDisplay from './components/AllocationDisplay';
import DownloadButton from './components/DownloadButton';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [allocations, setAllocations] = useState([]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Hospitality Allocation System By Rajdip</h1>
      <FileUpload onUpload={setAllocations} />
      {allocations.length > 0 && (
        <>
          <AllocationDisplay allocations={allocations} />
          <DownloadButton />
        </>
      )}
    </div>
  );
};

export default App;
